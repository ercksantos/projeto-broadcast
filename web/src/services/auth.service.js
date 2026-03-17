import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, } from 'firebase/auth';
import { auth } from '@/lib/firebase';
export const registerUser = async ({ email, password, displayName, }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential.user;
};
export const loginUser = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
};
export const logoutUser = () => signOut(auth);
