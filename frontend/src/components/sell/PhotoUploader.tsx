import { Camera, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { MAX_PHOTOS } from './listingDraft';

interface PhotoUploaderProps {
  photos: File[];
  onChange: (photos: File[]) => void;
}

const PhotoUploader = ({ photos, onChange }: PhotoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => photos.map((file) => URL.createObjectURL(file)),
    [photos],
  );

  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    onChange([...photos, ...images].slice(0, MAX_PHOTOS));
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
      }}
      className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center sm:px-6 sm:py-10 light:border-black/15"
    >
      <Camera size={22} className="text-neutral-500" strokeWidth={1.5} />
      <p className="font-display text-sm text-neutral-300 light:text-neutral-700">
        Add photos of your car
      </p>
      <p className="text-xs text-neutral-500">
        Drag files here or click to upload ({photos.length}/{MAX_PHOTOS})
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {previews.map((url, index) => (
          <div
            key={url}
            className="group relative h-20 w-24 overflow-hidden rounded-lg border border-white/10 light:border-black/10"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => onChange(photos.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/70 text-white lg:hidden lg:group-hover:flex"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            aria-label="Add photos"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-24 items-center justify-center rounded-lg border border-dashed border-white/15 text-neutral-500 transition-colors hover:border-white/30 light:border-black/15 light:hover:border-black/30"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default PhotoUploader;
