import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

interface LocationInputProps {
  onAnalyze: (lat: number, lng: number) => void;
}

const LocationInput = ({ onAnalyze }: LocationInputProps) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Coordinates out of range");
      return;
    }
    
    onAnalyze(lat, lng);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast.success("Location detected");
      },
      (error) => {
        toast.error("Failed to get location");
      }
    );
  };

  return (
    <Card className="p-6 bg-card border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">Enter Location</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Enter a location anywhere on Earth to analyze climate-related risk factors.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="text"
              placeholder="e.g., 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="text"
              placeholder="e.g., -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 gap-2">
            <Search className="h-4 w-4" />
            Analyze Risk
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={useCurrentLocation}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Use My Location
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LocationInput;
