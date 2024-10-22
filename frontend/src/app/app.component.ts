import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCamera, heroCheckBadge, heroComputerDesktop, heroCurrencyDollar, heroCurrencyRupee, heroDevicePhoneMobile, heroDeviceTablet, heroEnvelope, heroHome, heroMicrophone, heroPhone, heroPlay, heroShoppingBag, heroSwatch, heroTruck, heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, RouterLink, NgIconComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  viewProviders: [provideIcons({ heroUsers, heroPhone, heroEnvelope, heroCurrencyDollar, heroHome, heroShoppingBag, heroCurrencyRupee, heroTruck, heroCheckBadge, heroDevicePhoneMobile, heroComputerDesktop, heroSwatch, heroCamera, heroDeviceTablet, heroMicrophone,  })]    ///IDHAR LAGADEEE....JAISE YEH HAI ICON KA NAAM
})

export class AppComponent {

  handleClick() {
    throw new Error('Method not implemented.');
  }
  title = 'my-project';
}
