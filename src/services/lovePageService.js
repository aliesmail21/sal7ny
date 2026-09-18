import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

// =========================
// Create LovePage
// =========================

export async function createLovePage(
  name,
  message,
  images = [],
  songUrl = "",
) {
  try {
    const lovePage = {
      name,
      message,
      images,
      songUrl,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "lovePages"),
      lovePage,
    );

    return docRef.id;
  } catch (error) {
    console.error("Firebase createLovePage error:", error);

    if (error.code === "permission-denied") {
      throw new Error(
        "You don't have permission to create this LovePage.",
      );
    }

    if (
      error.code === "unavailable" ||
      error.code === "deadline-exceeded"
    ) {
      throw new Error(
        "Firebase is temporarily unavailable. Please try again.",
      );
    }

    if (
      error.code === "failed-precondition" ||
      error.code === "invalid-argument"
    ) {
      throw new Error(
        "Some LovePage information is invalid. Please check your data.",
      );
    }

    throw new Error(
      "Could not create your LovePage. Please try again.",
    );
  }
}

// =========================
// Get LovePage
// =========================

export async function getLovePageById(pageId) {
  try {
    if (!pageId) {
      return null;
    }

    const docRef = doc(db, "lovePages", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Firebase getLovePageById error:", error);

    if (error.code === "permission-denied") {
      throw new Error(
        "You don't have permission to view this LovePage.",
      );
    }

    if (
      error.code === "unavailable" ||
      error.code === "deadline-exceeded"
    ) {
      throw new Error(
        "Could not connect to Firebase. Please check your internet connection.",
      );
    }

    throw new Error(
      "Could not load this LovePage. Please try again.",
    );
  }
}