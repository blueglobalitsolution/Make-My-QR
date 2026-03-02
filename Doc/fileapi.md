I have completed the frontend integration for the Server-Side File Storage feature. The application now seamlessly interacts with the Django backend for all file operations, fulfilling your requirements for persistence and cross-device access.

🚀 Key Improvements
1. Assets Library (New View)
I have introduced a dedicated Assets Library section in the application.

Centralized Management: Users can now view all their uploaded assets (PDFs, images) in one place, independent of the QR codes that use them.
Real-time Synchronization: The list is fetched directly from the /api/files/ endpoint, ensuring it stays in sync across all devices.
Asset Actions: Users can preview documents in the internal viewer, download them directly, or delete them to free up space.
2. Enhanced File Service (

fileStorage.ts
)
The underlying storage service has been completely overhauled:

API Migration: Removed the local browser-based IndexedDB logic. All "save", "list", and "delete" calls are now directed to your new backend API.
Folder Awareness: When uploading files via the Wizard, the frontend now passes the selected folderId to the backend, ensuring files are organized correctly within the user's hidden root folder.
3. Seamless Wizard Integration
Persistence: PDFs uploaded during QR creation are now stored permanently on the server.
Universal Links: Generated QR codes for PDFs now use a universal URL pattern (window.location.origin + "/view/file/ID") that works correctly in local, staging, and production environments.
Cleanup: Removed legacy code that initialized local databases for files, reducing the frontend's memory footprint.