import { useState, useCallback, useEffect } from "react";
import { Filter, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import FilterPanel, { FilterState } from "@/components/FilterPanel";

export default function LiveMap() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [showLights, setShowLights] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    status: null,
    startDate: null,
    endDate: null,
  });

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [lightMarkers, setLightMarkers] = useState<google.maps.Marker[]>([]);

  // Fetch reports
  const { data: reports, isLoading: reportsLoading } =
    trpc.reports.withFilters.useQuery({
      category: filters.category || undefined,
      status: filters.status || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      limit: 100,
    });

  // Fetch street lights
  const { data: streetLights, isLoading: lightsLoading } =
    trpc.streetLights.list.useQuery();

  // Handle map ready
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  // Update report markers
  useEffect(() => {
    if (!mapInstance || !reports) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];
    const bounds = new google.maps.LatLngBounds();

    reports.forEach((report) => {
      const lat = parseFloat(report.latitude.toString());
      const lng = parseFloat(report.longitude.toString());

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: report.title,
        icon: getMarkerIcon(report.status),
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-sm mb-1">${report.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${report.description || "No description"}</p>
            <div class="flex gap-2 mb-2">
              <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">${report.category}</span>
              <span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">${report.status}</span>
            </div>
            <p class="text-xs text-gray-500">📍 ${report.ward || "Unknown location"}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
      bounds.extend({ lat, lng });
    });

    if (newMarkers.length > 0) {
      mapInstance.fitBounds(bounds);
    }

    setMarkers(newMarkers);
  }, [mapInstance, reports]);

  // Update street light markers
  useEffect(() => {
    if (!mapInstance || !streetLights || !showLights) {
      lightMarkers.forEach((marker) => marker.setMap(null));
      setLightMarkers([]);
      return;
    }

    // Clear existing light markers
    lightMarkers.forEach((marker) => marker.setMap(null));
    setLightMarkers([]);

    const newLightMarkers: google.maps.Marker[] = [];

    streetLights.forEach((light) => {
      const lat = parseFloat(light.latitude.toString());
      const lng = parseFloat(light.longitude.toString());

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: `Street Light - ${light.status}`,
        icon: getLightMarkerIcon(light.status),
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <p class="text-sm font-bold">Street Light</p>
            <p class="text-xs">Status: <span class="font-semibold">${light.status}</span></p>
            <p class="text-xs">Ward: ${light.ward || "Unknown"}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });

      newLightMarkers.push(marker);
    });

    setLightMarkers(newLightMarkers);
  }, [mapInstance, streetLights, showLights]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Map</h1>
          <p className="text-muted-foreground">
            Real-time view of civic reports and street infrastructure
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterOpen(true)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>

        <Button
          variant={showLights ? "default" : "outline"}
          size="sm"
          onClick={() => setShowLights(!showLights)}
          className="gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Street Lights
        </Button>

        <div className="flex-1 text-right text-sm text-muted-foreground">
          {reports && (
            <span>
              {reports.length} report{reports.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 h-[600px] bg-white/5">
        <MapView onMapReady={handleMapReady} />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md rounded-lg border border-white/10 p-4 max-w-xs">
          <h3 className="font-semibold text-sm mb-3">Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Open Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Street Lights</span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {(reportsLoading || lightsLoading) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-white text-sm">Loading...</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-cyan-400">{reports?.length || 0}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Street Lights</p>
          <p className="text-2xl font-bold text-yellow-400">{streetLights?.length || 0}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Active Issues</p>
          <p className="text-2xl font-bold text-orange-400">
            {reports?.filter((r) => r.status === "open").length || 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-400">
            {reports?.filter((r) => r.status === "resolved").length || 0}
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

function getMarkerIcon(status: string): string {
  const baseIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23";
  const colors: Record<string, string> = {
    open: "3B82F6",
    "in-progress": "FBBF24",
    resolved: "10B981",
    closed: "6B7280",
  };
  const color = colors[status] || "3B7FBF";
  return `${baseIcon}${color}' /%3E%3C/svg%3E`;
}

function getLightMarkerIcon(status: string): string {
  const baseIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23";
  const colors: Record<string, string> = {
    on: "FBBF24",
    off: "6B7280",
    faulty: "EF4444",
  };
  const color = colors[status] || "FBBF24";
  return `${baseIcon}${color}' /%3E%3C/svg%3E`;
}
