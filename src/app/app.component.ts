import {
  AfterViewInit, Component, DestroyRef, effect, inject, signal
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

type Theme = 'dark' | 'light';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  animations: [
    trigger('scrollTopBtn', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.6) translateY(12px)', pointerEvents: 'none' })),
      state('visible', style({ opacity: 1, transform: 'scale(1) translateY(0)', pointerEvents: 'auto' })),
      transition('hidden <=> visible', animate('0.28s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ])
  ]
})
export class AppComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly theme         = signal<Theme>('dark');
  readonly mobileMenuOpen = signal(false);
  readonly showScrollTop  = signal(false);
  readonly scrollProgress = signal(0);
  readonly activeSection  = signal('');

  readonly year = new Date().getFullYear();

  constructor() {
    effect(() => {
      const t = this.theme();
      this.doc.body.setAttribute('data-theme', t);
    });
    this.doc.body.classList.add('js');
  }

  toggleTheme(): void   { this.theme.update((t) => (t === 'dark' ? 'light' : 'dark')); }
  toggleMobileMenu(): void { this.mobileMenuOpen.update((v) => !v); }
  closeMobileMenu(): void  { this.mobileMenuOpen.set(false); }

  scrollToTop(): void {
    this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    this.setupAnchorScroll();
    this.setupRevealAnimations();
    this.setupTiltOnHeroCards();
    this.setupCursorSpotlight();
    this.setupScrollTracking();
    this.setupActiveSectionObserver();
  }

  // ── Scroll tracking: progress bar + scroll-to-top visibility ──────────────
  private setupScrollTracking(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const onScroll = () => {
      const scrollY = win.scrollY;
      const docH = this.doc.documentElement.scrollHeight - win.innerHeight;
      this.showScrollTop.set(scrollY > 350);
      this.scrollProgress.set(docH > 0 ? Math.min(100, Math.round((scrollY / docH) * 100)) : 0);
    };

    win.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));
  }

  // ── Active section highlighting ────────────────────────────────────────────
  private setupActiveSectionObserver(): void {
    const win = this.doc.defaultView;
    if (!win || !('IntersectionObserver' in win)) return;

    const sectionIds = ['about', 'skills', 'projects', 'experience', 'contact'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, { threshold: 0.35, rootMargin: '-10% 0px -50% 0px' });

    sectionIds.forEach((id) => {
      const el = this.doc.getElementById(id);
      if (el) io.observe(el);
    });

    this.destroyRef.onDestroy(() => io.disconnect());
  }

  // ── Smooth anchor scroll ───────────────────────────────────────────────────
  private setupAnchorScroll(): void {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href || href === '#') return;

      const el = this.doc.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.closeMobileMenu();
    };

    this.doc.addEventListener('click', handler, { passive: false });
    this.destroyRef.onDestroy(() => this.doc.removeEventListener('click', handler as any));
  }

  // ── CSS reveal animations (elements NOT handled by Angular component triggers) ──
  private setupRevealAnimations(): void {
    const prefersReduced = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Only mark elements that are NOT already animated by their component's Angular animations.
    // Hero section sub-elements (component uses Angular triggers, but these are extra details)
    this.doc.querySelectorAll('.mini-grid').forEach((wrap) => {
      wrap.classList.add('stagger');
      Array.from(wrap.children).forEach((child, i) => {
        child.classList.add('reveal', 'reveal-up');
        (child as HTMLElement).style.setProperty('--d', `${i * 80}ms`);
      });
    });

    // Footer
    this.doc.querySelectorAll('footer .foot').forEach((el) => el.classList.add('reveal', 'reveal-up'));

    // Hero section static reveals (component handles main ones via Angular anim)
    this.doc.querySelectorAll('.brand-badge').forEach((el) => {
      el.classList.add('reveal', 'reveal-zoom');
      (el as HTMLElement).style.setProperty('--d', '100ms');
    });

    if (prefersReduced) {
      this.doc.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const win = this.doc.defaultView;
    if (!win || !('IntersectionObserver' in win)) {
      this.doc.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    this.doc.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  // ── Cursor spotlight: CSS vars --cx/--cy track mouse position ────────────
  private setupCursorSpotlight(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const onMove = (e: MouseEvent) => {
      this.doc.documentElement.style.setProperty('--cx', `${e.clientX}px`);
      this.doc.documentElement.style.setProperty('--cy', `${e.clientY}px`);
    };

    win.addEventListener('mousemove', onMove, { passive: true });
    this.destroyRef.onDestroy(() => win.removeEventListener('mousemove', onMove));
  }

  // ── 3-D tilt on hero cards + all tiles/projects ───────────────────────────
  private setupTiltOnHeroCards(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const prefersReduced = win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (prefersReduced) return;

    // Hero cards get stronger tilt; all other tiles get a softer tilt
    const heroTargets  = this.doc.querySelectorAll('.hero-left, .hero-right');
    const softTargets  = this.doc.querySelectorAll('.tile:not(.contact-info-tile), .project, .skill-card');

    const onMove = (card: Element, e: MouseEvent) => {
      const r = (card as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      (card as HTMLElement).style.transform =
        `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      (card as HTMLElement).style.transition = 'transform .08s linear';
    };

    const onLeave = (card: Element) => {
      (card as HTMLElement).style.transition = 'transform .35s ease';
      (card as HTMLElement).style.transform = 'none';
    };

    const cleanups: Array<() => void> = [];

    const attachTilt = (nodeList: NodeList) => {
      nodeList.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const move  = (e: MouseEvent) => onMove(card as Element, e);
        const leave = () => onLeave(card as Element);
        htmlCard.addEventListener('mousemove', move);
        htmlCard.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          htmlCard.removeEventListener('mousemove', move);
          htmlCard.removeEventListener('mouseleave', leave);
        });
      });
    };

    attachTilt(heroTargets);
    attachTilt(softTargets);

    this.destroyRef.onDestroy(() => cleanups.forEach((fn) => fn()));
  }
}
