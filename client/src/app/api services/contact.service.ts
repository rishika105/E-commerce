import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root' // Makes the service globally available without needing to import in providers[]
})
export class ContactService {
  private baseUrl = environment.apiUrl; // API base URL from environment.ts

  constructor(private http: HttpClient) {}

  // This method sends the contact form data to the backend
  sendContactForm(data: { name: string; email: string; phone: string; message: string }): Observable<any> {
    // We POST the data to Spring Boot's /api/contact endpoint
    return this.http.post(`${this.baseUrl}/contact`, data);
  }
}
