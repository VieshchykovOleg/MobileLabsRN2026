import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Firebase user об'єкт
  const [profile, setProfile] = useState(null);   // Дані профілю з Firestore
  const [loading, setLoading] = useState(true);   // Очікування ініціалізації Firebase

  // Підписка на зміну стану авторизації Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Отримання профілю з Firestore
  const fetchProfile = async (uid) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('fetchProfile error:', error);
    }
  };

  // Реєстрація нового користувача
  const register = async (email, password, name) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = credential.user.uid;

      // Створення документа у Firestore (колекція users, document id = uid)
      const userDoc = {
        uid,
        name: name || '',
        email,
        age: '',
        city: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', uid), userDoc);
      setProfile(userDoc);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Вхід існуючого користувача
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Вихід
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Оновлення профілю у Firestore
  const updateProfile = async (data) => {
    if (!user) return { success: false, error: 'Не авторизовано' };
    try {
      const ref = doc(db, 'users', user.uid); // uid перевірка на клієнті
      const updated = { ...data, updatedAt: serverTimestamp() };
      await updateDoc(ref, updated);
      setProfile((prev) => ({ ...prev, ...updated }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Відновлення паролю через email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Повторна автентифікація (потрібна перед видаленням)
  const reauthenticate = async (password) => {
    if (!user) return { success: false, error: 'Не авторизовано' };
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Видалення акаунта (з повторною автентифікацією)
  const deleteAccount = async (password) => {
    if (!user) return { success: false, error: 'Не авторизовано' };
    try {
      // Повторна автентифікація перед видаленням
      const reauth = await reauthenticate(password);
      if (!reauth.success) return reauth;

      // Видалення документа з Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Видалення акаунта Firebase Auth
      await deleteUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };
  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'Цей email вже використовується',
      'auth/invalid-email': 'Невірний формат email',
      'auth/weak-password': 'Пароль надто слабкий (мінімум 6 символів)',
      'auth/user-not-found': 'Користувача з таким email не знайдено',
      'auth/wrong-password': 'Невірний пароль',
      'auth/invalid-credential': 'Невірний email або пароль',
      'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше',
      'auth/network-request-failed': 'Помилка мережі. Перевірте підключення',
      'auth/requires-recent-login': 'Потрібна повторна автентифікація',
    };
    return messages[code] || 'Виникла помилка. Спробуйте ще раз.';
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        resetPassword,
        deleteAccount,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
