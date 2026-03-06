import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({ selector: 'app-contact', standalone: true, templateUrl: './contact.component.html' })
export class ContactComponent {
  private readonly doc = inject(DOCUMENT);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.doc.defaultView?.alert('Design only - connect this to your backend later.');
  }
}
