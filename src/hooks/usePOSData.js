import { useState, useEffect, useCallback } from "react";
import { 
    doc, collection, onSnapshot, addDoc, updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export const usePOSData = () => {
    const [userId, setUserId] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                await signInAnonymously(auth);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Real-time Products Listener
    useEffect(() => {
        if (!userId) return;
        
        // Assuming you organize data by user. Change collection path as needed.
        const productRef = collection(db, 'products');

        const unsubProducts = onSnapshot(productRef, (snapshot) => {
            const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productList);
        }, (error) => console.error("Snapshot error:", error));

        return () => unsubProducts();
    }, [userId]);

    // 3. Save Sale Logic
    const saveSale = useCallback(async (saleData, lineItems) => {
        if (!userId) return false;
        const salesRef = collection(db, 'users', userId, 'sales');

        try {
            // A. Add Sale Record
            await addDoc(salesRef, {
                ...saleData,
                lineItems,
                timestamp: serverTimestamp(),
                userId,
            });

            // B. Update Inventory Stocks
            // Note: For production, use 'runTransaction' for safety, 
            // but simple promises work for small apps.
            const updates = lineItems.map(item => {
                const productRef = doc(db, 'users', userId, 'inventory', item.productId);
                return updateDoc(productRef, {
                    stock: item.stockAfter
                });
            });
            
            await Promise.all(updates);
            return true;
        } catch (e) {
            console.error("Error saving sale:", e);
            return false;
        }
    }, [userId]);

    return { products, isLoading, userId, saveSale };
};
