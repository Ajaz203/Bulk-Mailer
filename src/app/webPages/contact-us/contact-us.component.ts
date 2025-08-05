import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../services/bulk-email.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { WebHeaderComponent } from '../web-header/web-header.component';
@Component({
  selector: 'app-contact-us',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,WebHeaderComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contactForm!: FormGroup;
countryCodes = [
  { key: 'IN', name: 'India', dialCode: '+91' },
  { key: 'US', name: 'United States', dialCode: '+1' },
  { key: 'UK', name: 'United Kingdom', dialCode: '+44' },
  { key: 'AU', name: 'Australia', dialCode: '+61' },
  { key: 'CA', name: 'Canada', dialCode: '+1' },
  { key: 'DE', name: 'Germany', dialCode: '+49' },
  { key: 'FR', name: 'France', dialCode: '+33' },
  { key: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { key: 'SG', name: 'Singapore', dialCode: '+65' },
  { key: 'CN', name: 'China', dialCode: '+86' },
  { key: 'JP', name: 'Japan', dialCode: '+81' },
  { key: 'KR', name: 'South Korea', dialCode: '+82' },
  { key: 'BR', name: 'Brazil', dialCode: '+55' },
  { key: 'RU', name: 'Russia', dialCode: '+7' },
  { key: 'ZA', name: 'South Africa', dialCode: '+27' },
  { key: 'MX', name: 'Mexico', dialCode: '+52' },
  { key: 'ID', name: 'Indonesia', dialCode: '+62' },
  { key: 'IT', name: 'Italy', dialCode: '+39' },
  { key: 'ES', name: 'Spain', dialCode: '+34' },
  { key: 'NL', name: 'Netherlands', dialCode: '+31' },
  { key: 'SE', name: 'Sweden', dialCode: '+46' },
  { key: 'CH', name: 'Switzerland', dialCode: '+41' },
  { key: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { key: 'PK', name: 'Pakistan', dialCode: '+92' },
  { key: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { key: 'NP', name: 'Nepal', dialCode: '+977' },
  { key: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { key: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { key: 'TR', name: 'Turkey', dialCode: '+90' },
  { key: 'PH', name: 'Philippines', dialCode: '+63' }
];

  constructor(private meta:  Meta, private titleService: Title,private formBuilder: FormBuilder,private toastr: ToastrService, private service: EmailService) {

  }
  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required,Validators.pattern('[0-9]{10}')]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', [Validators.required]),
      messages: new FormControl(''),
        countryCode: new FormControl('+91', Validators.required),
      termsCheckbox: new FormControl(false, [Validators.requiredTrue])
    });

 this.titleService.setTitle('Contact Us');
      this.meta.addTags([
        { name: 'keywords', content: 'Customer Support, Contact Us, Business Inquiry, Contact IntelligentMDG, Data Governance Consultation, iMDG Support Contact, Reach Out for Data Solutions, Contact Data Management Experts' },
        { name: 'description', content: 'Contact Us,' }
      ]);

}
onSubmit() {
  if (this.contactForm.valid) {
    const formValues = this.contactForm.value;
    const selectedCode = formValues.countryCode; 

    const finalData = {
      ...formValues,
      fullPhone: formValues.countryCode + formValues.phoneNumber
    };

    console.log(finalData);

    this.service.contactUs(finalData).subscribe(
      (res: any) => {
        console.log(res, "All data are good to go");

        this.toastr.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        this.contactForm.reset({
          countryCode: selectedCode
        });
      },
      error => {
        this.toastr.error('Error submitting form!', 'Error', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
        console.error('Error submitting form:', error);
      }
    );
  } else {
    this.toastr.warning('Please fill all required fields', 'Validation Error');
  }
}

get name() {
  return this.contactForm.get('name');
}
get phoneNumber() {
  return this.contactForm.get('phoneNumber');
}
get emailId() {
  return this.contactForm.get('emailId');
}
get subject() {
  return this.contactForm.get('subject');
}
get messages() {
  return this.contactForm.get('messages');
}
get termsCheckbox() {
  return this.contactForm.get('termsCheckbox');
}
}


