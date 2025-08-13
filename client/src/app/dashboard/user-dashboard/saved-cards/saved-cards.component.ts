import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Card {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
}


@Component({
  selector: 'app-saved-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './saved-cards.component.html',
  styles: ``
})
export class SavedCardsComponent {


}
