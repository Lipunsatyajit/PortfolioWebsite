import { Component, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger, state, style, animate, transition, query, stagger, keyframes
} from '@angular/animations';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  icon: string;
  title: string;
  desc: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  animations: [
    // Cards stagger in with bounce-landing keyframes
    trigger('cardsReveal', [
      transition('hidden => visible', [
        query('.skill-card', [
          style({ opacity: 0 }),
          stagger(110, [
            animate('0.7s ease', keyframes([
              style({ opacity: 0, transform: 'translateY(36px) scale(0.92)', offset: 0 }),
              style({ opacity: 1, transform: 'translateY(-5px) scale(1.02)', offset: 0.72 }),
              style({ opacity: 1, transform: 'translateY(2px) scale(0.99)',  offset: 0.88 }),
              style({ opacity: 1, transform: 'none',                         offset: 1 }),
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    // Section header reveal
    trigger('headerReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(16px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.6s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ])
  ]
})
export class SkillsComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);

  sectionState = signal<'hidden' | 'visible'>('hidden');
  barsVisible = signal(false);

  readonly categories: SkillCategory[] = [
    {
      icon: '⚡',
      title: 'Frontend Development',
      desc: 'Building responsive, accessible interfaces with modern web standards and best practices.',
      skills: [
        { name: 'Angular (v12–18)', level: 85, color: '#dd1b16' },
        { name: 'TypeScript', level: 80, color: '#3178c6' },
        { name: 'HTML5 / CSS3', level: 90, color: '#e34c26' },
        { name: 'JavaScript (ES2022+)', level: 78, color: '#f0b90b' },
      ]
    },
    {
      icon: '🛠',
      title: 'Frameworks & Tools',
      desc: 'Modern Angular ecosystem — from state management to testing and build tooling.',
      skills: [
        { name: 'RxJS / Observables', level: 74, color: '#b7178c' },
        { name: 'Angular Material', level: 76, color: '#7c5cff' },
        { name: 'Git / GitHub', level: 82, color: '#f05032' },
        { name: 'REST API Integration', level: 79, color: '#23c2ff' },
      ]
    },
    {
      icon: '🎯',
      title: 'Core Strengths',
      desc: 'What I consistently deliver — clean, maintainable, and performant frontend code.',
      skills: [
        { name: 'Reusable Components', level: 88, color: '#2dd4bf' },
        { name: 'Reactive Forms', level: 84, color: '#7c5cff' },
        { name: 'Performance Optimisation', level: 72, color: '#f59e0b' },
        { name: 'UI Debugging & Fixes', level: 85, color: '#23c2ff' },
      ]
    }
  ];

  ngAfterViewInit(): void {
    const section = this.doc.querySelector('#skills') as HTMLElement | null;
    if (!section) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.sectionState.set('visible');
          // Slight delay so cards appear before bars fill
          setTimeout(() => this.barsVisible.set(true), 400);
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });

    io.observe(section);
  }
}
