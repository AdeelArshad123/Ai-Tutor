import { User } from '../types';

const USER_KEY = 'stacktutor_user';

// In a real app, you'd have a user database. We'll simulate it here.
const getSimulatedUserDatabase = () => {
    const db = localStorage.getItem('stacktutor_user_db');
    return db ? JSON.parse(db) : {};
}

const saveSimulatedUserDatabase = (db: any) => {
    localStorage.setItem('stacktutor_user_db', JSON.stringify(db));
}

export const signupUser = (username: string, password_not_used: string): User | null => {
    const db = getSimulatedUserDatabase();
    if (db[username]) {
        return null; // User already exists
    }
    db[username] = { username }; // In a real app, you'd store a hashed password
    saveSimulatedUserDatabase(db);
    const user: User = { username };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}


export const loginUser = (username: string, password_not_used: string): User | null => {
    const db = getSimulatedUserDatabase();
    // In a real app, you'd check the password hash
    if (db[username]) {
        const user: User = { username };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    }
    return null; // User not found
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};