/**
 * Generates JSON-LD structured data for Google Jobs
 * @param {Object} job - The job object containing job details
 * @param {string} baseUrl - The base URL of your website (e.g., 'https://yourdomain.com')
 * @returns {Object} JSON-LD structured data object
 */
export const generateJobPostingStructuredData = (job, baseUrl) => {
  if (!job) return null;
  
  const hiringOrganization = {
    "@type": "Organization",
    "name": job.postedBy?.companyName || "Your Company Name",
    "sameAs": job.postedBy?.website || `${baseUrl}`,
    "logo": job.postedBy?.logo || `${baseUrl}/logo.png`
  };

  const jobLocation = {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": job.location?.address || "",
      "addressLocality": job.location?.city || "",
      "addressRegion": job.location?.state || "",
      "postalCode": job.location?.postalCode || "",
      "addressCountry": job.location?.country || "IN"
    }
  };

  // Format salary if available
  let baseSalary;
  if (job.salaryMin || job.salaryMax) {
    baseSalary = {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin || 0,
        "maxValue": job.salaryMax || 0,
        "unitText": "YEAR"
      }
    };
  }

  // Format date to ISO format
  const datePosted = job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString();
  const validThrough = job.deadline 
    ? new Date(job.deadline).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default to 30 days from now

  // Map job type to Google's employment types
  const employmentTypeMap = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'internship': 'INTERN',
    'temporary': 'TEMPORARY',
    'volunteer': 'VOLUNTEER',
    'permanent': 'PERMANENT',
    'freelance': 'CONTRACTOR'
  };

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": datePosted,
    "validThrough": validThrough,
    "hiringOrganization": hiringOrganization,
    "jobLocation": jobLocation,
    "employmentType": employmentTypeMap[job.jobType?.toLowerCase()] || 'FULL_TIME',
    "identifier": {
      "@type": "PropertyValue",
      "name": job.postedBy?.companyName || "Your Company Name",
      "value": job._id
    },
    "jobLocationType": job.remoteWork ? 'TELECOMMUTE' : undefined,
    "applicantLocationRequirements": job.remoteWork 
      ? {
          "@type": "Country",
          "name": job.location?.country || "IN"
        }
      : undefined,
    "responsibilities": job.requirements?.join(" ") || "",
    "qualifications": job.requirements?.join(" ") || "",
    "experienceRequirements": {
      "@type": "OccupationalExperienceRequirements",
      "monthsOfExperience": job.experienceMin 
        ? job.experienceMin * 12 
        : 0
    },
    "incentiveCompensation": job.benefits?.join(", ") || "",
    "workHours": job.workHours || "Full-time",
    "baseSalary": baseSalary
  };

  // Remove undefined fields
  Object.keys(structuredData).forEach(key => 
    structuredData[key] === undefined && delete structuredData[key]
  );

  return structuredData;
};

/**
 * Adds JSON-LD script to the document head
 * @param {Object} job - The job object
 * @param {string} baseUrl - The base URL of your website
 */
export const addJobPostingStructuredData = (job, baseUrl) => {
  // Remove any existing job posting schema
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  const structuredData = generateJobPostingStructuredData(job, baseUrl);
  if (!structuredData) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData, null, 2);
  document.head.appendChild(script);
};
