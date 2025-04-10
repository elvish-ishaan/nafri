import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

const FaqPage: React.FC = () => {
  const faqData = [
    {
      question: 'What is Nextcloud?',
      answer:
        'Nextcloud is a free and open-source software for creating and using file sync and share services.',
    },
    {
      question: 'How does file sharing work in Nextcloud?',
      answer:
        'You can securely share files and folders by generating shareable links or granting specific users access with permissions.',
    },
    {
      question: 'Can I access my files offline?',
      answer:
        'Yes, you can sync files to your device using the desktop or mobile app, allowing offline access. Changes will sync when you reconnect.',
    },
    {
      question: 'What is the storage limit in Nextcloud?',
      answer:
        'The storage limit depends on your server configuration or the plan chosen if using a hosted service. You can manage storage quotas for users.',
    },
    {
      question: 'Is my data secure with Nextcloud?',
      answer:
        'Yes, Nextcloud prioritizes data security and privacy. It uses encryption for file transfer, and you have full control over your data.',
    },
    {
      question: 'How do I recover deleted files?',
      answer:
        'Deleted files are moved to the trash bin and can be restored within a set period (configurable by the admin) before being permanently deleted.',
    },
    {
      question: 'Can I collaborate on documents in real-time?',
      answer:
        'Yes, with integrations like Collabora Online or OnlyOffice, you can edit documents collaboratively in real-time.',
    },
    {
      question: 'How do I enable two-factor authentication?',
      answer:
        'Two-factor authentication can be enabled in the security settings. You can use apps like Google Authenticator or hardware keys for added security.',
    },
    {
      question: 'Are version histories supported?',
      answer:
        'Yes, Nextcloud supports file versioning, allowing you to restore previous versions of a file if needed.',
    },
    {
      question: 'What devices are supported?',
      answer:
        'Nextcloud supports web browsers, desktop apps (Windows, macOS, Linux), and mobile apps (iOS, Android).',
    },
  ];

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-foreground">
        Frequently Asked Questions
      </h1>
      <Accordion
        type="single"
        collapsible
        className="space-y-6 border rounded-lg shadow-lg p-6 bg-card"
      >
        {faqData.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg shadow-sm overflow-hidden"
          >
            <AccordionTrigger
              className="flex justify-between items-center px-4 py-3 bg-muted hover:bg-accent transition-colors duration-200 font-medium text-foreground"
            >
              <span>{faq.question}</span>
              <ChevronDown className="ml-2 w-5 h-5 text-muted-foreground" />
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-foreground bg-background">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqPage;
