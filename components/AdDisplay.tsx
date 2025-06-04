import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface AdDisplayProps {
  onClose: () => void;
}

export default function AdDisplay({ onClose }: AdDisplayProps) {
  const [countdown, setCountdown] = useState(5);

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
      <View style={styles.adContainer}>
        <View style={styles.adHeader}>
          <Text style={styles.adLabel}>ANÚNCIO</Text>
          {countdown === 0 ? (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.adContent}>
          <View style={styles.adPlaceholder}>
            <Text style={styles.adPlaceholderText}>Anúncio</Text>
          </View>
          
          <Text style={styles.adMessage}>
            Adquira o plano premium para remover anúncios e ter verificações ilimitadas!
          </Text>
          
          {countdown === 0 && (
            <TouchableOpacity style={styles.closeAdButton} onPress={onClose}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  adLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  closeButton: {
    padding: 4,
  },
  countdownContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  adPlaceholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#9CA3AF',
  },
  adMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  closeAdButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeAdButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});