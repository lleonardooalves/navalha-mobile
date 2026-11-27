import { api, ErroApi, renovarTokens } from '@/api/client';
import { BARBEARIA_SLUG } from '@/api/config';
import { lerRefreshToken, limparSessao, salvarTokens, useSessao } from './store';
import { Schema } from '@/api/types';

export async function entrar(email: string, senha: string) {
  const { data, error, response } = await api.POST('/auth/login', {
    body: { slug: BARBEARIA_SLUG, email, senha },
  });
  if (!data) {
    throw new ErroApi(response.status, error);
  }
  await salvarTokens(data);
  await carregarPerfil();
}

export async function cadastrar(dados: Omit<Schema<'CadastroDto'>, 'slug'>) {
  const { data, error, response } = await api.POST('/auth/cadastro', {
    body: { ...dados, slug: BARBEARIA_SLUG },
  });

  if (!data) {
    throw new ErroApi(response.status, error);
  }
  await salvarTokens(data);
  await carregarPerfil();
}

export async function sair() {
  const refreshToken = await lerRefreshToken();

  if (refreshToken) {
    await api.POST('/auth/sair', { body: { refreshToken } }).catch(() => undefined);
  }
  await limparSessao();
}

export async function restaurar() {
  try {
    const accessToken = await renovarTokens();
    if (!accessToken) {
      useSessao.setState({ status: 'deslogado' });
      return;
    }
    await carregarPerfil();
  } catch {
    useSessao.setState({ status: 'deslogado' });
  }
}

async function carregarPerfil() {
  const { data, error, response } = await api.GET('/me');
  if (!data) {
    throw new ErroApi(response.status, error);
  }
  useSessao.setState({ status: 'logado', usuario: data });
}
