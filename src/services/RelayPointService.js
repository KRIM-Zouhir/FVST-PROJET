class RelayPointService {
  constructor() {
    this.categories = [
      'post_office',
      'convenience',
      'supermarket',
      'marketplace',
      'shop',
      'tobacco'
    ];
  }

  // Search for potential relay points near a location
  async searchRelayPoints(lat, lon, radius = 2000) {
    try {
      // Use Overpass API to find suitable locations
      const query = `
        [out:json][timeout:25];
        (
          way(around:${radius},${lat},${lon})[shop];
          node(around:${radius},${lat},${lon})[shop];
          way(around:${radius},${lat},${lon})[amenity=post_office];
          node(around:${radius},${lat},${lon})[amenity=post_office];
          way(around:${radius},${lat},${lon})[shop=convenience];
          node(around:${radius},${lat},${lon})[shop=convenience];
          way(around:${radius},${lat},${lon})[shop=tobacco];
          node(around:${radius},${lat},${lon})[shop=tobacco];
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();
      
      // Format the results
      const points = data.elements
        .filter(element => element.tags && (
          element.tags.shop ||
          element.tags.amenity === 'post_office'
        ))
        .map(element => ({
          id: element.id,
          type: element.type,
          lat: element.lat,
          lon: element.lon,
          name: element.tags.name || 'Point Relais',
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}, ${element.tags['addr:postcode'] || ''} ${element.tags['addr:city'] || ''}`
            : 'Adresse non disponible',
          type: this.getLocationType(element.tags),
          openingHours: element.tags.opening_hours || 'Horaires non disponibles',
          isAvailable: true // You can add more complex availability logic here
        }));

      return points;
    } catch (error) {
      console.error('Error fetching relay points:', error);
      return [];
    }
  }

  // Get the type of location based on its tags
  getLocationType(tags) {
    if (tags.amenity === 'post_office') return 'Bureau de poste';
    if (tags.shop === 'convenience') return 'Supérette';
    if (tags.shop === 'supermarket') return 'Supermarché';
    if (tags.shop === 'tobacco') return 'Bureau de tabac';
    return 'Commerce';
  }

  // Get details about a specific relay point
  async getRelayPointDetails(id, type) {
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];${type}(${id});out body;>;out skel qt;`
      );
      const data = await response.json();
      
      if (data.elements && data.elements[0]) {
        const element = data.elements[0];
        return {
          id: element.id,
          type: element.type,
          lat: element.lat,
          lon: element.lon,
          name: element.tags.name || 'Point Relais',
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}, ${element.tags['addr:postcode'] || ''} ${element.tags['addr:city'] || ''}`
            : 'Adresse non disponible',
          type: this.getLocationType(element.tags),
          openingHours: element.tags.opening_hours || 'Horaires non disponibles',
          phone: element.tags.phone || element.tags['contact:phone'] || 'Non disponible',
          website: element.tags.website || element.tags['contact:website'] || null,
          isAvailable: true
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching relay point details:', error);
      return null;
    }
  }

  // Check if a location is suitable to be a relay point
  isSuitableRelayPoint(tags) {
    return (
      tags.amenity === 'post_office' ||
      tags.shop === 'convenience' ||
      tags.shop === 'supermarket' ||
      tags.shop === 'tobacco' ||
      (tags.shop && tags.opening_hours) // Any shop with defined opening hours
    );
  }
}

export const relayPointService = new RelayPointService();
export default RelayPointService; 