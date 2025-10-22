/**
 * ====================================
 * TUTORIAL COMPONENTS
 * Exportações dos componentes do tutorial
 * ====================================
 */

export { TutorialOverlay } from './TutorialOverlay';
export { TutorialCard } from './TutorialCard';
export { TutorialProgressBar } from './TutorialProgressBar';
export { TutorialSpotlight } from './TutorialSpotlight';
export { TutorialMascot } from './TutorialMascot';
export { TutorialLevelCompleteModal } from './TutorialLevelCompleteModal';
export { TutorialCompleteModal } from './TutorialCompleteModal';
export { TutorialErrorBoundary } from './TutorialErrorBoundary';

// Re-export para facilitar imports
export type { TutorialStepConfig, TutorialState } from '@/types/tutorial.types';
export type { Badge, BadgeCollection } from '@/types/badge.types';
