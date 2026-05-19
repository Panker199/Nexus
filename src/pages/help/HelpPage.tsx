import React from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink, HelpCircle, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

const faqs = [
  { question: 'How do I connect with investors?', answer: 'Browse our investor directory and send connection requests. Once accepted, you can message them directly.' },
  { question: 'What should I include in my startup profile?', answer: 'Include a compelling pitch, funding needs, team information, market opportunity, and any traction metrics.' },
  { question: 'How do I share documents securely?', answer: 'Upload documents to your secure vault and selectively share with connected investors. All documents are encrypted.' },
  { question: 'What are collaboration requests?', answer: 'Formal expressions of interest from investors indicating they want to learn more about your startup.' },
];

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-0.5">Find answers or get in touch</p>
      </div>

      {/* Search */}
      <div className="max-w-xl">
        <Input placeholder="Search help articles..." startAdornment={<Search size={18} />} fullWidth />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Book, title: 'Documentation', desc: 'Browse detailed guides', action: 'View Docs' },
          { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support in real-time', action: 'Start Chat' },
          { icon: Phone, title: 'Contact Us', desc: 'Email or phone support', action: 'Contact Support' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} hoverable>
              <CardBody className="text-center p-6">
                <div className="mx-auto w-12 h-12 rounded bg-primary-50 flex items-center justify-center mb-3">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                <Button variant={i === 1 ? 'primary' : 'outline'} size="sm" className="mt-4" rightIcon={i === 0 ? <ExternalLink size={14} /> : undefined}>
                  {item.action}
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Still need help?</h2>
        </CardHeader>
        <CardBody>
          <form className="space-y-5 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Name" placeholder="Your name" />
              <Input label="Email" type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                className="w-full rounded border border-gray-300 focus:border-primary-500 sm:text-sm px-3 py-2"
                rows={4}
                placeholder="How can we help you?"
              />
            </div>
            <Button>Send Message</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
