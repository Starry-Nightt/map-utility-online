import { RoutingType } from '@shared/utilities/enums';
import { TileLayer } from 'leaflet';

export interface GeoJSONData {
  id?: string;
  userId?: string;
  geometry: {
    coordinates: any;
  };
  properties: any;
  type: string;
}

export class CustomTileLayer extends TileLayer {
  token: string;
  constructor(
    urlTemplate: string,
    token: string,
    options?: L.TileLayerOptions
  ) {
    super(urlTemplate, options);
    this.token = token;
  }

  override createTile(coords: L.Coords, done: () => void): HTMLImageElement {
    const url = this.getTileUrl(coords);
    const img = document.createElement('img');
    img.setAttribute('role', 'presentation');

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      mode: 'cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.readAsDataURL(blob);
        done();
      })
      .catch((error) => {
        console.error('Failed to fetch tile:', error);
        done();
      });

    return img;
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  id?: string;
  name: string;
  lat: number | string;
  lng: number | string;
  amenity?: string;
  houseName?: string;
  houseNumber?: string;
  place?: string;
}

export interface RoutingDetail {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  type: RoutingType;
}

export interface RoutingData {
  geo: {
    type: string;
    coordinates: number[][][];
  };
  distance: number;
}

export interface LayerBody {
  title?: string;
  description?: string;
  image?: string;
}
