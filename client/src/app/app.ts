import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './common/footer/footer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCamera, heroCheckBadge, heroComputerDesktop, heroCurrencyDollar,
  heroCurrencyRupee, heroDevicePhoneMobile, heroDeviceTablet, heroEnvelope,
  heroHome, heroPhone, heroShoppingBag, heroSwatch, heroTruck, heroUsers,
  heroUserCircle, heroHeart, heroShoppingCart, heroMagnifyingGlass, heroEllipsisVertical,
  heroPlus,heroUserGroup, heroWallet, heroFolderArrowDown, heroPower, heroFolder ,heroTrash} from '@ng-icons/heroicons/outline';
  import {heroHeartSolid, heroUserSolid, heroFolderSolid, heroWalletSolid, heroPowerSolid, heroFolderArrowDownSolid, heroChartBarSolid, heroSquaresPlusSolid,} from "@ng-icons/heroicons/solid"
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './common/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, RouterLink, NgIconComponent, CommonModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  viewProviders: [provideIcons({ heroUsers, heroPhone, heroEnvelope, heroCurrencyDollar, heroHome,
    heroShoppingBag, heroCurrencyRupee, heroTruck, heroCheckBadge, heroDevicePhoneMobile, heroComputerDesktop,
    heroSwatch, heroCamera, heroDeviceTablet, heroUserCircle, heroHeart, heroShoppingCart, heroMagnifyingGlass,
    heroEllipsisVertical , heroPlus, heroUserGroup, heroHeartSolid, heroWallet,heroFolderArrowDown, heroPower,
    heroUserSolid, heroFolder,heroFolderSolid, heroWalletSolid, heroPowerSolid, heroFolderArrowDownSolid, heroChartBarSolid, heroSquaresPlusSolid})]   //ICONS NAME WE HAVE DOWNLOADED HERO ICONS PACKAGE FOR OUR PROJECT
   /* https://ng-icons.github.io/ng-icons/#/browse-icons */
})

export class AppComponent {
  title = 'ShopNest-Ecommerce';
}
