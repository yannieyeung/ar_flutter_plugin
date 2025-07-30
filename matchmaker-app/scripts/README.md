# Database Seeding Scripts

This directory contains scripts for seeding your matchmaker app database with sample data.

## Helper Seeding Script

### Overview
The `seedHelpers.js` script generates 10 realistic helper profiles with comprehensive data including:

- **Personal Information**: Name, date of birth, nationality, contact details
- **Experience & Skills**: Work history, relevant skills, specializations  
- **Medical Information**: Health conditions, allergies, dietary preferences
- **Work Preferences**: Availability, preferred family size, location preferences
- **ML Profile**: Skills vectors and personality traits for AI matching
- **Registration Status**: Complete profiles ready for matching

### Prerequisites

1. **Firebase Setup**: Ensure your Firebase Admin SDK is properly configured
2. **Environment Variables**: Set up your Firebase credentials in `.env.local` (see Firebase Admin setup)
3. **Dependencies**: The script requires the `uuid` and `dotenv` packages (already installed)

### Usage

#### Method 1: Direct Execution
```bash
# From the matchmaker-app directory
node scripts/seedHelpers.js
```

#### Method 2: Using npm script (recommended)
Add to your `package.json` scripts section:
```json
{
  "scripts": {
    "seed:helpers": "node scripts/seedHelpers.js"
  }
}
```

Then run:
```bash
npm run seed:helpers
```

### Firebase Admin Configuration

The script automatically loads Firebase credentials from your `.env.local` file. You need these environment variables:

#### Required Environment Variables in `.env.local`
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

#### Getting Firebase Credentials
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values and add them to your `.env.local` file

**Note**: The private key should include the `\n` characters for line breaks, and the entire key should be wrapped in quotes.

### Generated Data

Each helper profile includes:

**Personal Details:**
- Full name (culturally appropriate for nationality)
- Date of birth (age 21-50)
- Nationality from 10 Southeast Asian countries
- Contact information and addresses
- Physical characteristics and family details

**Professional Information:**
- 0-15 years of experience
- 3-8 relevant skills from a comprehensive list
- Detailed work history with responsibilities
- Specializations and certifications

**Health & Preferences:**
- Medical history and allergies (realistic distribution)
- Dietary restrictions and food handling preferences
- Work schedule and location preferences
- Interview availability and readiness status

**AI Matching Data:**
- Skills vectors for machine learning
- Experience level categorization
- Personality traits and work preferences
- Compatibility scoring data

### Sample Output

```
🌱 Starting to seed helpers data...
✅ Generated helper 1: Maria Santos from Philippines
✅ Generated helper 2: Sari Dewi from Indonesia
✅ Generated helper 3: Thida Aung from Myanmar
...

🎉 Successfully seeded 10 helpers to the database!

📋 Summary of created helpers:
1. Maria Santos (Philippines) - 5 years experience
2. Sari Dewi (Indonesia) - 0 years experience
3. Thida Aung (Myanmar) - 12 years experience
...

💡 You can now view these helpers in your app dashboard.
```

### Database Structure

Helpers are stored in the `users` collection with:
- Document ID: Generated UUID
- UserType: `individual_helper`
- All profile fields as defined in your registration forms
- Timestamps for creation and updates
- ML profile data for AI matching

### Troubleshooting

**Authentication Errors:**
- Verify Firebase credentials are properly configured
- Check that your service account has Firestore write permissions
- Ensure the Firebase project ID is correct

**Permission Errors:**
- Verify your Firebase rules allow writes to the `users` collection
- Check that the service account has the necessary IAM roles

**Module Not Found:**
- Run `npm install` to ensure all dependencies are installed
- Verify you're running the script from the correct directory

### Customization

You can modify the script to:
- Change the number of helpers generated (modify the loop in `seedHelpers()`)
- Add additional countries or cities to the sample data
- Adjust the probability distributions for various attributes
- Include additional fields specific to your app's requirements

### Related Scripts

- `migrateYearsInBusiness.js`: Migration script for updating existing agency data
- Future scripts for seeding employers and agencies can follow similar patterns

### Security Notes

- Never commit service account keys to version control
- Use environment variables for sensitive configuration
- Consider using Firebase Admin SDK with minimal required permissions
- The generated email addresses use `@example.com` domain to avoid conflicts