# Firestore Setup Guide

## Required Indexes

If you encounter the error "The query requires an index", you need to set up the following Firestore indexes:

### 1. Job Postings Index

For queries on the `job_postings` collection, you need these composite indexes:

#### Index 1: employerId + status + createdAt
- Collection: `job_postings`
- Fields:
  - `employerId` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

#### Index 2: employerId + createdAt
- Collection: `job_postings`
- Fields:
  - `employerId` (Ascending)
  - `createdAt` (Descending)

#### Index 3: status + createdAt
- Collection: `job_postings`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

## How to Create Indexes

### Method 1: Automatic Creation
1. Run your application and perform the queries that trigger the error
2. Firebase will provide a direct link to create the required index
3. Click the link in the error message to automatically create the index

### Method 2: Manual Creation in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Fill in the details:
   - Collection ID: `job_postings`
   - Add the fields as specified above
   - Set the appropriate sort order (Ascending/Descending)
6. Click **Create**

### Method 3: Using Firebase CLI
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy indexes (if you have a firestore.indexes.json file)
firebase deploy --only firestore:indexes
```

## Sample firestore.indexes.json

You can also create a `firestore.indexes.json` file in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "job_postings",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "employerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "job_postings",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "employerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "job_postings",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

## Notes

- Indexes take a few minutes to build
- You only need to create indexes for the queries you actually use
- Single field indexes are created automatically
- Composite indexes (multiple fields) must be created manually
- The indexes are shared across all environments (development, staging, production)

## Troubleshooting

If you continue to have issues:
1. Check the Firebase Console → Firestore → Indexes tab to see if indexes are still building
2. Wait for all indexes to show "Enabled" status
3. Clear your browser cache and try again
4. Check the Firebase Console logs for any additional error messages