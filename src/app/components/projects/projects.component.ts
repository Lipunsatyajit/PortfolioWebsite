import { Component, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger, style, animate, transition, query, stagger, state, keyframes
} from '@angular/animations';

interface Project {
  badges: string[];
  badgeColor: string;      // accent colour for the card top-bar
  title: string;
  description: string;
  tags: string[];
  highlights: string[];
  link: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  animations: [
    // Section header
    trigger('headerReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(16px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.55s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    // Stagger + bounce entry for cards
    trigger('projectsReveal', [
      transition('hidden => visible', [
        query('.project', [
          style({ opacity: 0 }),
          stagger(130, [
            animate('0.75s ease', keyframes([
              style({ opacity: 0, transform: 'translateY(40px) scale(0.93)', offset: 0    }),
              style({ opacity: 1, transform: 'translateY(-6px) scale(1.02)', offset: 0.70 }),
              style({ opacity: 1, transform: 'translateY(2px)  scale(0.99)', offset: 0.88 }),
              style({ opacity: 1, transform: 'none',                         offset: 1    }),
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    // Per-card hover animation (lift + glow-in)
    trigger('cardHover', [
      state('idle', style({
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
      })),
      state('hovered', style({
        transform: 'translateY(-6px) scale(1.015)',
        boxShadow: '0 16px 40px rgba(124,92,255,0.22), 0 0 0 1px rgba(124,92,255,0.3)'
      })),
      transition('idle <=> hovered', animate('0.28s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ])
  ]
})
export class ProjectsComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);

  sectionState   = signal<'hidden' | 'visible'>('hidden');
  hoveredIndex   = signal<number>(-1);

  readonly projects: Project[] = [
    {
      badges: ['SaaS', 'ERP', 'Micro-Frontend'],
      badgeColor: '#7c5cff',
      title: 'REval – Multi-Module SaaS ERP',
      description:
        'REval is a full-scale SaaS ERP platform built with Angular Module Federation (Webpack 5). ' +
        'The ERP contains dedicated submodules — HRMS, Payroll, POS, Finance, Healthcare, ' +
        'Procurement, and Project Management — each independently deployable and integrated ' +
        'via a unified shell application.',
      highlights: [
        'ERP Submodules: HRMS, Payroll, POS, Finance, Healthcare, Procurement & Project Management — all built as micro-frontends inside the ERP',
        'Module Federation (Webpack 5) — each submodule deploys independently while sharing the ERP shell',
        'Shared Angular component library and design system used consistently across all submodules',
        'Role-based access control (RBAC) with per-submodule permission matrix for fine-grained access',
        'Complex multi-step reactive forms with dynamic validation tailored per submodule workflow',
        'Real-time dashboards with live data feeds via RxJS & REST APIs across all modules',
      ],
      tags: ['Angular 15', 'Module Federation', 'HRMS', 'POS', 'Healthcare', 'Procurement', 'TypeScript', 'RxJS'],
      link: '#'
    },
    {
      badges: ['E-Commerce', 'Retail'],
      badgeColor: '#23c2ff',
      title: 'Watch Station India',
      description:
        'Responsive e-commerce platform for Watch Station India — a premium watch retailer. ' +
        'Built product catalog pages, category navigation, filtering, and a streamlined ' +
        'checkout flow with brand-guarantee and shipment-tracking integration.',
      highlights: [
        'Category navigation — Womens, Mens, Brands, Watches, Jewelry, Leathers, Sale',
        'Dynamic product filtering and search across 1000+ SKUs',
        'Integrated Brand Warranty, Easy Return, and Express Shipment status features',
        'Safe & Secure checkout with responsive design for all screen sizes',
        'Performance-optimised lazy-loaded product listing pages',
      ],
      tags: ['Angular', 'E-Commerce', 'TypeScript', 'REST API', 'Responsive', 'Lazy Loading'],
      link: '#'
    },
    {
      badges: ['Planning', 'Enterprise'],
      badgeColor: '#2dd4bf',
      title: 'ITC Production Planning',
      description:
        'Production planning module with dynamic data grids, bulk Excel/PDF export, ' +
        'multi-criteria filters, and inline editing — efficiently handling ' +
        'large record sets without performance degradation.',
      highlights: [
        'Virtual scrolling for large dataset performance (10k+ records)',
        'Bulk export to Excel and PDF formats',
        'Multi-column filter engine with saved filter presets',
        'Inline cell editing with optimistic UI updates',
      ],
      tags: ['Angular', 'Data Tables', 'Export', 'Filters', 'Optimisation'],
      link: '#'
    }
  ];

  ngAfterViewInit(): void {
    const section = this.doc.querySelector('#projects') as HTMLElement | null;
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
