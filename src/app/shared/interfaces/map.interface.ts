import { TileLayer } from 'leaflet';

export interface GeoJSONData {
  geometry: {
    coordinates: number[] | number[][] | number[][][];
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
