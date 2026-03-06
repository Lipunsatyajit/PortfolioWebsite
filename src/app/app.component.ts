import { AfterViewInit, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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
})
export class AppComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly theme = signal<Theme>('dark');
  readonly mobileMenuOpen = signal(false);

  readonly year = new Date().getFullYear();

  constructor() {
    // Apply theme on <body data-theme="...">
    effect(() => {
      const t = this.theme();
      this.doc.body.setAttribute('data-theme', t);
    });

    // Mark that JS is running (keeps reveal behavior consistent with the mock)
    this.doc.body.classList.add('js');
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  ngAfterViewInit(): void {
    this.setupAnchorScroll();
    this.setupRevealAnimations();
    this.setupTiltOnHeroCards();
  }

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

    this.destroyRef.onDestroy(() => {
      this.doc.removeEventListener('click', handler as any);
    });
  }

  private setupRevealAnimations(): void {
    const prefersReduced = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    const markStagger = (selector: string) => {
      this.doc.querySelectorAll(selector).forEach((wrap) => {
        wrap.classList.add('stagger');
        Array.from(wrap.children).forEach((child, i) => {
          child.classList.add('reveal', 'reveal-up');
          (child as HTMLElement).style.setProperty('--d', `${i * 80}ms`);
        });
      });
    };

    markStagger('.grid-3');
    markStagger('.mini-grid');

    // Special handling for About section grid-2 with directional reveals
    this.doc.querySelectorAll('#about .grid-2').forEach((wrap) => {
      const children = Array.from(wrap.children);
      children.forEach((child, i) => {
        child.classList.add('reveal');
        // Alternate: even index = left, odd = right
        if (i % 2 === 0) {
          child.classList.add('reveal-left');
        } else {
          child.classList.add('reveal-right');
        }
        (child as HTMLElement).style.setProperty('--d', `${i * 100}ms`);
      });
    });

    // Keep generic grid-2 handling for other sections
    this.doc.querySelectorAll('.grid-2:not(#about .grid-2)').forEach((wrap) => {
      wrap.classList.add('stagger');
      Array.from(wrap.children).forEach((child, i) => {
        child.classList.add('reveal', 'reveal-up');
        (child as HTMLElement).style.setProperty('--d', `${i * 80}ms`);
      });
    });

    const revealSingles = [
      '.hero-left', '.hero-right',
      '.section-head:not(#about .section-head)',
      '.card.contact-card',
      'footer .foot'
    ];

    revealSingles.forEach((sel) => {
      this.doc.querySelectorAll(sel).forEach((el) => el.classList.add('reveal', 'reveal-up'));
    });

    // About section-head with zoom effect
    this.doc.querySelectorAll('#about .section-head').forEach((el) => {
      el.classList.add('reveal', 'reveal-zoom');
    });

    this.doc.querySelectorAll('.timeline .step').forEach((el, i) => {
      el.classList.add('reveal', 'reveal-left');
      (el as HTMLElement).style.setProperty('--d', `${i * 90}ms`);
    });

    // Nested animation for contact details in About section
    this.doc.querySelectorAll('#about .contact-details-list .contact-item').forEach((item, i) => {
      item.classList.add('reveal', 'reveal-left');
      // Base delay: parent tile (100ms) + settle time (400ms) + stagger
      (item as HTMLElement).style.setProperty('--d', `${100 + 400 + (i * 60)}ms`);
    });

    // Hero section elements with stagger
    this.doc.querySelectorAll('.kicker').forEach((el) => {
      el.classList.add('reveal', 'reveal-down');
      (el as HTMLElement).style.setProperty('--d', '0ms');
    });

    this.doc.querySelectorAll('h1').forEach((el) => {
      el.classList.add('reveal', 'reveal-up');
      (el as HTMLElement).style.setProperty('--d', '100ms');
    });

    this.doc.querySelectorAll('.sub').forEach((el) => {
      el.classList.add('reveal', 'reveal-up');
      (el as HTMLElement).style.setProperty('--d', '200ms');
    });

    // Hero CTA buttons
    this.doc.querySelectorAll('.hero-cta').forEach((cta) => {
      Array.from(cta.children).forEach((btn, i) => {
        btn.classList.add('reveal', 'reveal-up');
        (btn as HTMLElement).style.setProperty('--d', `${300 + (i * 80)}ms`);
      });
    });

    // Pills with stagger
    this.doc.querySelectorAll('.meta-row').forEach((row) => {
      Array.from(row.children).forEach((pill, i) => {
        pill.classList.add('reveal', 'reveal-zoom');
        (pill as HTMLElement).style.setProperty('--d', `${400 + (i * 70)}ms`);
      });
    });

    // Profile cards in hero-right
    this.doc.querySelectorAll('.profile').forEach((el, i) => {
      el.classList.add('reveal', 'reveal-right');
      (el as HTMLElement).style.setProperty('--d', `${i * 100}ms`);
    });

    // Brand badge
    this.doc.querySelectorAll('.brand-badge').forEach((el) => {
      el.classList.add('reveal', 'reveal-zoom');
      (el as HTMLElement).style.setProperty('--d', '100ms');
    });

    if (prefersReduced) {
      this.doc.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const win = this.doc.defaultView;
    if (!win) return;

    if (!('IntersectionObserver' in win)) {
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

  private setupTiltOnHeroCards(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const prefersReduced = win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (prefersReduced) return;

    const targets = this.doc.querySelectorAll('.hero-left, .hero-right');

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

    targets.forEach((card) => {
      const htmlCard = card as HTMLElement;
      const move = (e: MouseEvent) => onMove(card, e);
      const leave = () => onLeave(card);
      htmlCard.addEventListener('mousemove', move);
      htmlCard.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        htmlCard.removeEventListener('mousemove', move);
        htmlCard.removeEventListener('mouseleave', leave);
      });
    });

    this.destroyRef.onDestroy(() => cleanups.forEach((fn) => fn()));
  }
}
