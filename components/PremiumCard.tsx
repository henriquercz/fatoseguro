import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';

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
  return (
    <View
      style={[
        styles.container,
        highlighted && styles.highlightedContainer,
      ]}>
      {highlighted && <View style={styles.highlightBadge}><Text style={styles.highlightText}>Recomendado</Text></View>}
      
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>R$</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <Text style={styles.period}>{period}</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <CheckCircle2 size={18} color="#22C55E" />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          highlighted ? styles.highlightedButton : styles.normalButton,
        ]}
        onPress={onPress}>
        <Text
          style={[
            styles.buttonText,
            highlighted ? styles.highlightedButtonText : styles.normalButtonText,
          ]}>
          Assinar Agora
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
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
    borderColor: '#2563EB',
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
    backgroundColor: '#2563EB',
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
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#111827',
    marginTop: 4,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#111827',
  },
  period: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
    marginLeft: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  normalButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  highlightedButton: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  normalButtonText: {
    color: '#111827',
  },
  highlightedButtonText: {
    color: '#FFFFFF',
  },
});