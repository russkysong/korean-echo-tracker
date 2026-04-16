'use client';

import { useEffect, useRef } from 'react';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import View from 'ol/View';
import 'ol/ol.css';

const PLACES: { lon: number; lat: number; label: string }[] = [
  { lon: 126.978, lat: 37.5665, label: 'Seoul — Korean mirror' },
  { lon: 6.1432, lat: 46.2044, label: 'Geneva — UN / WEF' },
  { lon: 7.5886, lat: 47.5596, label: 'Basel — BIS' },
  { lon: -73.968, lat: 40.7489, label: 'New York — UN HQ' },
];

/** World overview + markers — OpenLayers (OSGeo), not Leaflet. */
export function GlobalMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const features = PLACES.map(
      (p) =>
        new Feature({
          geometry: new Point(fromLonLat([p.lon, p.lat])),
          label: p.label,
        })
    );

    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const label = String(feature.get('label') ?? '');
        return new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: 'rgba(16, 185, 129, 0.92)' }),
            stroke: new Stroke({ color: '#022c22', width: 2 }),
          }),
          text: new Text({
            text: label,
            offsetY: -14,
            font: '600 11px ui-sans-serif, system-ui, sans-serif',
            fill: new Fill({ color: '#fafafa' }),
            stroke: new Stroke({ color: '#18181b', width: 3 }),
          }),
        });
      },
    });

    const map = new Map({
      target: el,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([20, 20]),
        zoom: 2,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl h-[480px]">
      <div ref={ref} className="h-full w-full" />
    </div>
  );
}
