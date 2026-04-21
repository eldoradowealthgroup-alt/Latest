// Session Storage Auth Utilities
// Data is automatically cleared when browser tab/window is closed

export const AUTH_KEY = 'citation_user';
export const USERS_KEY = 'citation_users';

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
export const registerUser = (fullName, email, password) => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: Date.now().toString(),
    fullName,
    email,
    password, // In a real app, this would be hashed
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto login after registration
  const { password: _, ...userWithoutPassword } = newUser;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Login user
export const loginUser = (email, password) => {
  // Check for admin login
  if (email === 'admin' && password === 'Money2026$') {
    const adminUser = {
      id: 'admin',
      fullName: 'Administrator',
      email: 'admin',
      isAdmin: true
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  
  const users = getUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

// Update user profile
export const updateUserProfile = (updates) => {
  const user = getCurrentUser();
  if (!user) return null;
  
  const updatedUser = { ...user, ...updates };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
  
  return updatedUser;
};
