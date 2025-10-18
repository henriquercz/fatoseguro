import * as Haptics from 'expo-haptics';

/**
 * Feedback háptico leve para ações simples
 * Uso: Cliques em botões, seleção de itens
 */
export const lightHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Feedback háptico médio para ações importantes
 * Uso: Confirmações, navegação
 */
export const mediumHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Feedback háptico forte para ações críticas
 * Uso: Erros, alertas, ações destrutivas
 */
export const heavyHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Feedback háptico de sucesso
 * Uso: Operações concluídas com sucesso
 */
export const successHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Feedback háptico de aviso
 * Uso: Avisos, atenção necessária
 */
export const warningHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Feedback háptico de erro
 * Uso: Erros, falhas em operações
 */
export const errorHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Feedback háptico de seleção
 * Uso: Mudança de abas, seleção em listas
 */
export const selectionHaptic = () => {
  Haptics.selectionAsync();
};
