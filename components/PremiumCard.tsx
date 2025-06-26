import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PremiumFeature {
  text: string;
}

interface PremiumCardProps {
  title: string;
  price: string;
  period: string;
  features: PremiumFeature[];
  highlighted?: boolean;
  onPress: () => void;
}

export default function PremiumCard({
  title,
  price,
  period,
  features,
  highlighted = false,
  onPress,
}: PremiumCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        highlighted && [styles.highlightedContainer, { borderColor: colors.primary }],
      ]}>
      {highlighted && <View style={[styles.highlightBadge, { backgroundColor: colors.primary }]}><Text style={styles.highlightText}>Recomendado</Text></View>}
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>R$</Text>
          <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
        </View>
        <Text style={[styles.period, { color: colors.textSecondary }]}>{period}</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <CheckCircle2 size={18} color={colors.success || "#22C55E"} />
            <Text style={[styles.featureText, { color: colors.text }]}>{feature.text}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          highlighted ? [styles.highlightedButton, { backgroundColor: colors.primary }] : [styles.normalButton, { backgroundColor: colors.background, borderColor: colors.border }],
        ]}
        onPress={onPress}>
        <Text
          style={[
            styles.buttonText,
            highlighted ? styles.highlightedButtonText : [styles.normalButtonText, { color: colors.text }],
          ]}>
          Assinar Agora
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  highlightedContainer: {
    borderWidth: 2,
    transform: [{ scale: 1.03 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  highlightBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -65 }],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  highlightText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginTop: 4,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
  },
  period: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginLeft: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  normalButton: {
    borderWidth: 1,
  },
  highlightedButton: {
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  normalButtonText: {
  },
  highlightedButtonText: {
    color: '#FFFFFF',
  },
});