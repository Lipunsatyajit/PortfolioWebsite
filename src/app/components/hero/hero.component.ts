import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger, state, style, animate, transition, query, stagger
} from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  animations: [
    // Left panel: stagger children in
    trigger('heroLeftAnim', [
      transition('hidden => visible', [
        query('.hero-anim', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(90, [
            animate('0.65s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    // Right panel: slide in from right
    trigger('heroRightAnim', [
      state('hidden', style({ opacity: 0, transform: 'translateX(40px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('0.75s 0.3s cubic-bezier(0.2, 0.9, 0.2, 1)'))
    ]),
    // Mini-grid items stagger
    trigger('miniStagger', [
      transition('hidden => visible', [
        query('.mini', [
          style({ opacity: 0, transform: 'scale(0.9) translateY(12px)' }),
          stagger(80, [
            animate('0.5s 0.5s cubic-bezier(0.2, 0.9, 0.2, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroComponent implements AfterViewInit {
  panelState = signal<'hidden' | 'visible'>('hidden');

  private readonly joinDate = new Date(2024, 11, 1); // December 2024

  get yearsExp(): string {
    const now = new Date();
    let years = now.getFullYear() - this.joinDate.getFullYear();
    let months = now.getMonth() - this.joinDate.getMonth();
    if (months < 0) { years--; months += 12; }
    const total = Math.round((years + months / 12) * 10) / 10;
    return total.toFixed(1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.panelState.set('visible'), 80);
  }
}
