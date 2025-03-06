"use client";

import React, { useState, useEffect } from 'react';
import { X, Info, Shield, Settings } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { saveConsentRecord, ConsentPreferences } from '@/lib/consent-service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * Cookie consent banner with detailed preference options
 * Provides GDPR-compliant cookie consent functionality
 */
export const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and cannot be changed
    functional: false,
    analytics: false,
    marketing: false
  });

  // Check if consent was previously given
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Get current user if logged in
  const { user } = useSupabaseAuth();
  
  // Get user's IP and user agent
  const [clientInfo, setClientInfo] = useState<{ ip: string | null; userAgent: string | null }>({ 
    ip: null, 
    userAgent: null 
  });

  useEffect(() => {
    // Set user agent from browser
    setClientInfo(prev => ({
      ...prev,
      userAgent: navigator.userAgent
    }));

    // Fetch IP address from public API
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setClientInfo(prev => ({ ...prev, ip: data.ip }));
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []);
  
  // Save consent to database
  const saveConsentToDatabase = async (
    consentType: 'all' | 'necessary' | 'custom',
    consentPreferences: ConsentPreferences
  ) => {
    try {
      await saveConsentRecord({
        user_id: user?.id || null,
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        preferences: consentPreferences,
        consent_type: consentType
      });
    } catch (error) {
      console.error('Error saving consent record:', error);
    }
  };

  // Accept all cookies
  const acceptAll = async () => {
    const newPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
    setShowBanner(false);
    
    // Save to database
    await saveConsentToDatabase('all', newPreferences);
  };

  // Decline optional cookies
  const declineOptional = async () => {
    const newPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
    setShowBanner(false);
    
    // Save to database
    await saveConsentToDatabase('necessary', newPreferences);
  };

  // Save custom preferences
  const savePreferences = async () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    setOpen(false);
    
    // Save to database
    await saveConsentToDatabase('custom', preferences);
  };

  // Handle preference change
  const handleSwitchChange = (type: keyof typeof preferences) => {
    if (type === 'necessary') return; // Cannot change necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary-foreground/20 backdrop-blur-md border-t border-gray-700 p-4 shadow-lg animate-slideUp">
        <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-gray-200 font-medium mb-1">We value your privacy</h3>
              <p className="text-gray-400 text-sm mb-2">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <a 
                href="/cookie-policy" 
                className="text-primary hover:underline text-sm inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="h-3 w-3 mr-1" />
                View our Cookie Policy
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap border-gray-700 text-gray-300 hover:text-primary hover:border-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Cookie Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] bg-secondary border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Cookie Preferences</DialogTitle>
                  <DialogDescription>
                    Customize your cookie preferences for this website.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="essential" className="mt-4">
                  <TabsList className="grid grid-cols-4 bg-secondary-foreground/20 text-gray-300 [&_[data-state=active]]:bg-primary [&_[data-state=active]]:text-white">
                    <TabsTrigger value="essential">Essential</TabsTrigger>
                    <TabsTrigger value="functional">Functional</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="essential" className="space-y-4 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Essential Cookies</h4>
                        <p className="text-xs text-gray-400">
                          These cookies are necessary for the website to function properly. 
                          They cannot be disabled.
                        </p>
                      </div>
                      <Switch id="necessary" checked disabled />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="functional" className="space-y-4 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Functional Cookies</h4>
                        <p className="text-xs text-gray-400">
                          These cookies enable personalized features and functionality.
                        </p>
                      </div>
                      <Switch 
                        id="functional" 
                        checked={preferences.functional}
                        onCheckedChange={() => handleSwitchChange('functional')}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Analytics Cookies</h4>
                        <p className="text-xs text-gray-400">
                          These cookies help us understand how visitors interact with our website.
                        </p>
                      </div>
                      <Switch 
                        id="analytics" 
                        checked={preferences.analytics}
                        onCheckedChange={() => handleSwitchChange('analytics')}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="marketing" className="space-y-4 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Marketing Cookies</h4>
                        <p className="text-xs text-gray-400">
                          These cookies are used to track visitors across websites to display relevant advertisements.
                        </p>
                      </div>
                      <Switch 
                        id="marketing" 
                        checked={preferences.marketing}
                        onCheckedChange={() => handleSwitchChange('marketing')}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
                  <Button variant="ghost" onClick={declineOptional} className="order-1 sm:order-none text-gray-300 hover:text-primary">
                    Reject All
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-700 text-gray-300 hover:text-primary hover:border-primary">
                      Cancel
                    </Button>
                    <Button onClick={savePreferences} className="bg-primary text-white hover:bg-primary/90">
                      Save Preferences
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={declineOptional} className="whitespace-nowrap border-gray-700 text-gray-300 hover:text-primary hover:border-primary">
              Reject All
            </Button>
            
            <Button variant="default" size="sm" onClick={acceptAll} className="whitespace-nowrap bg-primary text-white hover:bg-primary/90">
              Accept All
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 text-gray-300 hover:text-primary" 
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
