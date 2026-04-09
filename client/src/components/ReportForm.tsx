import { useState, useRef } from "react";
import { MapPin, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  latitude?: number;
  longitude?: number;
}

const CATEGORIES = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "utilities", label: "Utilities" },
  { value: "environment", label: "Environment" },
  { value: "safety", label: "Safety" },
  { value: "sanitation", label: "Sanitation" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-300" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-300" },
  { value: "high", label: "High", color: "bg-orange-500/20 text-orange-300" },
  { value: "critical", label: "Critical", color: "bg-red-500/20 text-red-300" },
];

export default function ReportForm({
  onSuccess,
  onCancel,
  latitude,
  longitude,
}: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "infrastructure",
    priority: "medium",
    latitude: latitude || 0,
    longitude: longitude || 0,
    ward: "",
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createReportMutation = trpc.reports.create.useMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be less than 5MB");
        return;
      }
      setSelectedPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      toast.error("Please select a location on the map");
      return;
    }

    try {
      await createReportMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        latitude: formData.latitude,
        longitude: formData.longitude,
        ward: formData.ward,
      });

      toast.success("Report submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "infrastructure",
        priority: "medium",
        latitude: 0,
        longitude: 0,
        ward: "",
      });
      setSelectedPhoto(null);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Report Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Brief description of the issue"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide more details about the issue..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Priority *
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
          >
            {PRIORITIES.map((pri) => (
              <option key={pri.value} value={pri.value}>
                {pri.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="Latitude"
              step="0.00001"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="Longitude"
              step="0.00001"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
        {formData.latitude === 0 && formData.longitude === 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-orange-400">
            <AlertCircle className="w-4 h-4" />
            Click on the map to select a location
          </div>
        )}
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Ward (Optional)
        </label>
        <input
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleInputChange}
          placeholder="Ward or area name"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-cyan-500/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Photo (Optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-white/20 hover:border-cyan-500/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
        >
          {selectedPhoto ? (
            <span className="text-cyan-400">{selectedPhoto.name}</span>
          ) : (
            "Click to upload photo"
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={createReportMutation.isPending}
          className="flex-1"
        >
          {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}
