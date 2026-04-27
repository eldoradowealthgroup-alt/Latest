// Session Storage Auth Utilities
// Data is automatically cleared when browser tab/window is closed

export const AUTH_KEY = 'citation_user';
export const USERS_KEY = 'citation_users';
export const PROFILE_KEY = 'citation_profile';

// Get current logged in user
export const getCurrentUser = () => {
  const data = sessionStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Get all registered users (for login validation)
export const getUsers = () => {
  const data = sessionStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Register a new user
export const registerUser = (email, password) => {
  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // Demo only — not hashed
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Auto login after registration
  const { password: _pw, ...safe } = newUser;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(safe));
  return safe;
};

// Login user
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) throw new Error('Invalid email or password');

  const { password: _pw, ...safe } = user;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(safe));
  return safe;
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
};

// Get profile of currently logged-in user
export const getProfile = () => {
  const data = sessionStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

// Save / update profile
export const saveProfile = (profile) => {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
};
