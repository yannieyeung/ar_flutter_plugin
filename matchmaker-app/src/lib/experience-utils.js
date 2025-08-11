/**
 * Utility functions for calculating and working with experience data
 * Used for both frontend forms and backend ML processing
 */

// Helper function to calculate years of experience from year ranges
export function calculateExperienceYears(startYear, endYear = null) {
  if (!startYear) return 0;
  const end = endYear || new Date().getFullYear();
  return Math.max(0, end - startYear + 1);
}

// Helper function to calculate total years from country experiences
export function calculateCountryExperienceYears(countryExperiences) {
  if (!Array.isArray(countryExperiences)) return 0;
  
  return countryExperiences.reduce((total, exp) => {
    if (exp.startYear) {
      const endYear = exp.endYear || new Date().getFullYear();
      return total + Math.max(0, endYear - exp.startYear + 1);
    }
    return total;
  }, 0);
}

// Helper function to get unique countries from country experiences
export function getUniqueCountries(countryExperiences) {
  if (!Array.isArray(countryExperiences)) return [];
  
  return [...new Set(countryExperiences
    .filter(exp => exp.country && exp.country.trim())
    .map(exp => exp.country.trim())
  )];
}

// Helper function to get total experience across all skills (updated for country experiences)
export function getTotalExperienceYears(experience) {
  if (!experience) return 0;
  
  let maxYears = 0;
  const experienceCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
  
  experienceCategories.forEach(category => {
    if (experience[category]?.hasExperience) {
      let categoryYears = 0;
      
      // Check for new country experiences structure
      if (experience[category]?.countryExperiences?.length > 0) {
        categoryYears = calculateCountryExperienceYears(experience[category].countryExperiences);
      }
      // Fall back to legacy single experience structure
      else if (experience[category]?.startYear) {
        categoryYears = calculateExperienceYears(
          experience[category].startYear,
          experience[category].endYear
        );
      }
      
      maxYears = Math.max(maxYears, categoryYears);
    }
  });
  
  return maxYears;
}

// Helper function to structure experience data for ML/TensorFlow
export function getStructuredExperienceForML(experience) {
  if (!experience) return {
    totalExperienceYears: 0,
    skillsExperience: {},
    skillsCompetency: {},
    activeSkills: [],
    experienceTimeline: []
  };
  
  const experienceCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
  const structuredData = {
    totalExperienceYears: 0,
    skillsExperience: {},
    skillsCompetency: {},
    activeSkills: [],
    experienceTimeline: []
  };

  let maxYears = 0;

  experienceCategories.forEach(category => {
    if (experience[category]?.hasExperience) {
      const categoryData = experience[category];
      let totalYears = 0;
      let countries = [];
      let experiences = [];
      
      // Handle new country experiences structure
      if (categoryData.countryExperiences?.length > 0) {
        totalYears = calculateCountryExperienceYears(categoryData.countryExperiences);
        countries = getUniqueCountries(categoryData.countryExperiences);
        
        // Process each country experience
        categoryData.countryExperiences.forEach(countryExp => {
          if (countryExp.startYear) {
            const years = calculateExperienceYears(countryExp.startYear, countryExp.endYear);
            experiences.push({
              startYear: countryExp.startYear,
              endYear: countryExp.endYear,
              years: years,
              country: countryExp.country || 'Unknown',
              isCurrent: !countryExp.endYear
            });
          }
        });
      }
      // Fall back to legacy single experience structure
      else if (categoryData.startYear) {
        totalYears = calculateExperienceYears(categoryData.startYear, categoryData.endYear);
        experiences.push({
          startYear: categoryData.startYear,
          endYear: categoryData.endYear,
          years: totalYears,
          country: 'Unknown',
          isCurrent: !categoryData.endYear
        });
      }
      
      maxYears = Math.max(maxYears, totalYears);
      
      structuredData.skillsExperience[category] = {
        hasExperience: true,
        yearsOfExperience: totalYears,
        experienceLevel: categoryData.experienceLevel || 'beginner',
        countries: countries,
        countryCount: countries.length,
        experiences: experiences,
        specificTasks: categoryData.specificTasks || [],
        taskCount: (categoryData.specificTasks || []).length,
        // Maintain backward compatibility
        startYear: experiences[0]?.startYear,
        endYear: experiences.find(exp => exp.isCurrent)?.endYear || experiences[experiences.length - 1]?.endYear,
        isCurrent: experiences.some(exp => exp.isCurrent)
      };

      // Add to active skills list
      structuredData.activeSkills.push(category);

      // Add each experience to timeline
      experiences.forEach(exp => {
        structuredData.experienceTimeline.push({
          skill: category,
          startYear: exp.startYear,
          endYear: exp.endYear || new Date().getFullYear(),
          years: exp.years,
          country: exp.country,
          level: categoryData.experienceLevel || 'beginner'
        });
      });

      // Calculate competency score (for ML features)
      let competencyScore = 0;
      switch (categoryData.experienceLevel) {
        case 'expert': competencyScore = 1.0; break;
        case 'advanced': competencyScore = 0.8; break;
        case 'intermediate': competencyScore = 0.6; break;
        case 'beginner': competencyScore = 0.4; break;
        default: competencyScore = 0.2;
      }
      
      // Adjust based on years of experience
      const experienceMultiplier = Math.min(years / 5, 1); // Cap at 5 years for max score
      structuredData.skillsCompetency[category] = competencyScore * (0.5 + 0.5 * experienceMultiplier);
    } else {
      structuredData.skillsExperience[category] = {
        hasExperience: false,
        yearsOfExperience: 0
      };
      structuredData.skillsCompetency[category] = 0;
    }
  });

  structuredData.totalExperienceYears = maxYears;
  return structuredData;
}

// Helper function to format experience for display
export function formatExperienceDisplay(experience) {
  if (!experience) return 'No experience data';
  
  const mlData = getStructuredExperienceForML(experience);
  const activeSkills = mlData.activeSkills;
  
  if (activeSkills.length === 0) return 'No experience recorded';
  
  const skillLabels = {
    careOfInfant: 'Infant Care',
    careOfChildren: 'Child Care', 
    careOfDisabled: 'Disability Care',
    careOfOldAge: 'Elderly Care',
    generalHousework: 'Housework',
    cooking: 'Cooking'
  };
  
  return activeSkills.map(skill => {
    const skillData = mlData.skillsExperience[skill];
    return `${skillLabels[skill]} (${skillData.yearsOfExperience} years, ${skillData.experienceLevel})`;
  }).join(', ');
}

// Helper function to validate experience data
export function validateExperienceData(experience) {
  const errors = [];
  const currentYear = new Date().getFullYear();
  
  if (!experience) return errors;
  
  const experienceCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
  
  experienceCategories.forEach(category => {
    if (experience[category]?.hasExperience) {
      const categoryData = experience[category];
      
      // Validate start year
      if (!categoryData.startYear) {
        errors.push(`${category}: Start year is required`);
      } else if (categoryData.startYear < 1990 || categoryData.startYear > currentYear) {
        errors.push(`${category}: Start year must be between 1990 and ${currentYear}`);
      }
      
      // Validate end year if provided
      if (categoryData.endYear) {
        if (categoryData.endYear < categoryData.startYear) {
          errors.push(`${category}: End year cannot be before start year`);
        }
        if (categoryData.endYear > currentYear) {
          errors.push(`${category}: End year cannot be in the future`);
        }
      }
      
      // Validate experience level
      if (!categoryData.experienceLevel || !['beginner', 'intermediate', 'advanced', 'expert'].includes(categoryData.experienceLevel)) {
        errors.push(`${category}: Valid experience level is required`);
      }
    }
  });
  
  return errors;
}

// Helper function to migrate old experience format to new format
export function migrateExperienceFormat(oldExperience) {
  if (!oldExperience) return {};
  
  const newExperience = {};
  const currentYear = new Date().getFullYear();
  
  // Handle old yearsFrom/yearsTo format
  Object.keys(oldExperience).forEach(category => {
    if (oldExperience[category]?.hasExperience) {
      const oldData = oldExperience[category];
      
      // Convert old years-based format to year-based format
      if (oldData.yearsFrom !== undefined && oldData.yearsTo !== undefined) {
        const yearsFrom = parseInt(oldData.yearsFrom) || 0;
        const yearsTo = parseInt(oldData.yearsTo) || 0;
        
        newExperience[category] = {
          ...oldData,
          startYear: Math.max(1990, currentYear - yearsTo),
          endYear: yearsFrom > 0 ? currentYear - yearsFrom : null
        };
        
        // Remove old fields
        delete newExperience[category].yearsFrom;
        delete newExperience[category].yearsTo;
      } else {
        // Already in new format or missing year data
        newExperience[category] = oldData;
      }
    }
  });
  
  return newExperience;
}

// Helper function to generate experience timeline for visualization
export function generateExperienceTimeline(experience) {
  const timeline = [];
  const mlData = getStructuredExperienceForML(experience);
  
  mlData.experienceTimeline.forEach(item => {
    timeline.push({
      skill: item.skill,
      label: item.skill.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase()),
      startYear: item.startYear,
      endYear: item.endYear,
      duration: item.years,
      level: item.level,
      isCurrent: item.endYear === new Date().getFullYear() && !experience[item.skill]?.endYear
    });
  });
  
  // Sort by start year
  timeline.sort((a, b) => a.startYear - b.startYear);
  
  return timeline;
}