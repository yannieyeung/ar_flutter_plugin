/**
 * Utility functions for data transformations
 */

/**
 * Converts old years in business format to new readable format
 * @param {string} oldValue - The old format value (e.g., "1_to_3")
 * @returns {string} - The new readable format (e.g., "1-3 years")
 */
export const convertYearsInBusiness = (oldValue) => {
  if (!oldValue) return '';
  
  const conversions = {
    'less_than_1': 'Less than 1 year',
    '1_to_3': '1-3 years',
    '4_to_7': '4-7 years',
    '8_to_15': '8-15 years',
    'more_than_15': 'More than 15 years'
  };
  
  return conversions[oldValue] || oldValue;
};

/**
 * Converts new readable format back to old format (if needed for compatibility)
 * @param {string} newValue - The new readable format (e.g., "1-3 years")
 * @returns {string} - The old format (e.g., "1_to_3")
 */
export const convertYearsInBusinessToOldFormat = (newValue) => {
  if (!newValue) return '';
  
  const conversions = {
    'Less than 1 year': 'less_than_1',
    '1-3 years': '1_to_3',
    '4-7 years': '4_to_7',
    '8-15 years': '8_to_15',
    'More than 15 years': 'more_than_15'
  };
  
  return conversions[newValue] || newValue;
};

/**
 * Migrates agency data from old format to new format
 * @param {Object} agencyData - The agency data object
 * @returns {Object} - The migrated agency data
 */
export const migrateAgencyData = (agencyData) => {
  if (!agencyData) return agencyData;
  
  return {
    ...agencyData,
    yearsInBusiness: convertYearsInBusiness(agencyData.yearsInBusiness)
  };
};