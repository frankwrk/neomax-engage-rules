"use client";

import React from 'react';
import { useState } from 'react';
import { ChevronRight, Printer, Search, Clock, Download, ArrowUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
// Using the standard footer component only

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  version?: string;
}

/**
 * A reusable component for displaying legal documents with enhanced features
 */
export const LegalDocument = ({
  title,
  lastUpdated,
  children,
  version = '1.0'
}: LegalDocumentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Extract headings from children to build table of contents
  React.useEffect(() => {
    const extractHeadings = () => {
      const content = document.getElementById('legal-content');
      if (!content) return [];

      const headings = Array.from(content.querySelectorAll('h2, h3, h4'));
      return headings.map((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        
        // Set id on the heading element for scroll targeting
        if (!heading.id) {
          heading.id = id;
        }
        
        return {
          id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1))
        };
      });
    };

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const headings = extractHeadings();
      setToc(headings);
    }, 100);

    return () => clearTimeout(timer);
  }, [children]);

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Handle print document
  const handlePrint = () => {
    window.print();
  };

  // Handle download as PDF (placeholder - would need additional library)
  const handleDownload = () => {
    alert('This feature would download the document as PDF. Implementation requires additional libraries.');
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container max-w-6xl pt-10 pb-20">
        {/* Header with title and meta information */}
        <div className="mb-12 border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-bold text-center text-white mb-6">{title}</h1>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Version {version}</span>
              <div className="h-4 w-px bg-gray-700 mx-4"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-primary"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-primary"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar with table of contents and search */}
          <div className="col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-6">
              {/* Search box */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search document..."
                  className="pl-10 bg-secondary-foreground/10 border-gray-700 text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table of contents */}
              <div className="bg-secondary-foreground/5 rounded-lg border border-gray-700 p-4">
                <h3 className="text-gray-300 font-semibold mb-4">Table of Contents</h3>
                <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                  <ul className="space-y-2">
                    {toc.map((item) => (
                      <li 
                        key={item.id}
                        className={`flex items-start ${item.level === 2 ? '' : 'pl-4'}`}
                      >
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`group flex items-start text-left ${
                            activeSection === item.id
                              ? 'text-primary font-medium'
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <ChevronRight className={`h-4 w-4 mt-1 mr-1 transition-transform ${
                            activeSection === item.id ? 'rotate-90 text-primary' : 'text-gray-400 group-hover:text-primary/80'
                          }`} />
                          <span className={`text-sm ${item.level === 3 ? 'ml-2' : ''} ${item.level === 4 ? 'ml-4' : ''}`}>
                            {item.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-3 order-1 lg:order-2">
            <div 
              id="legal-content"
              className="max-w-none text-gray-300 legal-document"
            >
              {children}
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-lg hover:shadow-xl bg-primary/90 text-white hover:bg-primary" 
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* We use the standard Footer component from the layout */}
    </div>
  );
};
