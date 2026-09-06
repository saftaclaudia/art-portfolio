import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/useAuth";

const MEDIUM_ORDER = ["watercolor", "digital", "acrylic"];
const MEDIUM_LABELS = {
  watercolor: "Watercolor",
  digital: "Digital",
  acrylic: "Acrylic",
};

function SortableArtworkCard({ artwork, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      <div className="relative bg-sand flex items-center justify-center h-64">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="max-w-full max-h-full object-contain"
        />

        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-ink/60 hover:text-coral hover:shadow-lg cursor-grab active:cursor-grabbing transition-all touch-none"
        >
          <GripVertical size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-display font-medium text-ink mb-1">
          {artwork.title}
        </h3>
        <p className="text-xs uppercase tracking-wide text-sage font-medium mb-1">
          {artwork.price ? `$${artwork.price}` : "No price"}
          {artwork.dimensions ? ` · ${artwork.dimensions}` : ""}
          {!artwork.in_stock ? " · Sold" : ""}
        </p>
        {artwork.print_options?.length > 0 && (
          <p className="text-xs text-ink/50 mb-2">
            {artwork.print_options.length} print option
            {artwork.print_options.length > 1 ? "s" : ""}
          </p>
        )}

        <div className="mt-auto pt-3 flex justify-between items-center border-t border-blush/60">
          <Link
            to={`/admin/edit/${artwork.id}`}
            className="text-sm text-ink/60 hover:text-coral transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(artwork.id, artwork.title)}
            className="text-sm text-clay hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { logout } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("medium", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error) setArtworks(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id, title) {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (!error) {
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    }
  }

  async function handleDragEnd(mediumKey, event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const group = artworks
      .filter((a) => a.medium === mediumKey)
      .sort((a, b) => a.sort_order - b.sort_order);

    const oldIndex = group.findIndex((a) => a.id === active.id);
    const newIndex = group.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(group, oldIndex, newIndex);

    const updates = reordered.map((artwork, index) => ({
      id: artwork.id,
      sort_order: index,
    }));

    // Update local state immediately, so the UI feels instant
    setArtworks((prev) =>
      prev.map((a) => {
        const match = updates.find((u) => u.id === a.id);
        return match ? { ...a, sort_order: match.sort_order } : a;
      }),
    );

    // Persist the new order to Supabase
    for (const u of updates) {
      await supabase
        .from("artworks")
        .update({ sort_order: u.sort_order })
        .eq("id", u.id);
    }
  }

  const grouped = artworks.reduce((acc, artwork) => {
    const key = artwork.medium || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(artwork);
    return acc;
  }, {});

  const mediumsToShow = [
    ...MEDIUM_ORDER.filter((m) => grouped[m]?.length),
    ...Object.keys(grouped).filter((m) => !MEDIUM_ORDER.includes(m)),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-display font-medium text-ink">
          Admin Panel
        </h1>
        <div className="flex gap-3">
          <Link
            to="/admin/new"
            className="bg-coral text-white px-5 py-2.5 rounded-full font-medium hover:bg-clay transition-colors text-sm"
          >
            + Add Artwork
          </Link>
          <button
            onClick={logout}
            className="text-ink/60 hover:text-clay transition-colors text-sm"
          >
            Log Out
          </button>
        </div>
      </div>

      {loading && <p className="text-ink/60">Loading...</p>}

      {!loading && artworks.length === 0 && (
        <p className="text-ink/60">No artworks yet.</p>
      )}

      {!loading &&
        mediumsToShow.map((mediumKey) => {
          const group = grouped[mediumKey].sort(
            (a, b) => a.sort_order - b.sort_order,
          );

          return (
            <div key={mediumKey} className="mb-14">
              <h2 className="text-lg font-display font-medium text-ink mb-5 pb-2 border-b border-blush">
                {MEDIUM_LABELS[mediumKey] || mediumKey} ({group.length})
              </h2>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(mediumKey, event)}
              >
                <SortableContext
                  items={group.map((a) => a.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.map((artwork) => (
                      <SortableArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}
    </div>
  );
}
