// tema padrão do Navalha: grafite com bronze
export const colors = {
  background: '#121110',
  surface: '#1C1A18',
  surfaceRaised: '#262320',
  border: '#34302B',
  text: '#F3EEE6',
  textSecondary: '#A39B8F',
  accent: '#C9A36A',
  onAccent: '#141210',
  success: '#7FB38A',
  warning: '#D98C5F',
  now: '#E07A5F',
} as const;

// os nomes são as chaves carregadas pelo useFonts no _layout
export const fonts = {
  title: 'BricolageGrotesque_700Bold',
  titleSemiBold: 'BricolageGrotesque_600SemiBold',
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 28,
  full: 999,
} as const;

// área mínima de toque
export const touchMin = 44;
