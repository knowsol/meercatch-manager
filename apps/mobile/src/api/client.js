const BASE_URL = 'http://192.168.0.200:4002';

let _token = null;

export function setToken(token) {
  _token = token;
}

export function getToken() {
  return _token;
}

async function request(method, path, body) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (_token) {
    headers['X-Device-Token'] = _token;
  }

  const options = { method, headers };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorText}`);
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
};

// Device
export const registerDevice = () => api.post('/devices/register');
export const getMyDevice = () => api.get('/devices/me');

// Installation
export const startInstallation = () => api.post('/installations/start');
export const selectMode = (mode) => api.post('/installations/select-mode', { mode });
export const completeInstallation = () => api.post('/installations/complete');

// Schools
export const getSchools = () => api.get('/managed/schools');
export const getGrades = (schoolId) => api.get(`/managed/schools/${schoolId}/grades`);
export const getClasses = (gradeId) => api.get(`/managed/grades/${gradeId}/classes`);

// Affiliations
export const createAffiliation = (body) => api.post('/managed/device-affiliations', body);
export const getMyAffiliation = () => api.get('/managed/device-affiliations/me');

// Detections
export const submitDetection = (body) => api.post('/detections', body);
export const getDetections = () => api.get('/detections?limit=100');
export const getDetection = (id) => api.get(`/detections/${id}`);
export const reportFalsePositive = (id, body) => api.post(`/detections/${id}/false-positive`, body);
