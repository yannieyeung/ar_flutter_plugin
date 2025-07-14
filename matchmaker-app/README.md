# MatchMaker - AI-Powered Job Matching Platform

A Next.js 15 application that connects employers with helpers using AI-powered matching. Built with Firebase for authentication and data storage, this platform supports three user types: Employers, Agencies, and Individual Helpers.

## 🚀 Features

- **Multi-User Authentication**: Support for Employers, Agencies, and Individual Helpers
- **Flexible Sign-up**: Users can sign up with email or phone number
- **Server-side Authentication**: All authentication handled via secure API endpoints
- **Intelligent Routing**: Users are directed to appropriate pages based on registration status
- **Modern UI**: Beautiful, responsive design built with Tailwind CSS
- **Firebase Integration**: Secure data storage optimized for AI matching queries

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Deployment**: Ready for Vercel deployment

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Firebase project set up
- Firebase Authentication enabled (Email/Password and Phone providers)
- Cloud Firestore database created

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd matchmaker-app
npm install
```

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Enable Phone provider (optional)
4. Create a Firestore database:
   - Go to Firestore Database
   - Create database in production or test mode
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Add a web app if you haven't already
   - Copy the Firebase config object

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY="your_private_key_here"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PROJECT_ID=your_project_id

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### 4. Firebase Admin SDK Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values to your `.env.local` file:
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `project_id` → `FIREBASE_PROJECT_ID`

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗 Application Structure

```
src/
├── app/
│   ├── api/auth/          # Authentication API endpoints
│   ├── auth/              # Sign in/Sign up pages
│   ├── registration/      # Registration forms (placeholder)
│   ├── listings/          # Listings page for incomplete profiles
│   ├── dashboard/         # Dashboard for complete profiles
│   └── layout.tsx         # Root layout with AuthProvider
├── components/            # Reusable UI components
├── contexts/              # React contexts (Auth)
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Client-side Firebase config
│   ├── firebase-admin.ts  # Server-side Firebase config
│   └── db.ts             # Database utilities
└── types/                 # TypeScript type definitions
```

## 🔐 Authentication Flow

1. **Sign Up**: 
   - User selects user type (Employer/Agency/Individual Helper)
   - User can sign up with email or phone number
   - Account created in Firebase Auth and Firestore
   - User redirected to registration form

2. **Sign In**:
   - User signs in with email/phone and password
   - System checks registration completion status
   - Incomplete users → Registration form
   - Complete users → Dashboard

3. **Registration**:
   - Users can complete their profile or skip for later
   - Skipped users go to listings page
   - Completed users go to dashboard

4. **Route Protection**:
   - Middleware protects authenticated routes
   - Automatic redirection based on registration status
   - Public routes remain accessible

## 📊 Data Structure

### User Document (Firestore)
```typescript
{
  uid: string;
  email?: string;
  phoneNumber?: string;
  userType: 'employer' | 'agency' | 'individual_helper';
  isRegistrationComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Profile data (when registration complete)
  employerProfile?: EmployerProfile;
  agencyProfile?: AgencyProfile;
  individualHelperProfile?: IndividualHelperProfile;
}
```

## 🛣 API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in existing user
- `POST /api/auth/signout` - Sign out user

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Aesthetics**: Clean, professional interface
- **Loading States**: Proper loading indicators for all actions
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔮 Future Enhancements

The current implementation provides the authentication foundation. Future phases will include:

- **Registration Forms**: Detailed forms for each user type
- **AI Matching Engine**: TensorFlow.js integration for intelligent matching
- **Real Listings**: Actual job and helper listings with search/filter
- **Messaging System**: In-app communication between users
- **Reviews & Ratings**: User feedback system
- **Advanced Dashboard**: Analytics and insights

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add all environment variables from `.env.local` to your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review Firebase setup carefully
- Ensure all environment variables are correct
- Verify Firebase rules allow read/write access

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Connection Error**:
   - Verify environment variables
   - Check Firebase project settings
   - Ensure Firestore rules allow access

2. **Authentication Not Working**:
   - Verify Firebase Auth providers are enabled
   - Check API endpoint implementations
   - Review middleware configuration

3. **Build Errors**:
   - Ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify import paths are correct
