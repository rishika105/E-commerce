import { ConfirmationModalComponent } from './../../common/confirmation-modal/confirmation-modal.component';
import { NgIconComponent } from '@ng-icons/core';
import { Component, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgIconComponent,ConfirmationModalComponent]
})

export class AddressManagerComponent {

  ngOnInit() {
    const storedAddresses = localStorage.getItem('addresses');
    if (storedAddresses) {
      this.addresses = JSON.parse(storedAddresses);
    }
  }


constructor(private cdr: ChangeDetectorRef) {}


  addresses: Address[] = []; // Initialize as an empty array

  showForm = false;
  showModal = false;
  currentAddress: Address | null = null;  // Store the address to be edited
  newAddress: Address = {
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  };
  showConfirmDeleteModal = false;

  // Toggle form visibility for adding a new address
  toggleForm() {
    this.showForm = !this.showForm;
    this.clearForm();
  }

  // Clear form when needed
  clearForm() {
    this.newAddress = {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    };
  }

  // Submit address (Add or Edit logic)
  submitAddress() {
    if (this.currentAddress) {
      const index = this.addresses.indexOf(this.currentAddress);
      if (index !== -1) {
        this.addresses[index] = { ...this.newAddress };
      }
    } else {
      this.addresses.push({ ...this.newAddress });
    }
  // Save updated addresses to local storage
  localStorage.setItem('addresses', JSON.stringify(this.addresses));

    this.clearForm();
    this.showForm = false;
    this.currentAddress = null;
    this.showModal = false;

   // Manually trigger change detection if needed
   this.cdr.detectChanges();
  }

  delAddress(){
    this.showConfirmDeleteModal = true;
  }

  cancelDelete(){
    this.showConfirmDeleteModal = false;
  }

  // Delete selected address
  deleteAddress(address: Address | null) {
    this.showConfirmDeleteModal = false;
    if (address) {
      this.addresses = this.addresses.filter(a => a !== address);
    }
    this.closeModal(); // Close modal after deleting
    localStorage.removeItem('addresses');

  }

  // Open modal and load current address to edit
  openModal(address: Address) {
    this.currentAddress = address;
    this.newAddress = { ...address }; // Prefill the form with current address details
    this.showModal = true; // Show modal for edit/delete options
  }

  // Close the modal and reset
  closeModal() {
    this.showModal = false;
    this.currentAddress = null;
    this.clearForm();
  }

  // Open form with prefilled address to edit
  editAddress(address: Address) {
    this.newAddress = { ...address }; // Prefill form with selected address
    this.showForm = true; // Show form for editing
    this.showModal = false; // Close modal
  }

    // HostListener to detect click outside the modal
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) { // Adjust based on your container
        this.showModal = false;
      }
    }

}
