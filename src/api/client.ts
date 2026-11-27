import createClient, { type Middleware } from 'openapi-fetch';
import { paths } from './schema';
import { API_URL } from './config';
import { lerRefreshToken, limparSessao, salvarTokens, useSessao } from '@/auth/store';

export const api = createClient<paths>({ baseUrl: API_URL });

export class ErroApi extends Error {
  status: number;

  constructor(status: number, corpo: unknown) {
    super(mensagemDoCorpo(corpo) ?? `Erro ${status} na API`);
    this.status = status;
  }
}

function mensagemDoCorpo(corpo: unknown) {
  if (typeof corpo !== 'object' || corpo === null || !('message' in corpo)) {
    return undefined;
  }
  const { message } = corpo;

  if (Array.isArray(message)) {
    return message.join('\n');
  }
  return typeof message === 'string' ? message : undefined;
}

let renovando: Promise<string | null> | null = null;

export function renovarTokens() {
  renovando ??= renovar().finally(() => {
    renovando = null;
  });
  return renovando;
}

async function renovar() {
  const refreshToken = await lerRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const { data, response } = await api.POST('/auth/renovar', { body: { refreshToken } });

  if (data) {
    await salvarTokens(data);
    return data.accessToken;
  }
  if (response.status === 401) {
    await limparSessao();
  }
  return null;
}

const copias = new Map<string, Request>();

const autenticacao: Middleware = {
  onRequest({ request, schemaPath, id }) {
    if (schemaPath.startsWith('/auth/')) {
      return;
    }
    const { accessToken } = useSessao.getState();
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    copias.set(id, request.clone());
    return request;
  },

  async onResponse({ response, id, options }) {
    const copia = copias.get(id);
    copias.delete(id);
    if (response.status !== 401 || !copia) {
      return;
    }
    const accessToken = await renovarTokens();
    if (!accessToken) {
      return;
    }
    copia.headers.set('Authorization', `Bearer ${accessToken}`);
    return options.fetch(copia);
  },
  onError({ id }) {
    copias.delete(id);
  },
};

api.use(autenticacao);
