import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AdDisplayProps {
  onClose: () => void;
}

export default function AdDisplay({ onClose }: AdDisplayProps) {
  const [countdown, setCountdown] = useState(5);
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.adContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.adHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.adLabel, { color: colors.textSecondary }]}>ANÚNCIO</Text>
          {countdown === 0 ? (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.countdownContainer, { backgroundColor: colors.textSecondary }]}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.adContent}>
          <View style={[styles.adPlaceholder, { backgroundColor: colors.background }]}>
            <Text style={[styles.adPlaceholderText, { color: colors.textSecondary }]}>Anúncio</Text>
          </View>
          
          <Text style={[styles.adMessage, { color: colors.text }]}>
            Adquira o plano premium para remover anúncios e ter verificações ilimitadas!
          </Text>
          
          {countdown === 0 && (
            <TouchableOpacity style={[styles.closeAdButton, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.closeAdButtonText}>Continuar para o resultado</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  adContainer: {
    borderRadius: 12,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // backgroundColor aplicada via tema
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    // backgroundColor e borderBottomColor aplicadas via tema
  },
  adLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    // color aplicada via tema
  },
  closeButton: {
    padding: 4,
  },
  countdownContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor aplicada via tema
  },
  countdownText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  adContent: {
    padding: 16,
    alignItems: 'center',
  },
  adPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    // backgroundColor aplicada via tema
  },
  adPlaceholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    // color aplicada via tema
  },
  adMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    // color aplicada via tema
  },
  closeAdButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    // backgroundColor aplicada via tema
  },
  closeAdButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});