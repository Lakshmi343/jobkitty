// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const JOB_API_END_POINT = `${API_BASE_URL}/jobs`;

// Other constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

// Job related constants
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
export const EXPERIENCE_LEVELS = ["Internship", "Entry Level", "Mid Level", "Senior Level", "Lead"];
export const JOB_STATUS = ["Draft", "Published", "Closed", "Archived"];
