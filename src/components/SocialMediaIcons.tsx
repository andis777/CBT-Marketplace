import React from 'react';
import { 
  Facebook, 
  Youtube, 
  Linkedin, 
  MessageCircle,
  Phone,
  Globe,
  BookOpen
} from 'lucide-react';
import type { SocialLinks } from '../types';

interface SocialMediaIconsProps {
  socialLinks: SocialLinks | string | undefined;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ socialLinks }) => {
  // Parse social links if they're a string
  const links = typeof socialLinks === 'string' 
    ? JSON.parse(socialLinks)
    : socialLinks || {};

  // Filter out null/empty values
  const activeLinks = Object.entries(links)
    .filter(([_, value]) => value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as SocialLinks);

  if (!Object.keys(activeLinks).length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {activeLinks.vk && (
        <a
          href={activeLinks.vk}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="VK"
        >
          <Facebook className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.telegram && (
        <a
          href={`https://t.me/${activeLinks.telegram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="Telegram"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.whatsapp && (
        <a
          href={`https://wa.me/${activeLinks.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="WhatsApp"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.youtube && (
        <a
          href={activeLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="YouTube"
        >
          <Youtube className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.linkedin && (
        <a
          href={activeLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.profi_ru && (
        <a
          href={activeLinks.profi_ru}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="Profi.ru"
        >
          <Globe className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.b17_ru && (
        <a
          href={activeLinks.b17_ru}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="B17.ru"
        >
          <BookOpen className="h-5 w-5" />
        </a>
      )}
      
      {activeLinks.yasno_live && (
        <a
          href={activeLinks.yasno_live}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
          title="Ясно.Live"
        >
          <Globe className="h-5 w-5" />
        </a>
      )}
    </div>
  );
};

export default SocialMediaIcons;