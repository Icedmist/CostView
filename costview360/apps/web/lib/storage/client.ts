import { createClient } from "@/lib/supabase/client";

export const STORAGE_BUCKET = "costview-media";

export type StorageFolder = "pictures" | "drawings" | "documents";

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

export interface StorageFileItem {
  name: string;
  id: string;
  createdAt: string;
  size: number;
  url: string;
  folder: StorageFolder;
}

/**
 * Uploads a file (picture, drawing, document) to the Supabase storage bucket.
 */
export async function uploadToStorage(
  file: File,
  folder: StorageFolder = "pictures",
  customName?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();
    const cleanFileName = (customName || file.name)
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { url: null, path: null, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err: any) {
    return {
      url: null,
      path: null,
      error: err?.message || "Failed to upload file to storage.",
    };
  }
}

/**
 * Lists files in a given storage folder.
 */
export async function listStorageFiles(
  folder: StorageFolder = "pictures"
): Promise<{ files: StorageFileItem[]; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit: 50,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { files: [], error: error.message };
    }

    const files: StorageFileItem[] = (data || [])
      .filter((item) => item.name !== ".emptyFolderPlaceholder")
      .map((item) => {
        const fullPath = `${folder}/${item.name}`;
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fullPath);

        return {
          name: item.name,
          id: item.id || item.name,
          createdAt: item.created_at || new Date().toISOString(),
          size: item.metadata?.size || 0,
          url: urlData.publicUrl,
          folder,
        };
      });

    return { files, error: null };
  } catch (err: any) {
    return { files: [], error: err?.message || "Failed to list files." };
  }
}

/**
 * Deletes a file from storage by its full path (e.g. 'pictures/123_photo.jpg').
 */
export async function deleteStorageFile(path: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete file." };
  }
}
