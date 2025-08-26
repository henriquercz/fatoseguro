/**
 * Componente wrapper para fechar o teclado ao tocar fora dele
 * Funciona tanto no Android quanto no iOS
 * Autor: Equipe CheckNow
 * Data: 2025-01-27
 */

import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';

interface KeyboardDismissWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * Wrapper que permite fechar o teclado ao tocar fora dos campos de input
 * 
 * @param children - Componentes filhos
 * @param style - Estilos customizados para o container
 * @param disabled - Se true, desabilita a funcionalidade de fechar o teclado
 */
export const KeyboardDismissWrapper: React.FC<KeyboardDismissWrapperProps> = ({
  children,
  style,
  disabled = false,
}) => {
  const handleDismissKeyboard = () => {
    if (!disabled) {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardDismissWrapper;
