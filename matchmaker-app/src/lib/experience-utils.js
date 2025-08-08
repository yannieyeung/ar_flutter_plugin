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

// Helper function to get total experience across all skills
export function getTotalExperienceYears(experience) {
  if (!experience) return 0;
  
  let maxYears = 0;
  const experienceCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
  
  experienceCategories.forEach(category => {
    if (experience[category]?.hasExperience && experience[category]?.startYear) {
      const years = calculateExperienceYears(
        experience[category].startYear,
        experience[category].endYear
      );
      maxYears = Math.max(maxYears, years);
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
      const years = calculateExperienceYears(categoryData.startYear, categoryData.endYear);
      maxYears = Math.max(maxYears, years);
      
      structuredData.skillsExperience[category] = {
        hasExperience: true,
        yearsOfExperience: years,
        experienceLevel: categoryData.experienceLevel || 'beginner',
        startYear: categoryData.startYear,
        endYear: categoryData.endYear,
        isCurrent: !categoryData.endYear,
        specificTasks: categoryData.specificTasks || [],
        taskCount: (categoryData.specificTasks || []).length
      };

      // Add to active skills list
      structuredData.activeSkills.push(category);

      // Add to timeline
      structuredData.experienceTimeline.push({
        skill: category,
        startYear: categoryData.startYear,
        endYear: categoryData.endYear || new Date().getFullYear(),
        years: years,
        level: categoryData.experienceLevel
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