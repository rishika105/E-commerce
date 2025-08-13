import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-saved-upi',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './saved-upi.component.html',
  styles: ``
})
export class SavedUPIComponent {
 // Define UPI list as an array of UPI objects
 upiList: { provider: string; id: string }[] = [];

 // Function to delete a saved UPI
 deleteUpi(upiId: string): void {
   this.upiList = this.upiList.filter(upi => upi.id !== upiId);
 }

 // Function to add a new UPI after payment (simulating UPI addition)
 addNewUpi(): void {
   const newUpi = { provider: 'PhonePe UPI', id: 'example@okhdfcbank' }; // Example UPI
   this.upiList.push(newUpi);
 }

}
// Interface to define the structure of UPI entries
interface UpiEntry {
 provider: string;
 id: string;
}


///IMPORTANT////
// // After payment is successful, call this function
// this.savedUpiComponent.addNewUpi();

