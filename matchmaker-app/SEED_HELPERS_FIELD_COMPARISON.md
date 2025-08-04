# Seed Helpers Field Comparison & Update

## 📊 Field Comparison Analysis

### ✅ Fields Already Present in Seed Script
- `userType: 'individual_helper'`
- `fullName`, `name`
- `dateOfBirth`
- `nationality`, `countryOfBirth`, `cityOfBirth`
- `religion`
- `height`, `weight`
- `educationLevel`
- `numberOfSiblings`
- `maritalStatus`
- `numberOfChildren`
- `residentialAddress`
- `repatriationPort`
- `contactNumber`
- `hasBeenHelperBefore`
- `experience` (basic structure)
- `relevantSkills`
- `hasAllergies`, `allergiesDetails`
- `hasPastIllness`, `illnessDetails`
- `hasPhysicalDisabilities`, `disabilityDetails`
- `foodHandlingPreferences`
- `requiredOffDays`
- `preferences` (basic structure)
- `interview`
- `readiness`
- `otherRemarks`
- `mlProfile`

### ❌ Missing Fields in Seed Script

#### 1. **Detailed Experience Structure**
The registration form has a much more detailed experience structure:
- `experience.careOfInfant.hasExperience`
- `experience.careOfInfant.experienceLevel`
- `experience.careOfInfant.yearsFrom`, `yearsTo`
- `experience.careOfInfant.specificTasks`
- `experience.careOfChildren.*` (same structure)
- `experience.careOfDisabled.*` (same structure)
- `experience.careOfOldAge.*` (same structure)
- `experience.generalHousework.*` (same structure)
- `experience.cooking.*` (same structure)
- `experience.cooking.cuisines`
- `experience.languagesSpoken` (array with language, proficiency, canTeach)
- `experience.otherSkills`

#### 2. **Detailed Preferences Structure**
- `preferences.careOfInfant.willing`, `importance`, `maxNumber`, `preferredAges`
- `preferences.careOfChildren.*` (same structure)
- `preferences.careOfDisabled.*` (with preferredTypes)
- `preferences.careOfOldAge.*` (with specialties)
- `preferences.generalHousework.*` (with preferredHouseSizes)
- `preferences.cooking.*` (with preferredCuisines)
- `preferences.workEnvironment.liveInPreference`
- `preferences.workEnvironment.petFriendly`
- `preferences.location.preferredCountries`

#### 3. **Salary Expectations**
- `expectations.salary.minimumAmount`
- `expectations.salary.preferredAmount`
- `expectations.salary.negotiable`
- `expectations.salary.performanceBonusExpected`

#### 4. **Enhanced Readiness Fields**
- `readiness.passportExpiry`
- `readiness.canStartWork` (with specific options)
- `readiness.startDate`
- `readiness.visaStatus`

#### 5. **Enhanced Interview Fields**
- `interview.availability`
- `interview.availabilityDate`
- `interview.means`

#### 6. **Additional Fields**
- `languagesSpoken` (for new helpers)
- `otherMedicalRemarks`
- `disabilitiesDetails` (instead of `disabilityDetails`)

### 🔧 Structural Differences

1. **Food Handling**: Form uses array format, seed uses object
2. **Experience**: Form has detailed breakdown by category, seed has simplified structure
3. **Preferences**: Form has complex nested structure with importance levels
4. **ML Profile**: Seed has basic version, form generates comprehensive profile

## 📝 Recommendations

1. **Update seed script** to match the registration form structure exactly
2. **Maintain backward compatibility** for existing data
3. **Generate realistic data** for all new fields
4. **Test thoroughly** to ensure seeded data works with the application

---

## 🚀 Action Items

- [ ] Update `generateHelperData()` function
- [ ] Add missing field generators
- [ ] Update ML profile generation
- [ ] Test with actual registration flow
- [ ] Verify data consistency across the application