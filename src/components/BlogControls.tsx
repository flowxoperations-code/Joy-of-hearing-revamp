import React, { useState, useEffect, useRef, useCallback } from 'react';

const setTranslateCookie = (lang: string) => {
  document.cookie = `googtrans=/en/${lang}; path=/`;
  if (typeof window !== 'undefined') {
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length >= 2) {
      const baseDomain = '.' + hostParts.slice(-2).join('.');
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${baseDomain}`;
    }
  }
};

export default function BlogControls({ title }: { title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    if (!synth) return;
    
    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
    };
  }, [synth]);

  useEffect(() => {
    // Read existing language from cookie on mount
    if (typeof window !== 'undefined') {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      
      const googtrans = getCookie('googtrans');
      if (googtrans) {
        const lang = googtrans.split('/').pop();
        if (lang && (lang === 'en' || lang === 'hi')) {
          setCurrentLang(lang);
        }
      }
    }

    // Inject Google Translate script if not present
    if (typeof window !== 'undefined' && !document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,pa',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      };
    }

    return () => {
      if (synth) synth.cancel();
    };
  }, []);

  // Helper: wait for the Google Translate dropdown to appear in the DOM, then trigger it
  const triggerGoogleTranslate = useCallback((lang: string) => {
    let attempts = 0;
    const maxAttempts = 40; // poll for up to ~4 seconds
    
    const poll = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        // Give Google Translate a moment to apply DOM changes
        setTimeout(() => setIsTranslating(false), 800);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(poll, 100);
      } else {
        // Ultimate fallback: reload if widget never appeared
        window.location.reload();
      }
    };
    
    poll();
  }, []);

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLang) return;
    
    setCurrentLang(lang);
    if (synth) synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsTranslating(true);
    
    if (lang === 'en') {
      // Clear cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (typeof window !== 'undefined') {
        const hostParts = window.location.hostname.split('.');
        if (hostParts.length >= 2) {
          const baseDomain = '.' + hostParts.slice(-2).join('.');
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${baseDomain}`;
        }
      }
      
      // Try to use the Google Translate widget to revert
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => setIsTranslating(false), 800);
      } else {
        // Only reload as last resort for reverting to English
        window.location.reload();
      }
    } else {
      setTranslateCookie(lang);
      triggerGoogleTranslate(lang);
    }
  };

  // Find the best matching voice for a language
  const findVoice = (langCode: string): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current.length > 0 ? voicesRef.current : (synth?.getVoices() || []);
    voicesRef.current = voices;
    
    if (langCode === 'hi') {
      // Try exact Hindi voices first
      const hindiVoice = voices.find(v => v.lang === 'hi-IN') ||
                         voices.find(v => v.lang.startsWith('hi')) ||
                         voices.find(v => v.name.toLowerCase().includes('hindi'));
      return hindiVoice || null;
    }
    
    // English
    const enVoice = voices.find(v => v.lang === 'en-IN') ||
                    voices.find(v => v.lang === 'en-US') ||
                    voices.find(v => v.lang.startsWith('en'));
    return enVoice || null;
  };

  const togglePlay = () => {
    if (!synth) return;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    // Start playing — read actual visible text from the page
    const proseEl = document.querySelector('.prose') as HTMLElement;
    const content = proseEl?.innerText || '';
    const textToRead = `${title}. ${content}`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set language and pick the right voice
    if (currentLang === 'hi') {
      utterance.lang = 'hi-IN';
      const hindiVoice = findVoice('hi');
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      utterance.lang = 'en-IN';
      const enVoice = findVoice('en');
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }
    
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const stopAudio = () => {
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-secondary/30 backdrop-blur-md border border-border/50 rounded-[24px] p-4 mb-10 gap-4">
      {/* Google Translate Element - Positioned off-screen so script can initialize it */}
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }}
      ></div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {(['en', 'hi'] as const).map((lang) => (
          <button 
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isTranslating}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${currentLang === lang ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-fg hover:bg-white/10 border border-white/5'} ${isTranslating ? 'opacity-60 cursor-wait' : ''}`}
          >
            {lang === 'en' ? 'English' : 'हिंदी'}
          </button>
        ))}
        {isTranslating && (
          <span className="text-xs text-fg-muted animate-pulse ml-1">Translating…</span>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button 
          onClick={togglePlay}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${isPlaying && !isPaused ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/10 text-fg hover:bg-white/20'}`}
        >
          {isPlaying && !isPaused ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              Pause Audio
            </>
          ) : isPlaying && isPaused ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Resume Audio
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              Read Aloud
            </>
          )}
        </button>
        
        {isPlaying && (
          <button 
            onClick={stopAudio}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
            title="Stop Audio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
