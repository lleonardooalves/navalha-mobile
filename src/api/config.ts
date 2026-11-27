function lerEnv(nome: string, valor: string | undefined) {
  if (!valor) {
    throw new Error(`${nome} não definida: confira o .env`);
  }
  return valor;
}

export const API_URL = lerEnv('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL);
export const BARBEARIA_SLUG = lerEnv(
  'EXPO_PUBLIC_BARBEARIA_URL',
  process.env.EXPO_PUBLIC_BARBEARIA_SLUG,
);
