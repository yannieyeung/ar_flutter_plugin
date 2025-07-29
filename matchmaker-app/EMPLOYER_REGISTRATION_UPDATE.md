# Employer Registration Form Update

## Overview
The employer registration form has been completely redesigned to be more suitable for individual employers, particularly housewives, rather than focusing on company information.

## Changes Made

### 1. New Multi-Step Registration Form
- Created `MultiStepEmployerRegistration.jsx` component
- Replaced the old single-page company-focused form
- Follows the same pattern as helper and agency registration forms

### 2. Three-Step Process

#### Step 1: Personal Information
- **Profile Picture Upload**: Optional profile picture using the existing PhotoUpload component
- **Full Name**: Required field for the employer's name
- **Email Address**: Required field with validation
- **Location**: Required field for household location (e.g., "Orchard, Singapore")

#### Step 2: Household Details
- **Household Size**: Dropdown selection (1 person to 6+ people)
- **Children Information**: 
  - Checkbox for "I have children at home"
  - If checked: Number of children and their ages
- **Pet Information**:
  - Checkbox for "I have pets at home"
  - If checked: Text area for pet details

#### Step 3: Introduction & Preferences
- **Self Introduction**: Optional text area for personal introduction
- **Preferred Languages**: Multi-select checkboxes for common languages in the region
- **Specific Requirements**: Optional text area for any special requirements

### 3. Updated Data Structure
The form now captures household-focused data instead of company information:

```javascript
{
  // Personal Information
  fullName: string,
  email: string,
  location: string,
  profilePicture: array,
  
  // Household Information
  householdSize: string,
  hasKids: boolean,
  numberOfKids: string,
  kidsAges: string,
  hasPets: boolean,
  petDetails: string,
  
  // Introduction and Preferences
  selfIntroduction: string,
  preferredLanguages: array,
  specificRequirements: string
}
```

### 4. Integration Updates
- Updated `registration/[userType]/page.jsx` to use the new form for employers
- Added `handleEmployerRegistration` function to process the new data structure
- Maintained compatibility with existing helper and agency registration flows

## Features

### User Experience
- **Progressive Disclosure**: Information is collected in logical steps
- **Conditional Fields**: Children and pet details only show when relevant
- **Validation**: Required fields are validated at each step
- **Profile Picture**: Easy drag-and-drop photo upload
- **Progress Indicator**: Visual progress bar showing current step

### Data Capture
- **Household-Focused**: Fields relevant to domestic helper matching
- **Personal Touch**: Self-introduction allows personal connection
- **Language Preferences**: Important for helper matching
- **Family Details**: Essential information for helper suitability

## Benefits

1. **More Relevant**: Fields are now appropriate for individual employers rather than companies
2. **Better Matching**: Captures information that helps with AI-powered helper matching
3. **User-Friendly**: Multi-step approach is less overwhelming
4. **Flexible**: Optional fields allow users to share as much or as little as they want
5. **Professional**: Maintains the same high-quality UI/UX as other registration forms

## Files Modified

1. **New File**: `src/components/MultiStepEmployerRegistration.jsx`
2. **Modified**: `src/app/registration/[userType]/page.jsx`

The old company-focused fields (companyName, companySize, industry) have been completely replaced with household-focused fields that are much more appropriate for the target users.