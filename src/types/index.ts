// Plan related types
export interface Plan {
  title: string;
  description: string;
  price: number;
  duration: string;
  type: 'psychologist' | 'institution';
  features: string[];
  icon: React.FC<{ className?: string }>;
  tier: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'psychologist' | 'institute' | 'client';
  avatar?: string;
  is_verified: boolean;
  is_active: boolean;
  token?: string;
  profile?: {
    is_top?: boolean;
    top_until?: string;
    promotion_tier?: number;
  };
}

// Service related types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes?: number;
}

// Contact information
export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
  telegram?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface SocialLinks {
  vk?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  profi_ru?: string | null;
  b17_ru?: string | null;
  yasno_live?: string | null;
}

// Institution related types
export interface Institution {
  id: string;
  user_id: string;
  name?: string;
  description: string;
  avatar: string;
  address: string;
  psychologists_count: number;
  services: Service[];
  contacts: Contact;
  is_verified: boolean | number;
  is_top?: boolean;
  top_until?: string;
  promotion_tier?: number;
  created_at: string;
  updated_at: string;
  psychologists?: Psychologist[];
  social_links?: SocialLinks | string;
}

// Psychologist related types
export interface Psychologist {
  id: string;
  user_id: string;
  name?: string;
  description: string;
  experience: number;
  institution_id?: string;
  institution_ids?: string[];
  rating: number;
  reviews_count: number;
  specializations: string[];
  languages: string[];
  memberships: string[];
  education: string[];
  certifications: string[];
  gallery: string[];
  location: {
    city: string;
    country: string;
  };
  contacts: Contact;
  social_links?: SocialLinks;
  services: Service[];
  avatar: string;
  articles?: Article[];
  is_verified?: boolean;
  is_top?: boolean;
  promotion_tier?: number;
  top_until?: string;
}

// Article related types
export interface Article {
  id: string;
  title: string;
  preview?: string;
  content: string;
  image_url: string;
  authorId: string;
  author: string;
  authorAvatar?: string;
  views: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string;
  institution_id?: string;
  psychologist_id?: string;
  author_id: string;
  author_name: string;
}

// Appointment related types
export interface Appointment {
  id: string;
  client_id: string;
  psychologist_id: string;
  service_id: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  psychologist?: Psychologist;
  service?: Service;
}

// Review related types
export interface Review {
  id: string;
  author_id: string;
  psychologist_id: string;
  rating: number;
  comment?: string;
  reply?: string;
  created_at: string;
  updated_at: string;
  author?: User;
}