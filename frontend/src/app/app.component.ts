import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEnvelope, heroPhone, heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, RouterLink, NgIconComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  viewProviders: [provideIcons({ heroUsers , heroPhone , heroEnvelope })]    ///IDHAR LAGADEEE....JAISE YEH HAI ICON KA NAAM
})

export class AppComponent {

handleClick() {
throw new Error('Method not implemented.');
}

  title = 'my-project';
}