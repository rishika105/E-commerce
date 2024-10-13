import { NgIconComponent } from '@ng-icons/core';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  styles: ``,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NgIconComponent]
})

export class AddressManagerComponent {
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
      // Edit existing address
      const index = this.addresses.indexOf(this.currentAddress);
      if (index !== -1) {
        this.addresses[index] = { ...this.newAddress };
      }
    } else {
      // Add new address
      this.addresses.push({ ...this.newAddress });
    }
    this.clearForm();
    this.showForm = false;
    this.currentAddress = null; // Reset the form state
    this.showModal = false; // Close modal after action
  }

  // Delete selected address
  deleteAddress(address: Address | null) {
    if (address) {
      this.addresses = this.addresses.filter(a => a !== address);
    }
    this.closeModal(); // Close modal after deleting
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
}
