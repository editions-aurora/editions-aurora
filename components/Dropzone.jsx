"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function Dropzone() {
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);

  // Cleanup des object URLs
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setStatus("Uploading...");
    setFiles(
      acceptedFiles.map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }))
    );

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";
    // debug: afficher la config visible côté client
    console.log("DEBUG env bucket:", bucket);
    console.log("DEBUG supabase url:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MISSING");
    console.log("DEBUG supabase anon key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    try {
      for (const file of acceptedFiles) {
        const path = `photos/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

        // --- Upload
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        // Log complet pour débug
        console.log("uploadData:", uploadData);
        if (uploadError) {
          console.error("Supabase uploadError:", uploadError);
          // Affiche message utile à l'utilisateur
          setStatus(`Erreur d'upload Supabase : ${uploadError.message || JSON.stringify(uploadError)}`);
          // On stoppe la boucle (ou continue selon souhait)
          throw uploadError;
        }

        // --- Récupérer l'URL publique
        const { data: publicData, error: publicError } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);

        if (publicError) {
          console.warn("getPublicUrl error:", publicError);
        }
        let publicURL = publicData?.publicUrl;
        console.log("publicUrl:", publicURL);

        // --- Si pas d'URL publique (ex: bucket privé), créer une signed URL temporaire
        if (!publicURL) {
          const { data: signedData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60); // validité 60s
          if (signedError) {
            console.warn("createSignedUrl error:", signedError);
          } else {
            publicURL = signedData?.signedUrl;
            console.log("signedUrl:", publicURL);
          }
        }

        const uploadedPhoto = { id: uploadData?.path || path, publicURL };

        // --- Appeler le webhook N8N
        try {

          console.log("Payload envoyé à N8N :", {
            photo_id: uploadedPhoto.id,
            photo_url: uploadedPhoto.publicURL
          });

          const res = await fetch("https://n8n.wild-studio.fr/webhook/categorize-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              photo_id: uploadedPhoto.id,
              photo_url: uploadedPhoto.publicURL,
            }),
          });

          console.log("Réponse fetch :", res);

          if (!res.ok) {
            const text = await res.text();
            console.error("N8N webhook error:", res.status, text);
            // continue malgré l'erreur webhook mais signale-la
            setStatus(`Upload OK mais webhook non reçu (${res.status})`);
          } else {
            console.log("Webhook N8N déclenché pour :", uploadedPhoto.id);
          }
        } catch (err) {
          console.error("Erreur en appelant N8N:", err);
          setStatus("Upload OK mais erreur envoi webhook (voir console)");
        }
      }

      setStatus("Upload terminé ✅ (analyse en cours sur N8N)");
    } catch (e) {
      console.error("Erreur catch globale upload:", e);
      if (!status || status.includes("Upload")) {
        setStatus("Erreur d’upload ❌ (voir console)");
      }
    }
  }, [files]);

  // Gestion des fichiers rejetés (taille / type / maxFiles)
  const onDropRejected = useCallback((rejectedFiles) => {
    console.warn("Files rejected:", rejectedFiles);
    setStatus(`Fichier(s) rejeté(s) : ${rejectedFiles.map(r => r.file.name).join(", ")}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: true,
    accept: { "image/*": [] },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={styles.dropzone}
        data-active={isDragActive ? "true" : "false"}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Dépose les fichiers…</p> : <p>Glisse-dépose tes photos ici, ou clique pour sélectionner</p>}
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
