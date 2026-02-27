# Frontend-Backend Connection Strategy

This document outlines how the React frontend communicates with the Django REST Framework (DRF) backend.

## 1. Communication Protocol
We use **RESTful APIs** over HTTPS. The frontend sends JSON payloads and receives JSON responses.

*   **Frontend Library**: `Axios` (recommended) or native `fetch`.
*   **Base URL**: `http://localhost:8000/api/` (Development)

## 2. Authentication Strategy
We will use **JWT (JSON Web Tokens)** for secure, stateless authentication.

1.  **Login**: Frontend sends credentials to `/api/users/login/`.
2.  **Tokens**: Backend returns `access` and `refresh` tokens.
3.  **Authorization**: For subsequent requests, the frontend includes the access token in the header:
    `Authorization: Bearer <access_token>`

## 3. Core API Endpoints

| Feature | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/users/register/` | `POST` | Create a new user account |
| | `/api/users/login/` | `POST` | Get JWT tokens |
| **QR Codes** | `/api/qrcodes/` | `GET` | List all user's codes |
| | `/api/qrcodes/` | `POST` | Create a new code |
| | `/api/qrcodes/<id>/` | `PUT/PATCH`| Update code settings |
| | `/api/qrcodes/<id>/` | `DELETE` | Delete a code |
| **Folders** | `/api/folders/` | `GET/POST` | Manage user folders |
| **Profiles** | `/api/business/` | `GET/POST` | Manage Business Profiles |

## 4. Example Request (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Example: Saving a new QR code
export const saveQRCode = async (qrData, token) => {
  const response = await api.post('qrcodes/', qrData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
```

## 5. Handling Files
For PDF and image uploads, the frontend uses `FormData` objects:

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('name', 'My PDF');

api.post('files/', formData, {
  headers: { 'Content-Type': 'multipart/form-data', ...authHeader }
});
```

## 6. Development Workflow
1.  **CORS**: Ensure `django-cors-headers` is configured in `settings.py` to allow `http://localhost:3000`.
2.  **Environment Variables**: The Base URL should be stored in the frontend `.env` file as `VITE_API_BASE_URL`.
