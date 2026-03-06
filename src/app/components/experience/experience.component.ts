import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  role: string;
  duration: string;
  technologies: string;
  description: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      role: 'Angular Developer',
      duration: '1.6 Years',
      technologies: 'Angular • SaaS / ERP',
      description: 'Worked on REval ERP SaaS application involving planning modules, forms, validations, and UI enhancements.'
    }
  ];
}
