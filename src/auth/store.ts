import type { Schema } from '@/api/types';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type Tokens = Schema<'TokensRespostaDto'>;

type EstadoSessao = {
  status: 'carregando' | 'deslogado' | 'logado';
  accessToken: string | null;
  usuario: Schema<'PerfilDto'> | null;
};

const CHAVE_REFRESH = 'navalha.refreshToken';

export const useSessao = create<EstadoSessao>()(() => ({
  status: 'carregando',
  accessToken: null,
  usuario: null,
}));

export function lerRefreshToken() {
  return SecureStore.getItemAsync(CHAVE_REFRESH);
}

export async function salvarTokens({ accessToken, refreshToken }: Tokens) {
  await SecureStore.setItemAsync(CHAVE_REFRESH, refreshToken);
  useSessao.setState({ accessToken });
}

export async function limparSessao() {
  await SecureStore.deleteItemAsync(CHAVE_REFRESH);
  useSessao.setState({ status: 'deslogado', accessToken: null, usuario: null });
}
