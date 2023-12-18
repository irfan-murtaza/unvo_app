import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "firebase/compat/storage";
import { app } from "../config/firebase";

export const uploadImage = async (uri ,filePathWithName) => {
  const img = await fetch(uri);
  const blob = await img.blob();
  // const date = Date.now().toString();
  // const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const fileRef = ref(app.storage(), filePathWithName);

  try {
    await uploadBytesResumable(fileRef, blob);

    blob.close();
    return await getDownloadURL(fileRef);
  } catch (e) {
    return false;
  }
};
