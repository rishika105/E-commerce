import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Adjust this to match your Spring Boot server URL

  getApiUrl(): string {
    return this.apiUrl;
  }
}