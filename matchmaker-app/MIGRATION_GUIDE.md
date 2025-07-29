# Years in Business Data Migration Guide

## Issue
The "Years in Business" field for agencies was storing values in an underscore format (e.g., `1_to_3`) instead of a readable format (e.g., `1-3 years`).

## Solution
I've updated the code to:
1. Store new data in readable format
2. Automatically convert old data when displaying profiles
3. Provide a migration script to update existing database records

## What's Changed

### 1. Registration Form (`src/components/agency-steps/AgencyBasicInfoStep.jsx`)
- Changed option values from `1_to_3` to `1-3 years`
- New registrations will now store readable values

### 2. Profile Display (`src/components/profile-sections/AgencyProfileSections.jsx`)
- Updated to display readable format
- Removed the `.replace('_', ' ')` transformation

### 3. Profile Data Loading (`src/app/profile/page.jsx`)
- Added automatic conversion of old data when loading profiles
- Uses `convertYearsInBusiness()` utility function

### 4. Utility Functions (`src/utils/dataTransformations.js`)
- `convertYearsInBusiness()` - Converts old format to new format
- `migrateAgencyData()` - Migrates entire agency data object

## Migration Options

### Option 1: Automatic Conversion (Recommended)
The profile page now automatically converts old data when displaying. No action needed - old data will display correctly.

### Option 2: Database Migration (Optional)
To permanently update the database records, run the migration script:

```bash
# Set up Firebase Admin credentials first
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"

# Run the migration
node scripts/migrateYearsInBusiness.js
```

## Data Conversion Mapping

| Old Format | New Format |
|------------|------------|
| `less_than_1` | `Less than 1 year` |
| `1_to_3` | `1-3 years` |
| `4_to_7` | `4-7 years` |
| `8_to_15` | `8-15 years` |
| `more_than_15` | `More than 15 years` |

## Testing
1. Check existing agency profiles - they should display readable text
2. Create a new agency registration - it should store readable values
3. Edit an existing agency profile - it should work seamlessly

The conversion is backward compatible and handles both old and new data formats.