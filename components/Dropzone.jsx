"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function Dropzone() {
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setStatus("Uploading...");
    setFiles(acceptedFiles.map((f) => Object.assign(f, {
      preview: URL.createObjectURL(f)
    })));

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";

    try {
      for (const file of acceptedFiles) {
        const path = `photos/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        });
        if (error) throw error;
      }
      setStatus("Upload terminé ✅");
    } catch (e) {
      console.error(e);
      setStatus("Erreur d’upload ❌");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": []
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={styles.dropzone}
        data-active={isDragActive ? "true" : "false"}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Dépose les fichiers…</p>
        ) : (
          <p>Glisse-dépose tes photos ici, ou clique pour sélectionner</p>
        )}
      </div>

      {status && <p className={styles.status}>{status}</p>}

      {files.length > 0 && (
        <div className={styles.previewGrid}>
          {files.map((file) => (
            <figure key={file.name} className={styles.previewItem}>
              <img src={file.preview} alt={file.name} />
              <figcaption>{file.name}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
