
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/auth";
import { db } from "../firebase/db";

export function initUsers(){

    onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      /* =========================
         USER DOES NOT EXIST
      ========================= */

      if (!snap.exists()) {

        await setDoc(ref, {
          uid: user.uid,
          email: user.email || "",
          role: "user",   // ✅ DEFAULT ROLE
          createdAt: serverTimestamp()
        });

        console.log("✅ New user created with role: user");

      }

      /* =========================
         USER EXISTS BUT NO ROLE
      ========================= */

      else {

        const data = snap.data();

        if (!data.role) {

          await setDoc(ref, {
            ...data,
            role: "user"
          }, { merge: true });

          console.log("✅ Role auto-assigned");
        }

      }

    } catch (err) {

      console.error("User initialization failed:", err);

    }

  });

}
