import { Component, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger, style, animate, transition, query, stagger, state, keyframes
} from '@angular/animations';

interface Experience {
  role: string;
  company: string;
  duration: string;
  technologies: string;
  description: string;
  highlights: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  animations: [
    trigger('headerReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(16px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.55s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    trigger('cardReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(28px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.65s 0.1s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    trigger('timelineReveal', [
      transition('hidden => visible', [
        query('.step', [
          style({ opacity: 0 }),
          stagger(120, [
            animate('0.65s ease', keyframes([
              style({ opacity: 0, transform: 'translateX(-32px) scale(0.95)', offset: 0    }),
              style({ opacity: 1, transform: 'translateX(4px)  scale(1.01)', offset: 0.75 }),
              style({ opacity: 1, transform: 'none',                         offset: 1    }),
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('highlightReveal', [
      transition('hidden => visible', [
        query('li', [
          style({ opacity: 0, transform: 'translateX(-16px)' }),
          stagger(80, [
            animate('0.45s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ExperienceComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);

  sectionState = signal<'hidden' | 'visible'>('hidden');

  // Join date — change this when you join a new company
  private readonly joinDate = new Date(2024, 11, 1); // December 2024 (month is 0-indexed)

  /** Returns a human-readable duration like "1 yr 3 mos" from joinDate to today. */
  get liveDuration(): string {
    const now   = new Date();
    let years   = now.getFullYear() - this.joinDate.getFullYear();
    let months  = now.getMonth()    - this.joinDate.getMonth();

    if (months < 0) { years--; months += 12; }

    const parts: string[] = [];
    if (years  > 0) parts.push(`${years} yr`);
    if (months > 0) parts.push(`${months} mos`);
    return parts.length ? parts.join(' ') : 'Less than 1 month';
  }

  readonly experiences: Experience[] = [
    {
      role: 'Angular Frontend Developer',
      company: 'SaaS & ERP Product Company',
      duration: '', // computed below via liveDuration getter
      technologies: 'Angular 12–18 &bull; TypeScript &bull; RxJS &bull; HTML/CSS &bull; REST API &bull; Git',
      description:
        'Building and maintaining enterprise Angular applications across real estate ERP ' +
        'and SaaS POS products. Collaborate closely with backend engineers, UI/UX designers, ' +
        'and business analysts in agile sprints.',
      highlights: [
        'Developed 20+ reusable Angular components, significantly reducing duplication across modules',
        'Built complex reactive forms with dynamic field generation and cross-field validation',
        'Implemented role-based access control (RBAC) driving dynamic UI rendering per user role',
        'Optimised bundle size by ~28% through lazy-loaded modules and tree-shaking',
        'Integrated REST APIs using RxJS operators (switchMap, combineLatest, debounceTime)',
        'Delivered high-priority UI bug fixes under tight sprint deadlines with zero regressions',
      ]
    }
  ];

  ngAfterViewInit(): void {
    const section = this.doc.querySelector('#experience') as HTMLElement | null;
    if (!section) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.sectionState.set('visible');
          io.disconnect();
        }
      });
    }, { threshold: 0.1 });

    io.observe(section);
  }
}
