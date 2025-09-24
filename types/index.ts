export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

export interface NewsVerification {
  id: string; // uuid, primary key
  user_id?: string; // Foreign key to users table (auth.users.id or profiles.id)

  news_content: string; // The main text content of the news being verified
  news_url?: string;     // URL of the news article, if applicable
  news_title?: string;   // Title of the news article
  news_text_snippet?: string; // A short snippet of the news text

  source?: string;       // Source of the news (e.g., website domain)

  // Replaces/Refines 'isTrue' and 'explanation'
  verification_status?: 'VERDADEIRO' | 'FALSO' | 'INDETERMINADO' | 'EM_ANALISE' | 'ERRO'; // Status from AI/manual verification
  verification_summary?: string; // Summary explanation of the verification
  
  related_facts?: string[]; // Array of related facts or links
  raw_ai_response?: any;    // Raw response from the AI service (can be JSON)
  error_message?: string;   // If any error occurred during verification

  verified_at: string;   // ISO string timestamp
  // verifiedBy?: string; // Could be 'AI', 'USER_X', 'MODERATOR_Y' in the future
  
  // Fields kept for compatibility during transition, review if still needed
  isTrue?: boolean; // Should be derived from verification_status ideally
  explanation?: string; // Should be replaced by verification_summary
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  pendingEmailConfirmation: string | null;
  showConsentModal: boolean;
}

export interface VerificationState {
  verifications: NewsVerification[];
  currentVerification: NewsVerification | null;
  verificationCount: number | null;
  isLoading: boolean;
  error: string | null;
  showAd: boolean; // Readicionado para lógica de anúncios
}