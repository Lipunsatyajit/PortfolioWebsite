import { Component, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger, state, style, animate, transition, query, stagger
} from '@angular/animations';

interface Stat {
  target: number;
  suffix: string;
  label: string;
  decimal: boolean;
  current: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  animations: [
    trigger('headerReveal', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.97) translateY(10px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.55s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    trigger('tilesReveal', [
      transition('hidden => visible', [
        query('.tile', [
          style({ opacity: 0, transform: 'translateY(28px)' }),
          stagger(120, [
            animate('0.6s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('statsReveal', [
      transition('hidden => visible', [
        query('.stat-item', [
          style({ opacity: 0, transform: 'scale(0.85) translateY(14px)' }),
          stagger(90, [
            animate('0.5s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);

  sectionState = signal<'hidden' | 'visible'>('hidden');

  // Join date — keep in sync with experience.component.ts
  private readonly joinDate = new Date(2024, 11, 1); // December 2024

  /** Decimal years from joinDate to today, e.g. 1.3 */
  private get yearsExperience(): number {
    const now    = new Date();
    let years    = now.getFullYear() - this.joinDate.getFullYear();
    let months   = now.getMonth()    - this.joinDate.getMonth();
    if (months < 0) { years--; months += 12; }
    return Math.round((years + months / 12) * 10) / 10; // 1 decimal place
  }

  // Animated counter stats — Years Experience is computed dynamically
  readonly stats = signal<Stat[]>([
    { target: this.yearsExperience, suffix: '+', label: 'Years Experience', decimal: true,  current: 0 },
    { target: 20,                   suffix: '+', label: 'Components Built', decimal: false, current: 0 },
    { target: 3,                    suffix: '',  label: 'Products Shipped', decimal: false, current: 0 },
    { target: 28,                   suffix: '%', label: 'Bundle Reduction', decimal: false, current: 0 },
  ]);

  formatStat(s: Stat): string {
    return (s.decimal ? s.current.toFixed(1) : Math.round(s.current).toString()) + s.suffix;
  }

  ngAfterViewInit(): void {
    const section = this.doc.querySelector('#about') as HTMLElement | null;
    if (!section) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.sectionState.set('visible');
          // Delay counter start so Angular reveal anim plays first
          setTimeout(() => this.runCounters(), 300);
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });

    io.observe(section);
  }

  private runCounters(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const duration = 1600;
    const start = win.performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);

      this.stats.update(list =>
        list.map(s => ({ ...s, current: s.target * eased }))
      );

      if (p < 1) win.requestAnimationFrame(frame);
    };

    win.requestAnimationFrame(frame);
  }
}
