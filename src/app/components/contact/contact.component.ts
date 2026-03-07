import { DOCUMENT } from '@angular/common';
import { Component, AfterViewInit, signal, inject } from '@angular/core';
import {
  trigger, state, style, animate, transition, query, stagger
} from '@angular/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  animations: [
    trigger('headerReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(16px)' })),
      state('visible', style({ opacity: 1, transform: 'none' })),
      transition('hidden => visible', animate('0.55s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    trigger('cardReveal', [
      transition('hidden => visible', [
        query('.tile', [
          style({ opacity: 0, transform: 'translateY(28px) scale(0.97)' }),
          stagger(120, [
            animate('0.6s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ContactComponent implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);

  sectionState = signal<'hidden' | 'visible'>('hidden');

  ngAfterViewInit(): void {
    const section = this.doc.querySelector('#contact') as HTMLElement | null;
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

  onSubmit(event: Event): void {
    event.preventDefault();
    this.doc.defaultView?.alert('Form submitted! Connect this to your backend or EmailJS.');
  }
}
