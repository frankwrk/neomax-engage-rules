"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Phone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Specialized footer for legal pages with quick links and contact options
 */
export const LegalFooter = () => {
  return (
    <div className="w-full border-t border-gray-700 mt-12 pt-8 bg-secondary-foreground/5">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Document quick links */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Legal Documents</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-400 hover:text-primary flex items-center group"
                >
                  <span className="mr-2">Privacy Policy</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-primary flex items-center group"
                >
                  <span className="mr-2">Terms and Conditions</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy" 
                  className="text-gray-400 hover:text-primary flex items-center group"
                >
                  <span className="mr-2">Cookie Policy</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a href="mailto:legal@neomax-engage.com" className="hover:text-primary">
                  legal@neomax-engage.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <a href="tel:+441234567890" className="hover:text-primary">
                  +44 123 456 7890
                </a>
              </li>
              <li className="text-gray-400 mt-2">
                123 Engagement Street<br />
                London, UK
              </li>
            </ul>
          </div>

          {/* Help and feedback */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Need Help?</h3>
            <p className="text-gray-400 mb-4">
              If you have any questions about our legal documents or need further assistance, 
              please don't hesitate to contact our legal team.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary">
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Support
              </Button>
              <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                Send Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 py-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Neomax Engage Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};
