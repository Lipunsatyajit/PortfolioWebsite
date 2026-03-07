import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input({ required: true }) mobileMenuOpen = false;
  @Input() activeSection = '';

  @Output() themeToggle = new EventEmitter<void>();
  @Output() menuToggle  = new EventEmitter<void>();
  @Output() menuClose   = new EventEmitter<void>();

  onThemeToggle(): void { this.themeToggle.emit(); }
  onMenuToggle(): void  { this.menuToggle.emit(); }
  onClose(): void       { this.menuClose.emit(); }
}
