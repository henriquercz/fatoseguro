/**
 * ====================================
 * TUTORIAL ERROR BOUNDARY
 * Captura erros do tutorial para não crashar o app
 * ====================================
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TutorialErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Erro no Tutorial:', error);
    console.error('Detalhes:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza UI de fallback minimalista
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            ⚠️ Erro no tutorial
          </Text>
          <Text style={styles.errorDetail}>
            {this.state.error?.message || 'Erro desconhecido'}
          </Text>
          <TouchableOpacity 
            onPress={() => this.setState({ hasError: false })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continuar sem tutorial</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDetail: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
