import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { ContactService } from '../../api services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgIconComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styles: ``
})
export class ContactComponent {
  contactForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastr: ToastrService
  ) {
    // Initialize the reactive form
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['']
    });
  }

  onSubmit() {
    // If form is invalid, show error and stop
    if (this.contactForm.invalid) {
      this.toastr.error("Please fill all required fields correctly");
      return;
    }

    this.loading = true;

    // Send the form data
    this.contactService.sendContactForm(this.contactForm.value).subscribe({
      next: (res) => {
        this.toastr.success("Message sent successfully");
        this.contactForm.reset(); // Clear form
        this.loading = false;
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("Cannot send message");
        this.loading = false;
      }
    });
  }
}
