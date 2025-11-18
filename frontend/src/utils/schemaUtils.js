/**
 * Generates JSON-LD structured data for job postings
 * @param {Object} job 
 * @param {string} baseUrl 
 * @returns {Object} 
 */
export const generateJobPostingSchema = (job, baseUrl) => {
  if (!job) return null;

  const hiringOrganization = {
    "@type": "Organization",
    "name": job.company?.name || "Your Company",
    "sameAs": job.company?.website || baseUrl,
    "logo": job.company?.logo || `${baseUrl}/logo.png`
  };

  const jobLocation = job.location ? {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": job.location.address || "",
      "addressLocality": job.location.city || "",
      "addressRegion": job.location.state || "",
      "postalCode": job.location.postalCode || "",
      "addressCountry": job.location.country || "IN"
    }
  } : null;

  const baseSalary = job.salaryMin || job.salaryMax ? {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": job.salaryMin || 0,
      "maxValue": job.salaryMax || 0,
      "unitText": "YEAR"
    }
  } : null;

  const employmentTypeMap = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'internship': 'INTERN'
  };

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.createdAt || new Date().toISOString(),
    "validThrough": job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "hiringOrganization": hiringOrganization,
    ...(jobLocation && { "jobLocation": jobLocation }),
    "employmentType": employmentTypeMap[job.jobType?.toLowerCase()] || 'FULL_TIME',
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company?.name || "Your Company",
      "value": job._id
    },
    ...(job.remoteWork && { "jobLocationType": "TELECOMMUTE" }),
    ...(baseSalary && { "baseSalary": baseSalary })
  };
};

/**
 * Adds JSON-LD script to the document head
 * @param {Object} job - The job object
 * @param {string} baseUrl - The base URL of the website
 */
export const addJobPostingSchema = (job, baseUrl) => {

  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  const schema = generateJobPostingSchema(job, baseUrl);
  if (!schema) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};
