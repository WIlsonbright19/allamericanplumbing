import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { IMAGES } from './images';
import { ImageWithFallback } from './ImageWithFallback';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Real-time validation helpers
const validateName = (name: string): string | undefined => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Please enter your name.';
  }
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters.';
  }
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return 'Please enter your phone number.';
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) {
    return 'Please enter a valid 10-digit phone number.';
  }
  if (digits.length > 15) {
    return 'Phone number cannot exceed 15 digits.';
  }
  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
  if (!phonePattern.test(trimmed)) {
    return 'Please enter a valid phone number format.';
  }
  return undefined;
};

export default function App() {
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainExited, setCurtainExited] = useState(false);
  const [readyToAnimateHero, setReadyToAnimateHero] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [heroOutOfView, setHeroOutOfView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mobile / Tablet Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active navigation section for scroll-spy
  const [activeSection, setActiveSection] = useState<string>('');

  // Replay target section animation on anchor click
  const [replaySection, setReplaySection] = useState<string | null>(null);

  // Hovered service row state for sibling dimming
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // HERO QUICK QUOTE FORM STATE
  const [heroFormData, setHeroFormData] = useState({
    name: '',
    phone: '',
    service: 'Emergency plumbing',
  });
  const [heroFormTouched, setHeroFormTouched] = useState({
    name: false,
    phone: false,
  });
  const [heroFormErrors, setHeroFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);
  const [isHeroSuccess, setIsHeroSuccess] = useState(false);
  const heroNameInputRef = useRef<HTMLInputElement>(null);
  const heroPhoneInputRef = useRef<HTMLInputElement>(null);

  // FINAL CTA FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Emergency plumbing',
    message: '',
  });
  const [formTouched, setFormTouched] = useState({
    name: false,
    phone: false,
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Section Refs for scroll tracking
  const heroRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const standardsRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const emergencyRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const recentRef = useRef<HTMLElement>(null);
  const areasRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Scroll Progress Line
  const { scrollYProgress: pageScrollProgress } = useScroll();

  // Hero Image Parallax (-6% to +6% desktop, -3% to +3% mobile)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroParallaxDesktop = useTransform(heroScrollProgress, [0, 1], ['-6%', '6%']);
  const heroParallaxMobile = useTransform(heroScrollProgress, [0, 1], ['-3%', '3%']);

  // Services H2 Drift (0 to -24px desktop)
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesRef,
    offset: ['start end', 'end start'],
  });
  const servicesH2Drift = useTransform(servicesScrollProgress, [0, 1], [0, -24]);

  // How It Works Connector Line Progress
  const { scrollYProgress: howScrollProgress } = useScroll({
    target: howRef,
    offset: ['start center', 'end center'],
  });
  const howLineScale = useTransform(howScrollProgress, [0, 1], [0, 1]);

  // Photo Band Parallax (-8% to +8%)
  const { scrollYProgress: bandProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });
  const bandParallax = useTransform(bandProgress, [0, 1], ['-8%', '8%']);

  // Recent Work Parallax
  const { scrollYProgress: recentProgress } = useScroll({
    target: recentRef,
    offset: ['start end', 'end start'],
  });
  const recentLargeY = useTransform(recentProgress, [0, 1], [0, -30]);
  const recentSmallY = useTransform(recentProgress, [0, 1], [0, -60]);

  // Final CTA Background Scale
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'center center'],
  });
  const ctaScale = useTransform(ctaProgress, [0, 1], [1.1, 1]);

  // Trust Strip Review Counter
  const [trustCounts, setTrustCounts] = useState({ reviews: 0 });
  const [trustAnimated, setTrustAnimated] = useState(false);

  // Initialize load curtain & media queries
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);

    const checkSizes = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
    };
    checkSizes();
    window.addEventListener('resize', checkSizes);

    let hasSeenSession = false;
    try {
      hasSeenSession = !!sessionStorage.getItem('allamerican_loaded');
      if (!hasSeenSession && !isReduced) {
        sessionStorage.setItem('allamerican_loaded', 'true');
      }
    } catch {
      hasSeenSession = false;
    }

    if (isReduced || hasSeenSession) {
      setShowCurtain(false);
      setCurtainExited(true);
      setReadyToAnimateHero(true);
    } else {
      setShowCurtain(true);
      const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 800));

      Promise.race([fontPromise, timeoutPromise]).then(() => {
        setTimeout(() => {
          setCurtainExited(true);
          setTimeout(() => {
            setReadyToAnimateHero(true);
          }, 200);
        }, 500);
      });
    }

    return () => window.removeEventListener('resize', checkSizes);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll listener for header compaction, mobile call bar, and scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setHeroOutOfView(y > heroBottom - 80);
      }

      const sections = [
        { id: 'services', ref: servicesRef },
        { id: 'standards', ref: standardsRef },
        { id: 'how-it-works', ref: howRef },
        { id: 'emergency-guide', ref: emergencyRef },
        { id: 'reviews', ref: reviewsRef },
        { id: 'recent-work', ref: recentRef },
        { id: 'areas', ref: areasRef },
        { id: 'faq', ref: faqRef },
        { id: 'quote', ref: ctaRef },
      ];

      const scrollPosition = y + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.ref.current && sec.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(sec.id);
          return;
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate trust count once in view
  useEffect(() => {
    if (!trustAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTrustAnimated(true);
            const duration = 1200;
            const startTime = performance.now();
            const target = 109;

            const animateNumber = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setTrustCounts({ reviews: Math.round(target * eased) });
              if (progress < 1) {
                requestAnimationFrame(animateNumber);
              }
            };
            requestAnimationFrame(animateNumber);
          }
        },
        { threshold: 0.2 }
      );

      if (trustRef.current) observer.observe(trustRef.current);
      return () => observer.disconnect();
    }
  }, [trustAnimated]);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setReplaySection(id);
    setTimeout(() => setReplaySection(null), 1000);

    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleQuoteCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (ctaRef.current) {
      const top = ctaRef.current.offsetTop - 88;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 600);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceSelect = (serviceName: string) => {
    setFormData((prev) => ({ ...prev, service: serviceName }));
    setHeroFormData((prev) => ({ ...prev, service: serviceName }));
    if (ctaRef.current) {
      const top = ctaRef.current.offsetTop - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // HERO FORM HANDLERS
  const handleHeroNameChange = (val: string) => {
    setHeroFormData((prev) => ({ ...prev, name: val }));
    if (heroFormTouched.name) {
      const err = validateName(val);
      setHeroFormErrors((prev) => ({ ...prev, name: err }));
    }
  };

  const handleHeroNameBlur = () => {
    setHeroFormTouched((prev) => ({ ...prev, name: true }));
    const err = validateName(heroFormData.name);
    setHeroFormErrors((prev) => ({ ...prev, name: err }));
  };

  const handleHeroPhoneChange = (val: string) => {
    setHeroFormData((prev) => ({ ...prev, phone: val }));
    if (heroFormTouched.phone) {
      const err = validatePhone(val);
      setHeroFormErrors((prev) => ({ ...prev, phone: err }));
    }
  };

  const handleHeroPhoneBlur = () => {
    setHeroFormTouched((prev) => ({ ...prev, phone: true }));
    const err = validatePhone(heroFormData.phone);
    setHeroFormErrors((prev) => ({ ...prev, phone: err }));
  };

  const handleHeroFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormTouched({ name: true, phone: true });
    const nameErr = validateName(heroFormData.name);
    const phoneErr = validatePhone(heroFormData.phone);

    if (nameErr || phoneErr) {
      setHeroFormErrors({ name: nameErr, phone: phoneErr });
      if (nameErr && heroNameInputRef.current) {
        heroNameInputRef.current.focus();
      } else if (phoneErr && heroPhoneInputRef.current) {
        heroPhoneInputRef.current.focus();
      }
      return;
    }

    setHeroFormErrors({});
    setIsHeroSubmitting(true);

    setTimeout(() => {
      setIsHeroSubmitting(false);
      setIsHeroSuccess(true);
    }, 900);
  };

  // FINAL CTA FORM HANDLERS
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, name: val }));
    if (formTouched.name) {
      const err = validateName(val);
      setFormErrors((prev) => ({ ...prev, name: err }));
    }
  };

  const handleNameBlur = () => {
    setFormTouched((prev) => ({ ...prev, name: true }));
    const err = validateName(formData.name);
    setFormErrors((prev) => ({ ...prev, name: err }));
  };

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    if (formTouched.phone) {
      const err = validatePhone(val);
      setFormErrors((prev) => ({ ...prev, phone: err }));
    }
  };

  const handlePhoneBlur = () => {
    setFormTouched((prev) => ({ ...prev, phone: true }));
    const err = validatePhone(formData.phone);
    setFormErrors((prev) => ({ ...prev, phone: err }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched({ name: true, phone: true });
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);

    if (nameErr || phoneErr) {
      setFormErrors({ name: nameErr, phone: phoneErr });
      if (nameErr && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (phoneErr && phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const services = [
    {
      id: '01',
      name: 'Emergency plumbing',
      desc: 'Burst pipes and urgent leaks. Available 24 hours a day, every day.',
      image: IMAGES.service_emergency,
    },
    {
      id: '02',
      name: 'Drain cleaning',
      desc: 'Clogs and slow drains cleared, including stubborn main vent stacks.',
      image: IMAGES.service_drain,
    },
    {
      id: '03',
      name: 'Water heaters',
      desc: 'Tank and tankless water heaters diagnosed, repaired and installed.',
      image: IMAGES.service_water_heater,
    },
    {
      id: '04',
      name: 'Sewer line repair',
      desc: 'Sewer line cracks and blockages located, repaired and pressure-tested.',
      image: IMAGES.service_repiping,
    },
    {
      id: '05',
      name: 'Pipe & leak repair',
      desc: 'Concealed water leaks and slab leak lines repaired with precision.',
      image: IMAGES.service_leak,
    },
    {
      id: '06',
      name: 'Valves & water filtration',
      desc: 'Pressure regulators, main valves and whole-home filtration systems.',
      image: IMAGES.service_toilets,
    },
  ];

  const standards = [
    {
      num: '01',
      title: 'Certified Florida contractor',
      desc: 'Work performed by state-certified plumbing contractors under FL License #CFC1431411.',
    },
    {
      num: '02',
      title: 'Residential & commercial',
      desc: 'Serving single-family homes, condominiums, rental properties and local commercial facilities.',
    },
    {
      num: '03',
      title: 'Comprehensive diagnostics',
      desc: 'Complete pressure diagnostics, line inspection cameras and specialized locating equipment.',
    },
    {
      num: '04',
      title: 'Dedicated craftsmanship',
      desc: 'Professional repairs backed by thorough testing. Clean, dependable and done right the first time.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Call or message us',
      desc: 'Reach out directly. We discuss your plumbing issue and arrange service promptly.',
      image: IMAGES.step_01,
    },
    {
      num: '02',
      title: 'We diagnose and explain the fix',
      desc: 'We inspect the issue on-site, identify the root cause and explain the solution before starting.',
      image: IMAGES.step_02,
    },
    {
      num: '03',
      title: 'Fixed, tested, cleaned up',
      desc: 'The repair is completed, thoroughly pressure-tested and the work area left clean.',
      image: IMAGES.step_03,
    },
  ];

  const emergencySteps = [
    {
      step: 'Step 01',
      title: 'Shut off the main valve',
      desc: 'Locate your main water shutoff valve near the water meter or front wall. Turn the wheel clockwise or pull the lever perpendicular to the pipe.',
    },
    {
      step: 'Step 02',
      title: 'Power off water heater',
      desc: 'Turn the electrical breaker to OFF, or switch the gas valve to PILOT. Never heat dry tank elements without water pressure.',
    },
    {
      step: 'Step 03',
      title: 'Drain residual pressure',
      desc: 'Open the lowest outdoor hose bib or fixture to drain remaining standing water out of interior walls.',
    },
    {
      step: 'Step 04',
      title: 'Document & clear path',
      desc: 'Take quick photos of active leaks for records, then clear access to the work area so our team can begin repairs upon arrival.',
    },
  ];

  const reviews = [
    {
      stars: '★★★★★',
      text: '“Robert and his team always go above and beyond…”',
      author: 'Enrique Finol',
      source: 'Google review',
    },
    {
      stars: '★★★★★',
      text: '“They always do things right the first time…”',
      author: 'Sami Shaio',
      source: 'Google review',
    },
    {
      stars: '★★★★★',
      text: '“10 o’clock on a Friday night he installed a new water heater…”',
      author: 'william pierce',
      source: 'Google review',
    },
  ];

  const recentWorks = [
    { image: IMAGES.recent_01, caption: 'Tankless water heater install', isLarge: true },
    { image: IMAGES.recent_02, caption: 'Sewer line repair', isLarge: false },
    { image: IMAGES.recent_03, caption: 'Pipe repair', isLarge: false },
    { image: IMAGES.recent_04, caption: 'Valve replacement', isLarge: false },
    { image: IMAGES.recent_05, caption: 'Drain repair', isLarge: false },
  ];

  const towns = [
    'Miami',
    'North Miami Beach',
    'Golden Beach',
    'Cooper City',
    'Weston',
    'More of South Florida',
  ];

  const faqs = [
    {
      q: 'Do you offer 24/7 emergency service?',
      a: 'Yes, we provide 24/7 emergency plumbing service for burst pipes, active leaks and urgent sewer problems across Miami and South Florida.',
    },
    {
      q: 'What areas do you serve?',
      a: 'We serve Miami, North Miami Beach, Golden Beach, Cooper City, Weston and the wider South Florida area.',
    },
    {
      q: 'Are you a licensed plumbing contractor in Florida?',
      a: 'Yes. We hold Florida Certified Plumbing Contractor license CFC1431411.',
    },
    {
      q: 'Do you handle both residential and commercial plumbing?',
      a: 'Yes. We handle plumbing and drain cleaning for residential homes, condominiums and commercial properties.',
    },
    {
      q: 'What should I do during an urgent leak or burst pipe?',
      a: 'Locate your main water shutoff valve and turn it off immediately to stop flooding, then tap Call Now to reach our dispatch team.',
    },
  ];

  const navLinks = [
    { id: 'services', label: 'Services', num: '01' },
    { id: 'standards', label: 'Our Standards', num: '02' },
    { id: 'how-it-works', label: 'How It Works', num: '03' },
    { id: 'emergency-guide', label: 'Emergency Protocol', num: '04' },
    { id: 'reviews', label: 'Reviews', num: '05' },
    { id: 'recent-work', label: 'Recent Work', num: '06' },
    { id: 'areas', label: 'Areas', num: '07' },
    { id: 'faq', label: 'FAQ', num: '08' },
  ];

  const canParallax = isDesktop && !reducedMotion;
  const currentHeroParallax = reducedMotion
    ? '0%'
    : isDesktop
    ? heroParallaxDesktop
    : heroParallaxMobile;
  const currentBandParallax = canParallax ? bandParallax : '0%';
  const currentRecentLargeY = canParallax ? recentLargeY : 0;
  const currentRecentSmallY = canParallax ? recentSmallY : 0;
  const currentCtaScale = canParallax ? ctaScale : 1;
  const currentServicesH2Drift = canParallax ? servicesH2Drift : 0;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1a1a1a] font-['Poppins'] selection:bg-[#1a1a1a] selection:text-[#ffffff] relative overflow-x-hidden w-full max-w-[100vw]">
      {/* A1. LOAD CURTAIN (First load of session only) */}
      {showCurtain && !reducedMotion && (
        <motion.div
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={curtainExited ? { clipPath: 'inset(0% 0% 100% 0%)' } : { clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 0.8, ease: EASE }}
          onAnimationComplete={() => setShowCurtain(false)}
          className="fixed inset-0 z-50 bg-[#ffffff] pointer-events-none flex flex-col justify-end p-[20px] md:p-[48px]"
        >
          <div className="text-left w-fit">
            <span className="text-[22px] sm:text-[28px] md:text-[32px] font-medium tracking-[-0.03em] text-[#1a1a1a] block mb-[8px]">
              All American Plumbing
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="w-full h-[1px] bg-[#1a1a1a] origin-left"
            />
          </div>
        </motion.div>
      )}

      {/* 1. HEADER */}
      <motion.header
        initial={showCurtain && !reducedMotion ? { y: '-100%' } : { y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: showCurtain ? 0.4 : 0, ease: EASE }}
        className={`sticky top-0 z-40 bg-[#ffffff] border-b border-[#e5e7eb] transition-[padding] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? 'py-[10px]' : 'py-[14px] sm:py-[18px] md:py-[20px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px] flex items-center justify-between gap-[16px]">
          {/* Wordmark */}
          <a
            href="#"
            className="text-[16px] sm:text-[18px] font-medium tracking-[-0.03em] text-[#1a1a1a] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
          >
            All American Plumbing
          </a>

          {/* Desktop Navigation Links (hidden on mobile and tablet) */}
          <nav
            aria-label="Primary desktop navigation"
            className="hidden lg:flex items-center gap-[20px] xl:gap-[28px] relative"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-[13px] xl:text-[14px] leading-[20px] text-[#1a1a1a] relative py-[4px] hover:text-[#0000ee] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a]"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-[8px] sm:gap-[12px]">
            {/* Desktop Call Button (no phone number text) */}
            <a
              href="tel:+17864432723"
              className="hidden lg:inline-flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#e5e7eb] px-[22px] xl:px-[26px] py-[10px] xl:py-[12px] text-[14px] xl:text-[15px] font-medium leading-none transition-[background-color,color,border-color,transform] duration-200 hover:bg-[#ffffff] hover:text-[#1a1a1a] hover:border-[#1a1a1a] hover:-translate-y-[2px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
            >
              Call Now
            </a>

            {/* Mobile & Tablet Compact Call Button (hidden on mobile, visible on tablet) */}
            <a
              href="tel:+17864432723"
              className="hidden sm:inline-flex lg:hidden items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#e5e7eb] px-[16px] sm:px-[20px] py-[8px] sm:py-[10px] text-[13px] sm:text-[14px] font-medium leading-none hover:bg-[#ffffff] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
            >
              Call Now
            </a>

            {/* Mobile & Tablet Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              className="lg:hidden inline-flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#e5e7eb] px-[12px] sm:px-[16px] py-[8px] sm:py-[10px] text-[13px] sm:text-[14px] font-medium gap-[6px] hover:border-[#1a1a1a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
            >
              <span className="hidden sm:inline">Menu</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="8" y2="8" />
                <line x1="4" x2="20" y1="16" y2="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Progress Hairline */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e5e7eb]">
          <motion.div
            style={{ scaleX: pageScrollProgress }}
            className="h-full bg-[#1a1a1a] origin-left"
          />
        </div>
      </motion.header>

      {/* MOBILE & TABLET SLIDE-IN DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-[#1a1a1a]/40"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] max-w-[88vw] bg-[#ffffff] border-l border-[#e5e7eb] p-[20px] sm:p-[28px] flex flex-col justify-between overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
            >
              <div>
                <div className="flex items-center justify-between pb-[16px] border-b border-[#e5e7eb]">
                  <span className="text-[17px] font-medium tracking-[-0.03em] text-[#1a1a1a]">
                    All American Plumbing
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-[36px] h-[36px] rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-[8px] py-[12px] border-b border-[#e5e7eb] mb-[12px]">
                  <span
                    aria-hidden="true"
                    className="w-[8px] h-[8px] rounded-full bg-[#0000ee] animate-[pulse_2.4s_ease-in-out_infinite]"
                  />
                  <span className="text-[13px] text-[#1a1a1a] font-normal">
                    Emergency service 24/7 • Miami & South Florida
                  </span>
                </div>

                <nav className="flex flex-col space-y-[2px]" aria-label="Mobile drawer navigation">
                  {navLinks.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        setIsDrawerOpen(false);
                        handleNavClick(e, item.id);
                      }}
                      className={`flex items-center justify-between py-[10px] px-[12px] rounded-[6px] text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-[#f4f4f4] text-[#1a1a1a] font-medium'
                          : 'text-[#1a1a1a] hover:bg-[#f4f4f4]'
                      }`}
                    >
                      <span className="text-[15px] sm:text-[16px]">{item.label}</span>
                      <span className="text-[12px] text-[#767676] font-normal">{item.num}</span>
                    </a>
                  ))}
                  <a
                    href="#quote"
                    onClick={(e) => {
                      setIsDrawerOpen(false);
                      handleQuoteCtaClick(e);
                    }}
                    className={`flex items-center justify-between py-[10px] px-[12px] rounded-[6px] text-left transition-colors ${
                      activeSection === 'quote'
                        ? 'bg-[#f4f4f4] text-[#1a1a1a] font-medium'
                        : 'text-[#1a1a1a] hover:bg-[#f4f4f4]'
                    }`}
                  >
                    <span className="text-[15px] sm:text-[16px]">Request a Quote</span>
                    <span className="text-[12px] text-[#767676] font-normal">09</span>
                  </a>
                </nav>
              </div>

              <div className="pt-[20px] border-t border-[#e5e7eb] space-y-[10px]">
                {/* Drawer Call Button (no phone number text) */}
                <a
                  href="tel:+17864432723"
                  className="flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] min-h-[50px] px-[20px] text-[15px] font-medium transition-colors hover:bg-[#ffffff] hover:text-[#1a1a1a] border border-[#1a1a1a]"
                >
                  Call Now
                </a>
                <a
                  href="#quote"
                  onClick={(e) => {
                    setIsDrawerOpen(false);
                    handleQuoteCtaClick(e);
                  }}
                  className="flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#1a1a1a] min-h-[48px] px-[20px] text-[15px] font-medium transition-colors hover:bg-[#1a1a1a] hover:text-[#ffffff]"
                >
                  Get a free quote
                </a>
                <div className="flex items-center justify-between text-[12px] text-[#767676] pt-[6px]">
                  <span>FL License #CFC1431411</span>
                  <span>Miami & South Florida</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* 2. HERO */}
        <section
          ref={heroRef}
          className="relative pt-[28px] sm:pt-[36px] md:pt-[48px] lg:pt-[56px] pb-[56px] sm:pb-[72px] md:pb-[96px] border-b border-[#e5e7eb]"
        >
          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] sm:gap-[40px] lg:gap-[48px] items-start">
              {/* Left Column (Content & Typography arranged cleanly) */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Available Status Badge */}
                <motion.div
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="flex flex-wrap items-center gap-[10px] sm:gap-[16px] mb-[14px] md:mb-[18px]"
                >
                  <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#767676] font-normal">
                    Neighborhood plumbers serving Miami
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <span
                      aria-hidden="true"
                      className="w-[8px] h-[8px] rounded-full bg-[#0000ee] animate-[pulse_2.4s_ease-in-out_infinite]"
                      style={{
                        animation: reducedMotion ? 'none' : undefined,
                      }}
                    />
                    <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#1a1a1a] font-normal">
                      Emergency service 24/7
                    </span>
                  </div>
                </motion.div>

                {/* H1 Display: Scaled cleanly across desktop, tablet and mobile */}
                <h1 className="text-[32px] xs:text-[38px] sm:text-[48px] md:text-[56px] lg:text-[66px] xl:text-[76px] leading-[1.04] tracking-[-0.038em] font-medium text-[#1a1a1a] mb-[16px] md:mb-[22px] text-left">
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                      animate={readyToAnimateHero || reducedMotion ? { y: 0 } : { y: '105%' }}
                      transition={{ duration: 0.8, delay: 0, ease: EASE }}
                      className="block will-change-transform"
                    >
                      Leak? Clog?
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden">
                    <motion.span
                      initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                      animate={readyToAnimateHero || reducedMotion ? { y: 0 } : { y: '105%' }}
                      transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
                      className="block will-change-transform"
                    >
                      Call us.
                    </motion.span>
                  </span>
                  <motion.span
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                    className="block text-[13px] sm:text-[14px] md:text-[15px] leading-[22px] tracking-normal font-normal text-[#767676] mt-[10px]"
                  >
                    Plumber and drain cleaning in Miami, FL
                  </motion.span>
                </h1>

                {/* Supporting description */}
                <motion.p
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
                  className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-[1.65] tracking-[-0.01em] text-[#1a1a1a] font-normal max-w-[560px] mb-[22px] md:mb-[28px] text-left"
                >
                  Residential and commercial plumbers serving Miami, North Miami Beach and South Florida. Drain cleaning, water heaters and 24/7 emergency repairs.
                </motion.p>

                {/* Hero Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] sm:gap-[16px] w-full sm:w-auto">
                  {/* Hero Call Button (no phone number text) */}
                  <motion.a
                    href="tel:+17864432723"
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
                    className="inline-flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#e5e7eb] px-[28px] sm:px-[34px] py-[14px] md:py-[16px] min-h-[48px] md:min-h-[56px] sm:min-w-[180px] text-[15px] md:text-[16px] font-medium leading-none transition-[background-color,color,border-color,transform] duration-200 hover:bg-[#ffffff] hover:text-[#1a1a1a] hover:border-[#1a1a1a] hover:-translate-y-[2px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                  >
                    Call Now
                  </motion.a>
                  <motion.a
                    href="#quote"
                    onClick={handleQuoteCtaClick}
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
                    className="inline-flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#1a1a1a] px-[24px] sm:px-[28px] py-[14px] md:py-[16px] min-h-[48px] md:min-h-[56px] sm:min-w-[180px] text-[15px] md:text-[16px] font-medium leading-none transition-[background-color,color,transform] duration-200 hover:bg-[#1a1a1a] hover:text-[#ffffff] hover:-translate-y-[2px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                  >
                    Get a free quote
                  </motion.a>
                </div>

                {/* HERO QUICK QUOTE REQUEST FORM */}
                <motion.div
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
                  className="w-full max-w-[560px] mt-[24px] sm:mt-[28px] p-[16px] sm:p-[20px] bg-[#f4f4f4] border border-[#e5e7eb] rounded-[8px] text-left"
                >
                  <div className="flex items-center justify-between mb-[12px]">
                    <span className="text-[13px] sm:text-[14px] font-medium text-[#1a1a1a]">
                      Fast Quote & Service Request
                    </span>
                    <span className="text-[12px] text-[#767676]">
                      Local Dispatch
                    </span>
                  </div>

                  {isHeroSuccess ? (
                    <div className="py-[12px]">
                      <p className="text-[15px] font-medium text-[#1a1a1a] mb-[4px]">
                        Thanks, we got your request.
                      </p>
                      <p className="text-[13px] text-[#767676] mb-[12px]">
                        We'll call you back shortly at {heroFormData.phone}.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsHeroSuccess(false);
                          setHeroFormData({ name: '', phone: '', service: 'Emergency plumbing' });
                          setHeroFormTouched({ name: false, phone: false });
                          setHeroFormErrors({});
                        }}
                        className="text-[13px] font-medium text-[#0000ee] hover:underline"
                      >
                        Submit another request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroFormSubmit} noValidate className="space-y-[12px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                        {/* Hero Name */}
                        <div>
                          <label htmlFor="hero-form-name" className="block text-[12px] text-[#1a1a1a] mb-[4px]">
                            Your Name
                          </label>
                          <input
                            id="hero-form-name"
                            ref={heroNameInputRef}
                            type="text"
                            required
                            value={heroFormData.name}
                            onChange={(e) => handleHeroNameChange(e.target.value)}
                            onBlur={handleHeroNameBlur}
                            placeholder="Your name"
                            aria-invalid={!!heroFormErrors.name}
                            aria-describedby={heroFormErrors.name ? 'hero-name-error' : undefined}
                            className={`w-full bg-[#ffffff] border ${
                              heroFormErrors.name ? 'border-[var(--error,#dc2626)]' : 'border-[#e5e7eb]'
                            } rounded-[6px] p-[10px] sm:p-[12px] text-[14px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors`}
                          />
                          {heroFormErrors.name && (
                            <p
                              id="hero-name-error"
                              role="alert"
                              className="text-[11px] sm:text-[12px] text-[var(--error,#dc2626)] mt-[3px] flex items-center gap-[4px]"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <span>{heroFormErrors.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Hero Phone */}
                        <div>
                          <label htmlFor="hero-form-phone" className="block text-[12px] text-[#1a1a1a] mb-[4px]">
                            Phone Number
                          </label>
                          <input
                            id="hero-form-phone"
                            ref={heroPhoneInputRef}
                            type="tel"
                            required
                            value={heroFormData.phone}
                            onChange={(e) => handleHeroPhoneChange(e.target.value)}
                            onBlur={handleHeroPhoneBlur}
                            placeholder="(786) 443-2723"
                            aria-invalid={!!heroFormErrors.phone}
                            aria-describedby={heroFormErrors.phone ? 'hero-phone-error' : undefined}
                            className={`w-full bg-[#ffffff] border ${
                              heroFormErrors.phone ? 'border-[var(--error,#dc2626)]' : 'border-[#e5e7eb]'
                            } rounded-[6px] p-[10px] sm:p-[12px] text-[14px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors`}
                          />
                          {heroFormErrors.phone && (
                            <p
                              id="hero-phone-error"
                              role="alert"
                              className="text-[11px] sm:text-[12px] text-[var(--error,#dc2626)] mt-[3px] flex items-center gap-[4px]"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <span>{heroFormErrors.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px] pt-[2px]">
                        <select
                          id="hero-form-service"
                          value={heroFormData.service}
                          onChange={(e) => setHeroFormData((prev) => ({ ...prev, service: e.target.value }))}
                          className="flex-1 bg-[#ffffff] border border-[#e5e7eb] rounded-[6px] p-[10px] text-[13px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                        >
                          <option value="Emergency plumbing">Emergency plumbing</option>
                          <option value="Drain cleaning">Drain cleaning</option>
                          <option value="Water heaters">Water heaters</option>
                          <option value="Sewer line repair">Sewer line repair</option>
                          <option value="Pipe & leak repair">Pipe & leak repair</option>
                          <option value="Valves & water filtration">Valves & water filtration</option>
                          <option value="Not sure">Not sure</option>
                        </select>

                        <button
                          type="submit"
                          disabled={isHeroSubmitting}
                          className="inline-flex items-center justify-center rounded-[6px] bg-[#1a1a1a] text-[#ffffff] px-[18px] py-[10px] min-h-[42px] text-[14px] font-medium leading-none transition-colors hover:bg-[#ffffff] hover:text-[#1a1a1a] border border-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        >
                          {isHeroSubmitting ? (
                            <span className="flex items-center gap-[6px]">
                              <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              <span>Submitting...</span>
                            </span>
                          ) : (
                            'Request Quote'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>

              {/* Right Column: Hero Image Panel with feature card balanced */}
              <div className="lg:col-span-5 relative mt-[16px] lg:mt-0 w-full flex flex-col justify-start">
                <motion.div
                  initial={reducedMotion ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={readyToAnimateHero || reducedMotion ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(0% 0% 100% 0%)' }}
                  transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] relative"
                >
                  <motion.div
                    style={{ y: currentHeroParallax }}
                    initial={reducedMotion ? { scale: 1 } : { scale: 1.08 }}
                    animate={readyToAnimateHero || reducedMotion ? { scale: 1 } : { scale: 1.08 }}
                    transition={{ duration: 1.4, ease: EASE }}
                    className="w-full h-full relative"
                  >
                    <ImageWithFallback
                      image={IMAGES.hero_panel}
                      loading="eager"
                      radius="8px"
                      className="w-full h-auto aspect-[4/3] object-cover block"
                    />
                  </motion.div>
                </motion.div>

                {/* Overlapping feature card */}
                <motion.div
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={readyToAnimateHero || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
                  className="mt-[16px] lg:mt-[20px] bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[16px] w-full transition-[transform,border-color] duration-300 hover:border-[#1a1a1a]"
                >
                  <div className="flex items-center gap-[12px] mb-[6px]">
                    <div className="w-[36px] h-[36px] rounded-[6px] bg-[#f4f4f4] overflow-hidden shrink-0">
                      <ImageWithFallback
                        image={IMAGES.hero_panel}
                        radius="6px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium leading-[1.3] text-[#1a1a1a]">
                        Residential & commercial
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[18px] text-[#767676] font-normal text-left">
                    State-certified Florida plumbing contractor. Done right the first time.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST STRIP */}
        <section
          ref={trustRef}
          aria-label="Trust credentials"
          className="relative py-[20px] sm:py-[24px] md:py-[28px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e5e7eb] border-y md:border-y-0 border-[#e5e7eb]">
              {[
                '24/7 EMERGENCY SERVICE',
                'FLORIDA LICENSED CONTRACTOR',
                'RESIDENTIAL & COMMERCIAL',
                `${trustCounts.reviews}+ reviews on Yelp`,
              ].map((label, idx) => (
                <motion.div
                  key={idx}
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: EASE }}
                  className="p-[12px] sm:p-[16px] md:p-[20px] flex flex-col justify-center text-left"
                >
                  <span className="text-[12px] sm:text-[13px] md:text-[14px] leading-[18px] sm:leading-[20px] font-medium tracking-tight text-[#1a1a1a]">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FULL-BLEED PHOTO BAND */}
        <section
          ref={bandRef}
          aria-label="Architectural plumbing installation photo band"
          className="w-full h-auto aspect-[4/5] md:aspect-[21/9] overflow-hidden relative border-b border-[#e5e7eb] bg-[#f4f4f4]"
        >
          <motion.div
            style={{ y: currentBandParallax, scale: 1.2 }}
            className="w-full h-full relative"
          >
            <ImageWithFallback
              image={IMAGES.photo_band}
              radius="0px"
              className="w-full h-full object-cover block"
            />
          </motion.div>
        </section>

        {/* 4. SERVICES */}
        <section
          id="services"
          ref={servicesRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <motion.div style={{ y: currentServicesH2Drift }}>
                <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                  <motion.span
                    initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    animate={replaySection === 'services' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="block"
                  >
                    What we fix.
                  </motion.span>
                </h2>
              </motion.div>
            </div>

            {/* Exactly 6 Editorial Index Rows */}
            <div className="border-t border-[#e5e7eb]">
              {services.map((svc, i) => {
                const isSiblingDimmed = hoveredService !== null && hoveredService !== i;

                return (
                  <motion.div
                    key={svc.id}
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      delay: i * 0.08,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    onClick={() => handleServiceSelect(svc.name)}
                    onMouseEnter={() => setHoveredService(i)}
                    onMouseLeave={() => setHoveredService(null)}
                    style={{
                      opacity: isSiblingDimmed ? 0.5 : undefined,
                    }}
                    className="group relative cursor-pointer py-[18px] sm:py-[24px] md:py-[28px] transition-opacity duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-[10px] md:gap-[32px]">
                      {/* Left: Thumbnail + ID + Title */}
                      <div className="flex items-center gap-[12px] sm:gap-[16px] md:gap-[28px] transition-transform duration-300 group-hover:translate-x-[6px]">
                        <div className="md:hidden w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] rounded-[6px] overflow-hidden shrink-0 bg-[#f4f4f4]">
                          <ImageWithFallback
                            image={svc.image}
                            radius="6px"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#767676] font-normal shrink-0">
                          {svc.id}
                        </span>
                        <h3 className="text-[19px] sm:text-[22px] md:text-[25px] lg:text-[28px] leading-[1.25] tracking-[-0.03em] font-medium text-[#1a1a1a] text-left">
                          {svc.name}
                        </h3>
                      </div>

                      {/* Description and Arrow */}
                      <div className="flex items-center justify-between md:justify-end gap-[16px] md:gap-[32px] w-full md:w-auto mt-[4px] md:mt-0">
                        <p className="text-[13px] sm:text-[14px] leading-[1.6] tracking-[-0.01em] text-[#767676] font-normal text-left max-w-[420px]">
                          {svc.desc}
                        </p>
                        <div className="shrink-0 text-[#1a1a1a] transition-all duration-300 translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 hidden sm:block">
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1a1a1a] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 hidden md:block" />

                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left pointer-events-none"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEW SECTION 1: OUR STANDARDS */}
        <section
          id="standards"
          ref={standardsRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal block mb-[6px]">
                The All American Plumbing commitment
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={replaySection === 'standards' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Our standards.
                </motion.span>
              </h2>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] text-[#767676] font-normal mt-[10px] max-w-[620px]">
                Committed to reliable service, certified expertise and neighborly communication across every service call.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e5e7eb] border-y border-[#e5e7eb]">
              {standards.map((item, idx) => (
                <motion.div
                  key={item.num}
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: EASE }}
                  className="p-[18px] sm:p-[22px] lg:p-[28px] flex flex-col justify-between text-left group"
                >
                  <div>
                    <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal block mb-[10px]">
                      {item.num}
                    </span>
                    <h3 className="text-[17px] sm:text-[19px] md:text-[20px] leading-[1.3] tracking-[-0.03em] font-medium text-[#1a1a1a] mb-[6px]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] leading-[1.6] text-[#767676] font-normal">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section
          id="how-it-works"
          ref={howRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] overflow-hidden bg-[#f4f4f4] transition-colors duration-600"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <ImageWithFallback
              image={IMAGES.how_it_works_bg}
              alt=""
              radius="0px"
              className="w-full h-full object-cover opacity-[0.06]"
            />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  How it works.
                </motion.span>
              </h2>
            </div>

            <div className="relative pt-[16px] md:pt-[28px]">
              <div className="hidden md:block absolute top-0 left-0 right-0 h-[1px] bg-[#e5e7eb]">
                <motion.div
                  style={{ scaleX: reducedMotion ? 1 : howLineScale }}
                  className="h-full bg-[#1a1a1a] origin-left"
                />
              </div>

              <div className="md:hidden absolute top-[16px] bottom-0 left-[14px] w-[1px] bg-[#e5e7eb]">
                <motion.div
                  style={{ scaleY: reducedMotion ? 1 : howLineScale }}
                  className="w-full bg-[#1a1a1a] origin-top"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[32px]">
                {steps.map((st, idx) => (
                  <motion.div
                    key={st.num}
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                    className="text-left flex flex-col items-start relative pl-[28px] sm:pl-[34px] md:pl-0"
                  >
                    <motion.div
                      className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[4/3] mb-[12px] md:mb-[18px] group"
                    >
                      <ImageWithFallback
                        image={st.image}
                        radius="8px"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    </motion.div>

                    <div className="overflow-hidden mb-[6px] md:mb-[10px]">
                      <motion.span
                        initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="text-[26px] sm:text-[32px] md:text-[44px] leading-[1] tracking-[-0.04em] font-medium text-[#767676] block"
                      >
                        {st.num}
                      </motion.span>
                    </div>

                    <h3 className="text-[17px] sm:text-[20px] md:text-[23px] leading-[1.3] tracking-[-0.03em] font-medium text-[#1a1a1a] mb-[6px] md:mb-[8px] text-left">
                      {st.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] leading-[1.6] tracking-[-0.01em] text-[#767676] font-normal text-left max-w-[340px]">
                      {st.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION 2: EMERGENCY PROTOCOL */}
        <section
          id="emergency-guide"
          ref={emergencyRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal block mb-[6px]">
                Damage mitigation protocol
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={replaySection === 'emergency-guide' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Emergency protocol.
                </motion.span>
              </h2>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] text-[#767676] font-normal mt-[10px] max-w-[620px]">
                Immediate steps to safeguard your property during an active pipe burst or plumbing leak before our team arrives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] sm:gap-[20px] mb-[24px] md:mb-[32px]">
              {emergencySteps.map((st, i) => (
                <motion.div
                  key={st.step}
                  initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="bg-[#f4f4f4] border border-[#e5e7eb] rounded-[8px] p-[18px] sm:p-[20px] text-left flex flex-col justify-between transition-[transform,border-color] duration-300 hover:border-[#1a1a1a]"
                >
                  <div>
                    <span className="text-[12px] sm:text-[13px] leading-[20px] font-medium text-[#1a1a1a] block mb-[6px]">
                      {st.step}
                    </span>
                    <h3 className="text-[16px] sm:text-[18px] leading-[1.3] tracking-[-0.03em] font-medium text-[#1a1a1a] mb-[6px]">
                      {st.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] leading-[1.6] text-[#767676] font-normal">
                      {st.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#f4f4f4] border border-[#e5e7eb] rounded-[8px] p-[20px] sm:p-[24px] md:p-[28px] flex flex-col md:flex-row md:items-center justify-between gap-[16px] text-left">
              <div>
                <p className="text-[16px] sm:text-[18px] font-medium text-[#1a1a1a] mb-[4px]">
                  Need live phone guidance during an active leak?
                </p>
                <p className="text-[13px] sm:text-[14px] text-[#767676] font-normal">
                  Our licensed technicians will walk you through shutoffs right now over the phone.
                </p>
              </div>
              {/* Emergency Banner Call Button (no phone number text) */}
              <a
                href="tel:+17864432723"
                className="inline-flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#1a1a1a] px-[26px] md:px-[30px] py-[12px] md:py-[13px] min-h-[46px] text-[14px] md:text-[15px] font-medium shrink-0 transition-colors hover:bg-[#ffffff] hover:text-[#1a1a1a]"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* 6. REVIEWS */}
        <section
          id="reviews"
          ref={reviewsRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={replaySection === 'reviews' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Customer reviews.
                </motion.span>
              </h2>
            </div>

            {/* Tablet & Desktop 3-column review grid */}
            <div className="hidden md:grid grid-cols-3 gap-[20px] mb-[28px]">
              {reviews.map((rev, i) => (
                <motion.div
                  key={i}
                  initial={reducedMotion ? { clipPath: 'inset(0% 0 0 0)' } : { clipPath: 'inset(100% 0 0 0)' }}
                  whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                  className="bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[20px] flex flex-col justify-between text-left min-h-[180px] transition-colors duration-300 hover:border-[#1a1a1a]"
                >
                  <div>
                    <div
                      aria-label="5 out of 5 stars"
                      className="text-[15px] leading-none text-[#1a1a1a] tracking-[2px] mb-[10px]"
                    >
                      {rev.stars}
                    </div>
                    <p className="text-[14px] sm:text-[15px] leading-[1.65] tracking-[-0.01em] text-[#1a1a1a] font-normal mb-[18px] text-left">
                      {rev.text}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-[12px]">
                    <p className="text-[13px] leading-[20px] text-[#767676] font-normal text-left">
                      {rev.author}
                    </p>
                    <span className="text-[12px] leading-[18px] text-[#767676] font-normal">
                      {rev.source}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile horizontal snap review slider */}
            <div className="md:hidden flex gap-[14px] overflow-x-auto snap-x-mandatory no-scrollbar pb-[12px] mb-[20px]">
              {reviews.map((rev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="snap-start shrink-0 w-[84%] bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[16px] flex flex-col justify-between text-left min-h-[170px]"
                >
                  <div>
                    <div
                      aria-label="5 out of 5 stars"
                      className="text-[14px] leading-none text-[#1a1a1a] tracking-[2px] mb-[10px]"
                    >
                      {rev.stars}
                    </div>
                    <p className="text-[13px] sm:text-[14px] leading-[1.6] tracking-[-0.01em] text-[#1a1a1a] font-normal mb-[16px] text-left">
                      {rev.text}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-[12px]">
                    <p className="text-[12px] sm:text-[13px] leading-[18px] text-[#767676] font-normal text-left">
                      {rev.author}
                    </p>
                    <span className="text-[11px] sm:text-[12px] leading-[18px] text-[#767676] font-normal">
                      {rev.source}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-left">
              <a
                href="https://maps.google.com/?cid=66183361397952193&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA"
                target="_blank"
                rel="noopener noreferrer"
                className="animated-link text-[14px] sm:text-[15px] leading-[1.7] text-[#1a1a1a] hover:text-[#0000ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
              >
                Read more reviews on Google
              </a>
            </div>
          </div>
        </section>

        {/* 7. RECENT WORK */}
        <section
          id="recent-work"
          ref={recentRef}
          aria-label="Recent plumbing projects"
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#f4f4f4] transition-colors duration-600"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Recent work.
                </motion.span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[16px] sm:gap-[20px] lg:gap-[28px] items-start">
              <motion.div
                style={{ y: currentRecentLargeY }}
                className="md:col-span-2 lg:col-span-8 flex flex-col text-left group"
              >
                <motion.div
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[16/10]"
                >
                  <ImageWithFallback
                    image={recentWorks[0].image}
                    radius="8px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal text-left mt-[8px]">
                  {recentWorks[0].caption}
                </span>
              </motion.div>

              <motion.div
                style={{ y: currentRecentSmallY }}
                className="md:col-span-1 lg:col-span-4 flex flex-col text-left group"
              >
                <motion.div
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[4/3]"
                >
                  <ImageWithFallback
                    image={recentWorks[1].image}
                    radius="8px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal text-left mt-[8px]">
                  {recentWorks[1].caption}
                </span>
              </motion.div>

              <motion.div
                style={{ y: currentRecentSmallY }}
                className="md:col-span-1 lg:col-span-4 flex flex-col text-left group"
              >
                <motion.div
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[4/3]"
                >
                  <ImageWithFallback
                    image={recentWorks[2].image}
                    radius="8px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal text-left mt-[8px]">
                  {recentWorks[2].caption}
                </span>
              </motion.div>

              <motion.div
                style={{ y: currentRecentSmallY }}
                className="md:col-span-1 lg:col-span-4 flex flex-col text-left group"
              >
                <motion.div
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[4/3]"
                >
                  <ImageWithFallback
                    image={recentWorks[3].image}
                    radius="8px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal text-left mt-[8px]">
                  {recentWorks[3].caption}
                </span>
              </motion.div>

              <motion.div
                style={{ y: currentRecentSmallY }}
                className="md:col-span-1 lg:col-span-4 flex flex-col text-left group"
              >
                <motion.div
                  className="w-full rounded-[8px] overflow-hidden bg-[#f4f4f4] aspect-[4/3]"
                >
                  <ImageWithFallback
                    image={recentWorks[4].image}
                    radius="8px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal text-left mt-[8px]">
                  {recentWorks[4].caption}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. SERVICE AREA */}
        <section
          id="areas"
          ref={areasRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={replaySection === 'areas' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Where we work.
                </motion.span>
              </h2>
            </div>

            <div className="border-t border-[#e5e7eb] mb-[22px] md:mb-[30px]">
              {towns.map((town, idx) => (
                <motion.div
                  key={idx}
                  initial={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: EASE }}
                  className="border-b border-[#e5e7eb] py-[14px] sm:py-[18px] md:py-[24px] text-left"
                >
                  <span className="text-[22px] sm:text-[28px] md:text-[36px] lg:text-[46px] leading-[1.1] tracking-[-0.035em] font-medium text-[#1a1a1a]">
                    {town}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="text-[14px] sm:text-[15px] leading-[1.7] text-[#767676] font-normal text-left">
              Don't see your neighborhood?{' '}
              <a
                href="tel:+17864432723"
                className="animated-link text-[#0000ee] hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
              >
                Call us.
              </a>
            </p>
          </div>
        </section>

        {/* NEW SECTION 3: COMMON QUESTIONS (FAQ) */}
        <section
          id="faq"
          ref={faqRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] bg-[#ffffff]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: EASE }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#e5e7eb] origin-left"
          />

          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="mb-[28px] sm:mb-[36px] md:mb-[44px] text-left overflow-hidden">
              <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal block mb-[6px]">
                Frequently asked questions
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[56px] leading-[1.08] tracking-[-0.038em] font-medium text-[#1a1a1a]">
                <motion.span
                  initial={reducedMotion ? { y: 0 } : { y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  animate={replaySection === 'faq' ? { y: [16, 0], opacity: [0, 1] } : undefined}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="block"
                >
                  Common questions.
                </motion.span>
              </h2>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] text-[#767676] font-normal mt-[10px] max-w-[620px]">
                Direct answers regarding service areas, licensing, emergency calls and plumbing repairs.
              </p>
            </div>

            <div className="border-t border-[#e5e7eb] max-w-[960px]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-[#e5e7eb]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-[16px] sm:py-[20px] md:py-[24px] flex items-center justify-between text-left gap-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[15px] sm:text-[17px] md:text-[19px] leading-[1.3] font-medium text-[#1a1a1a]">
                        {faq.q}
                      </span>
                      <span
                        className={`w-[30px] h-[30px] rounded-full border border-[#e5e7eb] flex items-center justify-center shrink-0 text-[#1a1a1a] transition-transform duration-300 ${
                          isOpen ? 'rotate-45 border-[#1a1a1a]' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-[18px] sm:pb-[22px] text-[13px] sm:text-[14px] leading-[1.7] text-[#767676] font-normal text-left max-w-[800px]">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-[22px] md:mt-[30px] text-left">
              <p className="text-[13px] sm:text-[14px] leading-[1.7] text-[#767676] font-normal">
                Have a question not listed here?{' '}
                <a
                  href="tel:+17864432723"
                  className="animated-link text-[#0000ee] hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                >
                  Call us directly
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA + FORM WITH COMPREHENSIVE VALIDATION */}
        <section
          id="quote"
          ref={ctaRef}
          className="relative py-[52px] sm:py-[72px] md:py-[96px] border-b border-[#e5e7eb] overflow-hidden bg-[#1a1a1a]"
        >
          {/* Parallax Scaling Background Image */}
          <motion.div
            style={{ scale: currentCtaScale }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <ImageWithFallback
              image={IMAGES.cta_background}
              radius="0px"
              className="w-full h-full object-cover block"
            />
          </motion.div>

          {/* Flat Solid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: 'rgba(26, 26, 26, 0.78)' }}
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] sm:gap-[40px] lg:gap-[48px] items-start">
              {/* Left Column: Direct Emergency Dispatch Info & Call Action */}
              <div className="lg:col-span-6 text-left text-[#ffffff]">
                <span className="text-[12px] sm:text-[13px] leading-[20px] text-[#ffffff] font-normal block mb-[10px] sm:mb-[14px]">
                  Emergency plumbing across Miami & South Florida
                </span>
                <div className="overflow-hidden mb-[16px] sm:mb-[20px]">
                  <h2 className="text-[28px] xs:text-[34px] sm:text-[44px] md:text-[52px] lg:text-[58px] leading-[1.08] tracking-[-0.038em] font-medium text-[#ffffff]">
                    Call our emergency dispatch line.
                  </h2>
                </div>

                <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#ffffff] font-normal mb-[22px] md:mb-[28px] max-w-[460px] text-left">
                  Residential and commercial plumbing across Miami and South Florida. Available 24 hours a day, 7 days a week.
                </p>

                {/* Final CTA Call Button (no phone number text) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[12px]">
                  <a
                    href="tel:+17864432723"
                    className="inline-flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#ffffff] px-[30px] sm:px-[36px] py-[14px] md:py-[16px] min-h-[48px] md:min-h-[54px] text-[15px] md:text-[16px] font-medium leading-none transition-[background-color,color,transform] duration-200 hover:bg-[#1a1a1a] hover:text-[#ffffff] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                  >
                    Call Now
                  </a>
                  <span className="text-[13px] text-[#ffffff] font-normal">
                    Available 24/7 on standby
                  </span>
                </div>
              </div>

              {/* Form container with comprehensive real-time validation */}
              <div className="lg:col-span-6 bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[16px] sm:p-[24px] md:p-[28px] text-left">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                    className="py-[20px] text-left"
                  >
                    <div className="flex items-center gap-[8px] mb-[12px]">
                      <span className="w-[10px] h-[10px] rounded-full bg-[#0000ee]" />
                      <span className="text-[13px] font-medium text-[#1a1a1a]">
                        Request Confirmed
                      </span>
                    </div>
                    <h3 className="text-[22px] sm:text-[26px] leading-[1.3] tracking-[-0.03em] font-medium text-[#1a1a1a] mb-[10px]">
                      Thanks, we got your request.
                    </h3>
                    <p className="text-[14px] leading-[1.65] text-[#767676] font-normal mb-[20px]">
                      We'll call you back shortly at <strong className="text-[#1a1a1a] font-medium">{formData.phone}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                          name: '',
                          phone: '',
                          service: 'Emergency plumbing',
                          message: '',
                        });
                        setFormTouched({ name: false, phone: false });
                        setFormErrors({});
                      }}
                      className="inline-flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#1a1a1a] px-[24px] py-[13px] min-h-[46px] text-[14px] font-medium leading-none hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-[background-color,color] duration-200"
                    >
                      Send another request
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} noValidate className="space-y-[14px]">
                    {/* Name Field */}
                    <motion.div
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0, ease: EASE }}
                    >
                      <label
                        htmlFor="form-name"
                        className="block text-[13px] sm:text-[14px] leading-[20px] text-[#1a1a1a] font-normal mb-[4px] text-left"
                      >
                        Name <span className="text-[var(--error,#dc2626)]">*</span>
                      </label>
                      <input
                        id="form-name"
                        ref={nameInputRef}
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={handleNameBlur}
                        placeholder="Your full name"
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? 'form-name-error' : undefined}
                        className={`w-full bg-[#ffffff] border ${
                          formErrors.name
                            ? 'border-[var(--error,#dc2626)] focus:border-[var(--error,#dc2626)]'
                            : 'border-[#e5e7eb] focus:border-[#1a1a1a]'
                        } rounded-[8px] p-[11px] sm:p-[13px] text-[14px] sm:text-[15px] text-[#1a1a1a] outline-none transition-colors`}
                      />
                      {formErrors.name && (
                        <p
                          id="form-name-error"
                          role="alert"
                          className="text-[12px] sm:text-[13px] leading-[18px] text-[var(--error,#dc2626)] font-normal mt-[4px] flex items-center gap-[4px] text-left"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </motion.div>

                    {/* Phone Field */}
                    <motion.div
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
                    >
                      <label
                        htmlFor="form-phone"
                        className="block text-[13px] sm:text-[14px] leading-[20px] text-[#1a1a1a] font-normal mb-[4px] text-left"
                      >
                        Phone <span className="text-[var(--error,#dc2626)]">*</span>
                      </label>
                      <input
                        id="form-phone"
                        ref={phoneInputRef}
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={handlePhoneBlur}
                        placeholder="(786) 443-2723"
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? 'form-phone-error' : undefined}
                        className={`w-full bg-[#ffffff] border ${
                          formErrors.phone
                            ? 'border-[var(--error,#dc2626)] focus:border-[var(--error,#dc2626)]'
                            : 'border-[#e5e7eb] focus:border-[#1a1a1a]'
                        } rounded-[8px] p-[11px] sm:p-[13px] text-[14px] sm:text-[15px] text-[#1a1a1a] outline-none transition-colors`}
                      />
                      {formErrors.phone && (
                        <p
                          id="form-phone-error"
                          role="alert"
                          className="text-[12px] sm:text-[13px] leading-[18px] text-[var(--error,#dc2626)] font-normal mt-[4px] flex items-center gap-[4px] text-left"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </motion.div>

                    {/* What's going on? */}
                    <motion.div
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
                    >
                      <label
                        htmlFor="form-service"
                        className="block text-[13px] sm:text-[14px] leading-[20px] text-[#1a1a1a] font-normal mb-[4px] text-left"
                      >
                        What's going on?
                      </label>
                      <select
                        id="form-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[11px] sm:p-[13px] text-[14px] sm:text-[15px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                      >
                        <option value="Emergency plumbing">Emergency plumbing</option>
                        <option value="Drain cleaning">Drain cleaning</option>
                        <option value="Water heaters">Water heaters</option>
                        <option value="Sewer line repair">Sewer line repair</option>
                        <option value="Pipe & leak repair">Pipe & leak repair</option>
                        <option value="Valves & water filtration">Valves & water filtration</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </motion.div>

                    {/* Message (optional) */}
                    <motion.div
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
                    >
                      <label
                        htmlFor="form-message"
                        className="block text-[13px] sm:text-[14px] leading-[20px] text-[#1a1a1a] font-normal mb-[4px] text-left"
                      >
                        Message (optional)
                      </label>
                      <textarea
                        id="form-message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe the plumbing problem..."
                        className="w-full bg-[#ffffff] border border-[#e5e7eb] rounded-[8px] p-[11px] sm:p-[13px] text-[14px] sm:text-[15px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] resize-none"
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
                      className="pt-[4px] text-left"
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#e5e7eb] px-[28px] py-[14px] md:py-[16px] min-h-[48px] md:min-h-[56px] w-full sm:w-auto sm:min-w-[200px] text-[15px] md:text-[16px] font-medium leading-none transition-[background-color,color,border-color,transform] duration-200 hover:bg-[#ffffff] hover:text-[#1a1a1a] hover:border-[#1a1a1a] hover:-translate-y-[2px] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-[8px]">
                            <svg className="animate-spin h-4 w-4 text-current shrink-0" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span>Submitting quote...</span>
                          </span>
                        ) : (
                          'Request my free quote'
                        )}
                      </button>
                      <p className="text-[12px] sm:text-[13px] text-[#767676] mt-[8px]">
                        For active leaks, tap Call Now above for immediate response.
                      </p>
                    </motion.div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. REFINED EDITORIAL FOOTER */}
      <footer className="pt-[52px] sm:pt-[72px] pb-[96px] lg:pb-[52px] bg-[#ffffff] text-left border-t border-[#e5e7eb]">
        <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[36px] lg:px-[48px] space-y-[36px] sm:space-y-[48px] md:space-y-[60px]">
          {/* Pre-footer Action Card */}
          <div className="bg-[#f4f4f4] border border-[#e5e7eb] rounded-[8px] p-[20px] sm:p-[26px] md:p-[32px] flex flex-col lg:flex-row lg:items-center justify-between gap-[20px]">
            <div className="max-w-[620px]">
              <div className="flex items-center gap-[8px] mb-[8px]">
                <span
                  aria-hidden="true"
                  className="w-[8px] h-[8px] rounded-full bg-[#0000ee] animate-[pulse_2.4s_ease-in-out_infinite]"
                />
                <span className="text-[12px] sm:text-[13px] font-medium text-[#1a1a1a]">
                  24/7 Emergency Plumbing Service
                </span>
              </div>
              <h3 className="text-[19px] sm:text-[22px] md:text-[25px] leading-[1.25] font-medium text-[#1a1a1a] mb-[6px]">
                Have an urgent leak or need plumbing service in South Florida?
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#767676] font-normal">
                Our team serves Miami, North Miami Beach, Golden Beach, Cooper City, Weston and surrounding communities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] shrink-0">
              {/* Pre-footer Call Button (no phone number text) */}
              <a
                href="tel:+17864432723"
                className="inline-flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#1a1a1a] px-[26px] sm:px-[32px] py-[12px] min-h-[46px] text-[14px] sm:text-[15px] font-medium leading-none transition-colors hover:bg-[#ffffff] hover:text-[#1a1a1a] text-center"
              >
                Call Now
              </a>
              <a
                href="#quote"
                onClick={handleQuoteCtaClick}
                className="inline-flex items-center justify-center rounded-[40px] bg-[#ffffff] text-[#1a1a1a] border border-[#1a1a1a] px-[22px] sm:px-[26px] py-[12px] min-h-[46px] text-[14px] sm:text-[15px] font-medium leading-none transition-colors hover:bg-[#1a1a1a] hover:text-[#ffffff] text-center"
              >
                Request free quote
              </a>
            </div>
          </div>

          {/* Main 4-Column Editorial Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-[28px] sm:gap-[36px] lg:gap-[48px]">
            {/* Col 1: Practice Info (4 cols) */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-between space-y-[14px]">
              <div>
                <a
                  href="#"
                  className="text-[17px] sm:text-[19px] font-medium tracking-[-0.03em] text-[#1a1a1a] block mb-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
                >
                  All American Plumbing & Drain Cleaning
                </a>
                <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#767676] font-normal mb-[14px] max-w-[340px]">
                  Residential and commercial plumbers serving Miami, North Miami Beach and South Florida. 24/7 emergency plumbing, drain cleaning, water heaters and sewer line repairs.
                </p>
                <div className="space-y-[3px] text-[13px] leading-[20px]">
                  <p className="text-[#767676]">2011 NE 196th Terrace, North Miami Beach, FL 33179</p>
                  <p className="font-medium text-[#1a1a1a]">FL License #CFC1431411</p>
                </div>
              </div>
            </div>

            {/* Col 2: Emergency Dispatch (3 cols) */}
            <div className="lg:col-span-3 space-y-[8px]">
              <span className="text-[12px] sm:text-[13px] font-medium text-[#767676] block">
                24/7 Emergency Service
              </span>
              <div>
                <p className="text-[18px] sm:text-[20px] font-medium text-[#1a1a1a] block leading-[1.3] mb-[3px]">
                  Available 24/7
                </p>
                <p className="text-[13px] leading-[20px] text-[#767676]">
                  Immediate dispatch across South Florida
                </p>
              </div>
              <div className="pt-[4px] space-y-[2px] text-[13px] text-[#767676]">
                <p>Residential & Commercial</p>
                <p>Miami & South Florida</p>
              </div>
            </div>

            {/* Col 3: Navigation Index (3 cols) */}
            <div className="lg:col-span-3 space-y-[8px]">
              <span className="text-[12px] sm:text-[13px] font-medium text-[#767676] block">
                Navigation Index
              </span>
              <ul className="space-y-[7px] text-[13px] sm:text-[14px] text-[#1a1a1a]">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className="animated-link hover:text-[#0000ee] text-[#1a1a1a] py-[2px] inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#quote"
                    onClick={handleQuoteCtaClick}
                    className="animated-link hover:text-[#0000ee] text-[#1a1a1a] py-[2px] inline-block font-medium"
                  >
                    Request a Quote
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Service Areas (2 cols) */}
            <div className="lg:col-span-2 space-y-[8px]">
              <span className="text-[12px] sm:text-[13px] font-medium text-[#767676] block">
                Service Areas
              </span>
              <ul className="space-y-[5px] text-[13px] sm:text-[14px] text-[#767676]">
                {towns.map((town, idx) => (
                  <li key={idx} className="text-[#1a1a1a] font-normal">
                    {town}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Legal & Back to Top Strip */}
          <div className="pt-[20px] border-t border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] text-[12px] sm:text-[13px] leading-[20px] text-[#767676] font-normal">
            <div className="flex flex-wrap items-center gap-[8px] sm:gap-[14px]">
              <span>© 2026 All American Plumbing & Drain Cleaning. All rights reserved.</span>
              <span className="hidden sm:inline" aria-hidden="true">•</span>
              <span>FL License #CFC1431411</span>
            </div>

            {/* Back to top button */}
            <button
              type="button"
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-[6px] text-[#1a1a1a] hover:text-[#0000ee] font-medium transition-colors text-left sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ee]"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* 11. STICKY MOBILE CALL BAR */}
      <motion.div
        initial={{ y: '100%' }}
        animate={heroOutOfView && !isDrawerOpen ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.4, ease: EASE }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#ffffff] border-t border-[#e5e7eb] p-[10px] sm:p-[12px]"
        style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-[10px] max-w-[480px] mx-auto">
          {/* Sticky Bar Call Button (no phone number text) */}
          <a
            href="tel:+17864432723"
            className="flex-1 flex items-center justify-center rounded-[40px] bg-[#1a1a1a] text-[#ffffff] border border-[#e5e7eb] min-h-[48px] px-[16px] text-[15px] font-medium leading-none transition-colors hover:bg-[#ffffff] hover:text-[#1a1a1a] hover:border-[#1a1a1a] active:scale-[0.98] text-center"
          >
            Call Now
          </a>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            className="shrink-0 w-[48px] h-[48px] rounded-[40px] border border-[#e5e7eb] bg-[#ffffff] text-[#1a1a1a] flex items-center justify-center hover:border-[#1a1a1a] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="8" y2="8" />
              <line x1="4" x2="20" y1="16" y2="16" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
