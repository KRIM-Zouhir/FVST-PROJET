// Base pricing configuration
const DEFAULT_PRICING_CONFIG = {
  // Base distance pricing
  basePrice: 2.50, // Minimum base price for intra-city
  pricePerKm: 0.015, // Price per kilometer (reduced for competitive pricing)
  minPrice: 2.50, // Minimum price for any delivery
  maxPrice: 25.00, // Maximum price cap
  
  // Weight tiers
  weightTiers: {
    tier1: { max: 2, price: 0 }, // 0-2 kg included in base price
    tier2: { max: 5, price: 2 }, // 2-5 kg: +€2
    tier3: { max: 10, price: 4 }, // 5-10 kg: +€4
    maxWeight: 10 // Maximum weight in kg
  },
  
  // City zones for special pricing
  cityZones: {
    intraCityDistance: 10, // km threshold for intra-city pricing
    intraCityPrice: 2.50, // Base price for intra-city deliveries
    popularRoutes: {
      'Lille-Paris': 5.50,
      'Paris-Lyon': 8.00,
      'Paris-Marseille': 12.00
    }
  },
  
  // Commission structure
  commission: {
    platformFee: 0.20, // 20% platform fee
    travelerShare: 0.80 // 80% goes to traveler
  },
  
  // Time multipliers (reduced to keep prices competitive)
  timeMultipliers: {
    rushHour: 1.10, // 10% increase during rush hours
    weekend: 1.05, // 5% increase during weekends
    night: 1.15 // 15% increase during night time
  }
};

class PricingService {
  constructor(config = DEFAULT_PRICING_CONFIG) {
    this.config = config;
  }

  // Calculate weight-based price addition
  calculateWeightPrice(weightInKg) {
    const { weightTiers } = this.config;
    
    if (weightInKg <= weightTiers.tier1.max) {
      return 0;
    } else if (weightInKg <= weightTiers.tier2.max) {
      return weightTiers.tier2.price;
    } else if (weightInKg <= weightTiers.tier3.max) {
      return weightTiers.tier3.price;
    }
    return null; // For weights above maxWeight, return null to indicate custom pricing needed
  }

  // Check if route is a popular predefined route
  checkPopularRoute(departure, destination) {
    const route = `${departure}-${destination}`;
    const reverseRoute = `${destination}-${departure}`;
    return this.config.cityZones.popularRoutes[route] || this.config.cityZones.popularRoutes[reverseRoute];
  }

  // Calculate base delivery price
  calculateBasePrice(distanceInKm, departure, destination) {
    // Check for popular routes first
    const popularRoutePrice = this.checkPopularRoute(departure, destination);
    if (popularRoutePrice) {
      return popularRoutePrice;
    }

    // Check for intra-city delivery
    if (distanceInKm <= this.config.cityZones.intraCityDistance) {
      return this.config.cityZones.intraCityPrice;
    }

    // Calculate distance-based price
    const distancePrice = this.config.basePrice + (distanceInKm * this.config.pricePerKm);
    return Math.max(this.config.minPrice, Math.min(distancePrice, this.config.maxPrice));
  }

  // Calculate total price with all factors
  calculateTotalPrice(distanceInKm, weightInKg = 0, departure = '', destination = '') {
    // Check if weight is within limits
    if (weightInKg > this.config.weightTiers.maxWeight) {
      return {
        error: 'Custom pricing needed for packages over 10kg',
        requiresCustomQuote: true
      };
    }

    const basePrice = this.calculateBasePrice(distanceInKm, departure, destination);
    const weightPrice = this.calculateWeightPrice(weightInKg);
    
    // Get time multipliers
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 19);
    const isWeekend = currentDay === 0 || currentDay === 6;
    const isNightTime = currentHour >= 22 || currentHour <= 5;

    // Calculate multiplier
    let timeMultiplier = 1;
    if (isRushHour) timeMultiplier = this.config.timeMultipliers.rushHour;
    if (isWeekend) timeMultiplier = this.config.timeMultipliers.weekend;
    if (isNightTime) timeMultiplier = this.config.timeMultipliers.night;

    // Calculate final prices
    const subtotal = (basePrice + (weightPrice || 0)) * timeMultiplier;
    const platformFee = subtotal * this.config.commission.platformFee;
    const travelerPayout = subtotal * this.config.commission.travelerShare;

    return {
      basePrice: basePrice,
      weightPrice: weightPrice || 0,
      timeMultiplier: timeMultiplier,
      subtotal: subtotal,
      platformFee: platformFee,
      travelerPayout: travelerPayout,
      total: subtotal,
      details: {
        isRushHour,
        isWeekend,
        isNightTime,
        distancePrice: distanceInKm * this.config.pricePerKm,
        weightTier: this.getWeightTier(weightInKg),
        estimatedDeliveryTime: this.calculateEstimatedDeliveryTime(distanceInKm),
        isPopularRoute: !!this.checkPopularRoute(departure, destination),
        isIntraCity: distanceInKm <= this.config.cityZones.intraCityDistance
      }
    };
  }

  // Get weight tier description
  getWeightTier(weightInKg) {
    if (weightInKg <= this.config.weightTiers.tier1.max) {
      return 'Standard (0-2kg)';
    } else if (weightInKg <= this.config.weightTiers.tier2.max) {
      return 'Medium (2-5kg)';
    } else if (weightInKg <= this.config.weightTiers.tier3.max) {
      return 'Large (5-10kg)';
    }
    return 'Custom pricing required';
  }

  // Calculate estimated delivery time
  calculateEstimatedDeliveryTime(distanceInKm) {
    const now = new Date();
    const processingTime = 1; // 1 hour for processing
    const averageSpeed = 60; // 60 km/h average speed
    const travelHours = distanceInKm / averageSpeed;
    const totalHours = processingTime + travelHours;
    
    const deliveryDate = new Date(now.getTime() + (totalHours * 60 * 60 * 1000));
    return deliveryDate;
  }

  // Calculate platform fee
  calculatePlatformFee(basePrice) {
    return (basePrice * this.config.commission.platformFee) / 100;
  }

  // Calculate driver earnings
  calculateDriverEarnings(totalPrice, platformFee) {
    return totalPrice - platformFee;
  }

  // Utility methods
  isRushHour(time = new Date()) {
    const hour = time.getHours();
    return (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
  }

  isWeekend(time = new Date()) {
    return [0, 6].includes(time.getDay());
  }

  isNightTime(time = new Date()) {
    const hour = time.getHours();
    return hour >= 22 || hour < 6;
  }

  // Update pricing configuration (for admin use)
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const pricingService = new PricingService();
export default PricingService; 