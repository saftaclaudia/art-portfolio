import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const MEDIUMS = ["watercolor", "acrylic", "digital"];
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function AdminArtworkForm() {
  const { id } = useParams(); //undefined= adding new, present = editig
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    medium: "watercolor",
    price: "",
    artist: "",
    in_stock: true,
    dimensions: "",
  });

  const [printOptions, setPrintOptions] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function fetchArtwork() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setForm({
          title: data.title,
          description: data.description || "",
          medium: data.medium || "watercolor",
          price: data.price || "",
          artist: data.artist || "",
          in_stoc: data.in_stock,
          dimensions: data.dimensions || "",
        });

        setPrintOptions(data.print_options || []);
        setExistingImageUrl(data.image_url || "");
      }
      setLoading(false);
    }

    fetchArtwork();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePrintOptionChange = (index, field, value) => {
    const updated = [...printOptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrintOptions(updated);
  };

  const addPrintOption = () => {
    if (printOptions.length >= 3) return;
    setPrintOptions([...printOptions, { size: "", price: "" }]);
  };

  const removePrintOption = (index) => {
    setPrintOptions(printOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let imageUrl = existingImageUrl;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${slugify(form.title)}-${Date.now()}.${fileExt}`;

      const { error: uploadedError } = await supabase.storage
        .from("artworks")
        .upload(fileName, imageFile);

      if (uploadedError) {
        setError("Image upload failed:" + uploadedError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("artworks")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }
    if (!imageUrl) {
      setError("Please upload an image");
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      medium: form.medium,
      price: form.price ? Number(form.price) : null,
      artist: form.artist,
      in_stock: form.in_stock,
      image_url: imageUrl,
      slug: slugify(form.title),
      dimensions: form.dimensions,
      print_options: printOptions
        .filter((p) => p.size && p.price)
        .map((p) => ({ size: p.size, price: Number(p.price) })),
    };

    const { error: saveError } = isEditing
      ? await supabase.from("artworks").update(payload).eq("id", id)
      : await supabase.from("artworks").insert(payload);

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center text-ink/60">
        Loading...
      </div>
    );
  }
  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-display font-medium text-ink mb-8">
        {isEditing ? "Edit Artwork" : "Add New Artwork"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />

        <select
          name="medium"
          value={form.medium}
          onChange={handleChange}
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        >
          {MEDIUMS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (optional)"
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />

        <input
          name="artist"
          type="text"
          value={form.artist}
          onChange={handleChange}
          placeholder="Artist (optional)"
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />

        <input
          name="dimensions"
          type="text"
          value={form.dimensions}
          onChange={handleChange}
          placeholder="Original sixe (e.g 30 X 40 cm"
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-ink/70">
              Print options (up to 3){" "}
            </label>
            {printOptions.length < 3 && (
              <button
                type="button"
                onClick={addPrintOption}
                className="text-sm text-coral hover:text-clay transition-colors"
              >
                + Add option
              </button>
            )}
          </div>
          {printOptions.map((option, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={option.size ?? ""}
                onChange={(e) =>
                  handlePrintOptionChange(index, "size", e.target.value)
                }
                placeholder="Size (e.g. A4)"
                className="flex-1 rounded-xl border border-blush bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50"
              />
              <input
                type="text"
                value={option.price ?? ""}
                onChange={(e) =>
                  handlePrintOptionChange(index, "price", e.target.value)
                }
                placeholder="Price"
                className="w-28 rounded-xl border border-blush bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50"
              />
              <button
                type="button"
                onClick={() => removePrintOption(index)}
                aria-label="Remove print option"
                className="text-ink/40 hover:text-clay transition-colors px-2"
              >
                {" "}
                x
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            name="in_stock"
            type="checkbox"
            checked={form.in_stock}
            onChange={handleChange}
          />
          In stock (available for purchase)
        </label>

        <div>
          <label className="block text-sm text-ink/70 mb-2">
            {isEditing ? "Replace image (optional)" : "Image"}
          </label>
          {existingImageUrl && !imageFile && (
            <img
              src={existingImageUrl}
              alt="Current"
              className="w-24 h-24 object-cover rounded-xl mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required={!isEditing}
            className="w-full text-sm text-ink/70"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Artwork"}
        </button>
        {error && <p className="text-clay text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
