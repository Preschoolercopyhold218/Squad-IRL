// ═══════════════════════════════════════════════════════════════════════════
// Travel Planner — Multi-Agent Tokyo Trip Optimizer
// 5 days · 2 travelers · $4,000 budget
// ═══════════════════════════════════════════════════════════════════════════

// ── ANSI helpers ────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
};

function clr(c: string, t: string): string {
  return `${c}${t}${C.reset}`;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Types ───────────────────────────────────────────────────────────────────

interface Coord {
  lat: number;
  lon: number;
}

interface Landmark extends Coord {
  name: string;
  emoji: string;
}

interface Flight {
  name: string;
  price: number;
  durationMin: number;
  stops: number;
}

interface Hotel {
  name: string;
  pricePerNight: number;
  rating: number;
  location: string;
  area: string;
  vibe: string;
  coord: Coord;
}

interface Activity {
  name: string;
  landmark: string;
  costPP: number;
  hours: number;
  opensAt: number;
  closesAt: number;
  category: string;
  emoji: string;
  area: string;
  localTip: string;
  coord: Coord;
}

interface DayPlan {
  day: number;
  label: string;
  activities: ScheduledActivity[];
  totalCost: number;
  totalDistKm: number;
}

interface ScheduledActivity extends Activity {
  startTime: number;
  endTime: number;
  travelKm: number;
  travelMin: number;
}

interface BudgetLine {
  label: string;
  emoji: string;
  amount: number;
}

interface WeatherForecast {
  day: number;
  summary: string;
  highC: number;
  lowC: number;
  chanceRain: number;
  note: string;
}

interface RestaurantPick {
  name: string;
  area: string;
  cuisine: string;
  price: string;
  note: string;
}

interface RestaurantSet {
  breakfast: RestaurantPick;
  lunch: RestaurantPick;
  dinner: RestaurantPick;
  snack: RestaurantPick;
}

// ── Data ────────────────────────────────────────────────────────────────────

const LANDMARKS: Landmark[] = [
  { name: "Shibuya Crossing", lat: 35.6595, lon: 139.7004, emoji: "🚶" },
  { name: "Senso-ji Temple", lat: 35.7148, lon: 139.7967, emoji: "⛩️" },
  { name: "Tokyo Tower", lat: 35.6586, lon: 139.7454, emoji: "🗼" },
  { name: "Akihabara", lat: 35.7023, lon: 139.7745, emoji: "🎮" },
  { name: "Meiji Shrine", lat: 35.6764, lon: 139.6993, emoji: "⛩️" },
  { name: "Tsukiji Outer Market", lat: 35.6654, lon: 139.7707, emoji: "🐟" },
  { name: "Shinjuku Gyoen", lat: 35.6852, lon: 139.71, emoji: "🌸" },
  { name: "teamLab Borderless", lat: 35.6267, lon: 139.7839, emoji: "🎨" },
  { name: "Imperial Palace", lat: 35.6852, lon: 139.7528, emoji: "🏯" },
  { name: "Harajuku/Takeshita St", lat: 35.6702, lon: 139.7026, emoji: "🛍️" },
  { name: "Ueno Park", lat: 35.7146, lon: 139.7732, emoji: "🌳" },
  { name: "Odaiba", lat: 35.6267, lon: 139.775, emoji: "🎡" },
  { name: "Roppongi Hills", lat: 35.6605, lon: 139.7292, emoji: "🌃" },
  { name: "Nakameguro", lat: 35.6441, lon: 139.6988, emoji: "🌿" },
  { name: "Tokyo Skytree", lat: 35.7101, lon: 139.8107, emoji: "📡" },
];

const FLIGHTS: Flight[] = [
  { name: "Economy Direct LAX→NRT", price: 850, durationMin: 690, stops: 0 },
  { name: "Economy 1-Stop via SEA", price: 720, durationMin: 945, stops: 1 },
  { name: "Premium Economy Direct", price: 1100, durationMin: 690, stops: 0 },
  { name: "Economy 1-Stop via HNL", price: 680, durationMin: 1100, stops: 1 },
  { name: "Budget Carrier Direct", price: 790, durationMin: 735, stops: 0 },
];

const HOTELS: Hotel[] = [
  {
    name: "Shinjuku Granbell",
    pricePerNight: 145,
    rating: 4.2,
    location: "Kabukicho, 8 min walk to Shinjuku station",
    area: "Shinjuku",
    vibe: "Neon-lit nightlife, late-night eats, and easy JR access",
    coord: { lat: 35.6897, lon: 139.7005 },
  },
  {
    name: "Hotel Gracery Shinjuku",
    pricePerNight: 165,
    rating: 4.4,
    location: "Kabukicho gateway with skyline views",
    area: "Shinjuku",
    vibe: "Big-city buzz with a short walk to commuter lines",
    coord: { lat: 35.6944, lon: 139.7013 },
  },
  {
    name: "Shibuya Stream Excel",
    pricePerNight: 185,
    rating: 4.5,
    location: "Connected to Shibuya Station",
    area: "Shibuya",
    vibe: "Youthful, energetic, and walkable to shopping + nightlife",
    coord: { lat: 35.6585, lon: 139.7025 },
  },
  {
    name: "Asakusa View Hotel",
    pricePerNight: 125,
    rating: 4.0,
    location: "Next to Senso-ji and Sumida River",
    area: "Asakusa",
    vibe: "Old Tokyo charm with temple streets and riverside strolls",
    coord: { lat: 35.7126, lon: 139.7946 },
  },
  {
    name: "Hilton Tokyo",
    pricePerNight: 220,
    rating: 4.3,
    location: "Shinjuku skyscraper district",
    area: "Shinjuku",
    vibe: "Polished business hub with skyline views and quiet nights",
    coord: { lat: 35.6932, lon: 139.6917 },
  },
  {
    name: "Tokyu Stay Shinjuku",
    pricePerNight: 110,
    rating: 3.9,
    location: "Shinjuku-sanchome, close to metro lines",
    area: "Shinjuku",
    vibe: "Compact, practical, and ideal for budget-minded explorers",
    coord: { lat: 35.6905, lon: 139.6978 },
  },
];

const ACTIVITIES: Activity[] = [
  {
    name: "Senso-ji Morning Visit",
    landmark: "Senso-ji Temple",
    costPP: 0,
    hours: 1.5,
    opensAt: 6,
    closesAt: 17,
    category: "culture",
    emoji: "⛩️",
    area: "Asakusa",
    localTip: "Arrive before 9 AM for quiet courtyards and lantern photos.",
    coord: { lat: 35.7148, lon: 139.7967 },
  },
  {
    name: "Meiji Shrine Forest Walk",
    landmark: "Meiji Shrine",
    costPP: 0,
    hours: 1.5,
    opensAt: 5,
    closesAt: 18,
    category: "culture",
    emoji: "⛩️",
    area: "Harajuku",
    localTip: "Enter via the south torii for the most peaceful cedar path.",
    coord: { lat: 35.6764, lon: 139.6993 },
  },
  {
    name: "Shibuya Crossing & Hachiko",
    landmark: "Shibuya Crossing",
    costPP: 0,
    hours: 1,
    opensAt: 0,
    closesAt: 24,
    category: "culture",
    emoji: "🚶",
    area: "Shibuya",
    localTip: "Catch the scramble from Shibuya Scramble Square just before sunset.",
    coord: { lat: 35.6595, lon: 139.7004 },
  },
  {
    name: "Tsukiji Market Breakfast Stroll",
    landmark: "Tsukiji Outer Market",
    costPP: 35,
    hours: 2,
    opensAt: 5,
    closesAt: 14,
    category: "food",
    emoji: "🐟",
    area: "Tsukiji",
    localTip: "Go before 8:30 AM for the freshest tuna stalls and fewer queues.",
    coord: { lat: 35.6654, lon: 139.7707 },
  },
  {
    name: "Tokyo Tower Observatory",
    landmark: "Tokyo Tower",
    costPP: 12,
    hours: 1.5,
    opensAt: 9,
    closesAt: 23,
    category: "culture",
    emoji: "🗼",
    area: "Minato",
    localTip: "The clearest skyline views are right after lunch before haze builds.",
    coord: { lat: 35.6586, lon: 139.7454 },
  },
  {
    name: "Akihabara Retro Game Hunt",
    landmark: "Akihabara",
    costPP: 20,
    hours: 2.5,
    opensAt: 10,
    closesAt: 21,
    category: "technology",
    emoji: "🎮",
    area: "Akihabara",
    localTip: "Radio Kaikan upper floors hide the best vintage consoles.",
    coord: { lat: 35.7023, lon: 139.7745 },
  },
  {
    name: "teamLab Borderless (Azabudai)",
    landmark: "teamLab Borderless",
    costPP: 25,
    hours: 2.5,
    opensAt: 10,
    closesAt: 19,
    category: "technology",
    emoji: "🎨",
    area: "Roppongi",
    localTip: "Book the first slot to get the most immersive rooms to yourselves.",
    coord: { lat: 35.6649, lon: 139.7397 },
  },
  {
    name: "Imperial Palace East Gardens",
    landmark: "Imperial Palace",
    costPP: 0,
    hours: 1.5,
    opensAt: 9,
    closesAt: 17,
    category: "nature",
    emoji: "🏯",
    area: "Marunouchi",
    localTip: "Check closure days in advance; mornings are coolest and quietest.",
    coord: { lat: 35.6852, lon: 139.7528 },
  },
  {
    name: "Harajuku Takeshita & Cat Street",
    landmark: "Harajuku/Takeshita St",
    costPP: 15,
    hours: 2,
    opensAt: 10,
    closesAt: 20,
    category: "culture",
    emoji: "🛍️",
    area: "Harajuku",
    localTip: "Visit before noon to beat the school crowd and long crepe lines.",
    coord: { lat: 35.6702, lon: 139.7026 },
  },
  {
    name: "Shinjuku Gyoen Garden",
    landmark: "Shinjuku Gyoen",
    costPP: 3,
    hours: 2,
    opensAt: 9,
    closesAt: 18,
    category: "nature",
    emoji: "🌸",
    area: "Shinjuku",
    localTip: "Grab tickets at the west gate; it moves faster mid-morning.",
    coord: { lat: 35.6852, lon: 139.71 },
  },
  {
    name: "Ueno Park & National Museum",
    landmark: "Ueno Park",
    costPP: 10,
    hours: 2.5,
    opensAt: 9,
    closesAt: 17,
    category: "culture",
    emoji: "🌳",
    area: "Ueno",
    localTip: "Line up by 9:15 AM if you want the museum galleries first.",
    coord: { lat: 35.7146, lon: 139.7732 },
  },
  {
    name: "Odaiba Seaside + Gundam",
    landmark: "Odaiba",
    costPP: 0,
    hours: 2,
    opensAt: 0,
    closesAt: 24,
    category: "nature",
    emoji: "🎡",
    area: "Odaiba",
    localTip: "Sunset from Decks Tokyo Beach is unbeatable on clear days.",
    coord: { lat: 35.6267, lon: 139.775 },
  },
  {
    name: "Roppongi Hills Observatory",
    landmark: "Roppongi Hills",
    costPP: 18,
    hours: 2,
    opensAt: 10,
    closesAt: 22,
    category: "culture",
    emoji: "🌃",
    area: "Roppongi",
    localTip: "The city lights pop after 7 PM, so aim for a twilight visit.",
    coord: { lat: 35.6605, lon: 139.7292 },
  },
  {
    name: "Nakameguro Canal Stroll",
    landmark: "Nakameguro",
    costPP: 0,
    hours: 1.5,
    opensAt: 0,
    closesAt: 24,
    category: "nature",
    emoji: "🌿",
    area: "Nakameguro",
    localTip: "Grab a coffee to-go and walk south for the best photo angles.",
    coord: { lat: 35.6441, lon: 139.6988 },
  },
  {
    name: "Tokyo Skytree Visit",
    landmark: "Tokyo Skytree",
    costPP: 18,
    hours: 1.5,
    opensAt: 9,
    closesAt: 22,
    category: "technology",
    emoji: "📡",
    area: "Sumida",
    localTip: "Reserve a timed ticket for golden hour if weather is clear.",
    coord: { lat: 35.7101, lon: 139.8107 },
  },
  {
    name: "Golden Gai Evening Walk",
    landmark: "Shinjuku",
    costPP: 10,
    hours: 1.5,
    opensAt: 18,
    closesAt: 24,
    category: "culture",
    emoji: "🍸",
    area: "Shinjuku",
    localTip: "Stick to bars with posted cover charges; cash is easiest.",
    coord: { lat: 35.6942, lon: 139.7032 },
  },
  {
    name: "Tokyo Ramen Street Tasting",
    landmark: "Tokyo Station",
    costPP: 12,
    hours: 1,
    opensAt: 11,
    closesAt: 22,
    category: "food",
    emoji: "🍜",
    area: "Marunouchi",
    localTip: "Lines move fastest after 2 PM when office crowds thin out.",
    coord: { lat: 35.6814, lon: 139.7671 },
  },
  {
    name: "Ginza Art + Food Hall Stop",
    landmark: "Ginza",
    costPP: 8,
    hours: 1.5,
    opensAt: 10,
    closesAt: 21,
    category: "culture",
    emoji: "🖼️",
    area: "Ginza",
    localTip: "Department store basements discount bento boxes after 7 PM.",
    coord: { lat: 35.6717, lon: 139.765 },
  },
];

const TRIP = {
  destination: "Tokyo, Japan",
  days: 5,
  travelers: 2,
  budget: 4000,
  interests: ["culture", "food", "technology", "nature"],
  dayLabels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  mealCostPPPerDay: 60,
  transportCostPPPerDay: 15,
};

const WHY_TOKYO = [
  "Old temples and neon skylines share the same train line.",
  "Tokyo's rail system makes neighborhood-hopping effortless.",
  "Food culture runs deep — from 6-seat ramen shops to market stalls.",
  "Safe, walkable streets make late evenings feel easy and inviting.",
];

const WEATHER_FORECAST: WeatherForecast[] = [
  { day: 1, summary: "Clear skies, crisp morning", highC: 19, lowC: 11, chanceRain: 10, note: "Light jacket after sunset." },
  { day: 2, summary: "Sun + thin clouds", highC: 21, lowC: 13, chanceRain: 15, note: "Great day for skyline views." },
  { day: 3, summary: "Breezy with scattered clouds", highC: 18, lowC: 12, chanceRain: 20, note: "Comfortable walking weather." },
  { day: 4, summary: "Mostly sunny", highC: 22, lowC: 14, chanceRain: 10, note: "Bring sunglasses and light layers." },
  { day: 5, summary: "Morning drizzle, clearing later", highC: 17, lowC: 10, chanceRain: 45, note: "Pack a compact umbrella." },
];

const NEIGHBORHOOD_VIBES: Record<string, string> = {
  Asakusa: "Old-town lanes, incense smoke, and river breezes.",
  Shibuya: "Fast-paced, neon-lit, and full of late-night eats.",
  Shinjuku: "Skyscrapers by day, lantern alleys by night.",
  Harajuku: "Street fashion, youth culture, and tucked-away cafés.",
  Roppongi: "Art towers, rooftop views, and international flair.",
  Odaiba: "Waterfront promenades with wide-open skyline views.",
  Ueno: "Parkland, museums, and classic Tokyo neighborhood energy.",
  Akihabara: "Retro arcades, electronics, and anime storefronts.",
  Marunouchi: "Polished business district with historic palace grounds.",
  Tsukiji: "Seafood stalls, knives, and market energy.",
  Ginza: "Luxury storefronts, galleries, and food halls.",
  Sumida: "Riverside walks and Skytree panoramas.",
  Minato: "Tokyo Tower glow with a mix of embassy district calm.",
  Nakameguro: "Canal-side strolls and boutique coffee spots.",
};

const RESTAURANT_SETS: Record<string, RestaurantSet> = {
  Asakusa: {
    breakfast: { name: "Onigiri Asakusa Yadoroku", area: "Asakusa", cuisine: "Onigiri", price: "$", note: "Oldest onigiri shop in Tokyo." },
    lunch: { name: "Daikokuya Tempura", area: "Asakusa", cuisine: "Tempura", price: "$$", note: "Classic tempura bowls — expect a queue." },
    dinner: { name: "Asakusa Imahan", area: "Asakusa", cuisine: "Sukiyaki", price: "$$$", note: "Special-occasion wagyu in a historic dining room." },
    snack: { name: "Kagetsudo Melon Pan", area: "Asakusa", cuisine: "Bakery", price: "$", note: "Warm melon pan near Nakamise Street." },
  },
  Shibuya: {
    breakfast: { name: "Streamer Coffee Company", area: "Shibuya", cuisine: "Coffee", price: "$", note: "Latte art + quick pastries." },
    lunch: { name: "Uobei Shibuya Dogenzaka", area: "Shibuya", cuisine: "Conveyor sushi", price: "$", note: "Fast, fun, and surprisingly good." },
    dinner: { name: "Izakaya Uoshin", area: "Shibuya", cuisine: "Izakaya", price: "$$", note: "Lively seafood izakaya with seasonal plates." },
    snack: { name: "Miyashita Park Food Hall", area: "Shibuya", cuisine: "Street bites", price: "$", note: "Grab-and-go bites on the rooftop." },
  },
  Shinjuku: {
    breakfast: { name: "Tsujihan Shinjuku", area: "Shinjuku", cuisine: "Kaisendon", price: "$$", note: "Seafood rice bowls with quick service." },
    lunch: { name: "Menya Musashi", area: "Shinjuku", cuisine: "Ramen", price: "$", note: "Thick broth and bold flavors." },
    dinner: { name: "Omoide Yokocho Yakitori", area: "Shinjuku", cuisine: "Yakitori", price: "$$", note: "Tiny grill stalls under lanterns." },
    snack: { name: "Shinjuku Takano", area: "Shinjuku", cuisine: "Fruit parfait", price: "$$", note: "Iconic fruit salon for a sweet break." },
  },
  Roppongi: {
    breakfast: { name: "Blue Bottle Roppongi", area: "Roppongi", cuisine: "Coffee", price: "$", note: "Minimalist café with strong pour-overs." },
    lunch: { name: "Gonpachi Nishi-Azabu", area: "Roppongi", cuisine: "Soba + grill", price: "$$", note: "Classic Tokyo izakaya set lunches." },
    dinner: { name: "Butagumi", area: "Roppongi", cuisine: "Tonkatsu", price: "$$", note: "Deep-fried pork cutlets with serious crunch." },
    snack: { name: "National Art Center Café", area: "Roppongi", cuisine: "Dessert", price: "$$", note: "Coffee break amid art exhibits." },
  },
  Odaiba: {
    breakfast: { name: "Bills Odaiba", area: "Odaiba", cuisine: "Brunch", price: "$$", note: "Famous ricotta pancakes and bay views." },
    lunch: { name: "Aqua City Ramen Street", area: "Odaiba", cuisine: "Ramen", price: "$", note: "Multiple ramen shops under one roof." },
    dinner: { name: "Kua Aina Odaiba", area: "Odaiba", cuisine: "Burger", price: "$$", note: "Hawaiian-style burgers after sunset." },
    snack: { name: "Decks Tokyo Beach Popcorn", area: "Odaiba", cuisine: "Snack", price: "$", note: "Grab a quick bite on the promenade." },
  },
  Ueno: {
    breakfast: { name: "Park Side Café", area: "Ueno", cuisine: "Coffee", price: "$", note: "Quick espresso near the park entrance." },
    lunch: { name: "Inshotei", area: "Ueno", cuisine: "Kaiseki", price: "$$$", note: "Traditional dining inside the park." },
    dinner: { name: "Yamabe Okachimachi", area: "Ueno", cuisine: "Tonkatsu", price: "$$", note: "Local favorite for crispy cutlets." },
    snack: { name: "Ameyoko Street Snacks", area: "Ueno", cuisine: "Street food", price: "$", note: "Roasted chestnuts + skewers." },
  },
  Akihabara: {
    breakfast: { name: "Akihabara UDX Café", area: "Akihabara", cuisine: "Coffee", price: "$", note: "Easy meet-up spot near the station." },
    lunch: { name: "Kanda Yabu Soba", area: "Akihabara", cuisine: "Soba", price: "$$", note: "Historic soba house close by." },
    dinner: { name: "Gyukatsu Ichi Ni San", area: "Akihabara", cuisine: "Gyukatsu", price: "$$", note: "Sear-your-own beef cutlets." },
    snack: { name: "Gachapon Kaikan", area: "Akihabara", cuisine: "Capsule toys", price: "$", note: "Snack on street food while hunting gachapon." },
  },
  Marunouchi: {
    breakfast: { name: "Sarabeth's Tokyo", area: "Marunouchi", cuisine: "Brunch", price: "$$", note: "Soft omelets and French toast." },
    lunch: { name: "Tokyo Ramen Street", area: "Marunouchi", cuisine: "Ramen", price: "$", note: "Choose from eight top ramen shops." },
    dinner: { name: "Yakitori Imai", area: "Marunouchi", cuisine: "Yakitori", price: "$$$", note: "Refined skewers near the station." },
    snack: { name: "Tokyo Station Bento Hall", area: "Marunouchi", cuisine: "Ekiben", price: "$", note: "Grab a bento for the Shinkansen vibe." },
  },
  Tsukiji: {
    breakfast: { name: "Tsukiji Itadori", area: "Tsukiji", cuisine: "Seafood", price: "$$", note: "Classic kaisen bowls." },
    lunch: { name: "Unitora Nakadori", area: "Tsukiji", cuisine: "Uni bowls", price: "$$$", note: "Premium uni and toro." },
    dinner: { name: "Sushi Zanmai Honten", area: "Tsukiji", cuisine: "Sushi", price: "$$", note: "Late-night sushi staple." },
    snack: { name: "Hamarikyu Daiwa Sushi", area: "Tsukiji", cuisine: "Street snack", price: "$", note: "Quick hand rolls on the go." },
  },
  Ginza: {
    breakfast: { name: "Ginza Kimuraya", area: "Ginza", cuisine: "Bakery", price: "$", note: "Red bean buns with coffee." },
    lunch: { name: "Ginza Kagari", area: "Ginza", cuisine: "Chicken ramen", price: "$$", note: "Silky, rich broth in a small space." },
    dinner: { name: "Ginza Lion Beer Hall", area: "Ginza", cuisine: "German-Japanese", price: "$$", note: "Historic beer hall with classic plates." },
    snack: { name: "Ginza Six Food Hall", area: "Ginza", cuisine: "Dessert", price: "$$", note: "Pick up artisanal sweets." },
  },
  Sumida: {
    breakfast: { name: "Skytree Solamachi Café", area: "Sumida", cuisine: "Coffee", price: "$", note: "Quick breakfast with tower views." },
    lunch: { name: "Tenku Limon", area: "Sumida", cuisine: "Tonkatsu", price: "$$", note: "Local tonkatsu with a crisp finish." },
    dinner: { name: "Kokyo", area: "Sumida", cuisine: "Soba", price: "$$", note: "Quiet soba shop after Skytree." },
    snack: { name: "Asakusa Kagetsudo", area: "Sumida", cuisine: "Melon pan", price: "$", note: "Sweet snack for the riverside walk." },
  },
  Harajuku: {
    breakfast: { name: "Eggs 'n Things Harajuku", area: "Harajuku", cuisine: "Pancakes", price: "$$", note: "Fluffy pancakes to start the day." },
    lunch: { name: "Afuri Harajuku", area: "Harajuku", cuisine: "Yuzu ramen", price: "$", note: "Light, citrusy ramen." },
    dinner: { name: "Maisen Aoyama", area: "Harajuku", cuisine: "Tonkatsu", price: "$$", note: "Juicy cutlets in a quiet neighborhood." },
    snack: { name: "Totti Candy Factory", area: "Harajuku", cuisine: "Cotton candy", price: "$", note: "Colorful sugar clouds for the photo op." },
  },
};

const DEFAULT_RESTAURANT_SET: RestaurantSet = {
  breakfast: { name: "Local bakery stop", area: "Tokyo", cuisine: "Bakery", price: "$", note: "Grab a pastry and coffee near the station." },
  lunch: { name: "Depachika food hall", area: "Tokyo", cuisine: "Food hall", price: "$", note: "Mix-and-match bento boxes and snacks." },
  dinner: { name: "Neighborhood izakaya", area: "Tokyo", cuisine: "Izakaya", price: "$$", note: "Order a few shared plates and call it a night." },
  snack: { name: "Konbini run", area: "Tokyo", cuisine: "Convenience store", price: "$", note: "Onigiri, bottled tea, and seasonal treats." },
};

const TRANSIT_HINTS: Record<string, string> = {
  "Shinjuku->Shibuya": "JR Yamanote Line (~7 min)",
  "Shibuya->Harajuku": "JR Yamanote Line (~3 min)",
  "Shibuya->Asakusa": "Tokyo Metro Ginza Line (~35 min)",
  "Shinjuku->Asakusa": "Toei Shinjuku Line + Asakusa Line (~35 min)",
  "Shibuya->Roppongi": "Tokyo Metro Hanzomon + Oedo Line (~18 min)",
  "Roppongi->Ginza": "Tokyo Metro Hibiya Line (~10 min)",
  "Ginza->Tsukiji": "Tokyo Metro Hibiya Line (~3 min)",
  "Tsukiji->Ueno": "Hibiya Line to Ueno (~18 min)",
  "Ueno->Akihabara": "JR Yamanote Line (~4 min)",
  "Shinjuku->Nakameguro": "JR Yamanote + Tokyu Toyoko Line (~15 min)",
  "Odaiba->Shimbashi": "Yurikamome Line (~15 min)",
  "Marunouchi->Asakusa": "Tokyo Metro Ginza Line (~20 min)",
  "Asakusa->Sumida": "Walk or Tobu Skytree Line (~3 min)",
  "Roppongi->Odaiba": "Oedo Line + Yurikamome (~20 min)",
};

const AREA_THEMES: Record<string, string> = {
  Asakusa: "Old Tokyo temples and riverside lanes",
  Shibuya: "Big screens, fashion, and late-night energy",
  Shinjuku: "Gardens by day, lantern alleys by night",
  Harajuku: "Street fashion and leafy shrine walks",
  Roppongi: "Art museums and skyline views",
  Odaiba: "Bayfront promenades and futuristic builds",
  Ueno: "Parks, museums, and classic neighborhoods",
  Akihabara: "Retro games and electronics corridors",
  Marunouchi: "Historic palace grounds and Tokyo Station",
  Tsukiji: "Seafood markets and knife shops",
  Ginza: "Gallery-hopping and designer storefronts",
  Sumida: "Skytree panoramas and riverside calm",
  Minato: "Tokyo Tower glow with embassy district vibes",
  Nakameguro: "Canal strolls and boutique cafés",
};

const HIGHLIGHT_LINES: Record<string, string> = {
  "Senso-ji Morning Visit": "Lantern-lit Senso-ji before the tour buses arrive.",
  "Shibuya Crossing & Hachiko": "The scramble crossing at golden hour.",
  "Tokyo Skytree Visit": "Skyline panoramas from Tokyo Skytree.",
  "teamLab Borderless (Azabudai)": "Immersive digital art rooms at teamLab Borderless.",
  "Odaiba Seaside + Gundam": "Sunset over Tokyo Bay with the Gundam statue.",
  "Golden Gai Evening Walk": "Tiny bars and glowing lanterns in Golden Gai.",
  "Tsukiji Market Breakfast Stroll": "Fresh sushi bites at Tsukiji's morning stalls.",
};

const PACKING_ESSENTIALS = [
  "Comfortable walking shoes (you'll hit 15k+ steps most days).",
  "IC card (Suica/PASMO) + small coin pouch.",
  "Portable phone charger for navigation + photos.",
  "Light jacket or cardigan for cool evenings.",
];

const USEFUL_PHRASES = [
  { jp: "Sumimasen", en: "Excuse me / sorry" },
  { jp: "Arigatou gozaimasu", en: "Thank you" },
  { jp: "Eki wa doko desu ka?", en: "Where is the station?" },
  { jp: "Kore wa ikura desu ka?", en: "How much is this?" },
  { jp: "Koko de tabete ii desu ka?", en: "Can I eat here?" },
];

// ── Haversine ───────────────────────────────────────────────────────────────

function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function travelMinutes(km: number): number {
  return (km / 30) * 60; // 30 km/h avg Tokyo transit
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}

function padL(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : " ".repeat(n - s.length) + s;
}

function bar(fraction: number, width: number = 16): string {
  const filled = Math.round(fraction * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtTime(hour: number): string {
  let totalMin = Math.round(hour * 60);
  let h = Math.floor(totalMin / 60);
  let m = totalMin % 60;
  if (h >= 24) h -= 24;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

function fmtDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function header(emoji: string, title: string, agentNum: number): string {
  const inner = ` ${emoji}  Agent ${agentNum}: ${title} `;
  const line = "═".repeat(Math.max(0, 68 - inner.length));
  return `\n${clr(C.bold + C.cyan, "╔" + "═".repeat(68) + "╗")}\n${clr(C.bold + C.cyan, "║")}${clr(C.bold + C.white, inner)}${clr(C.dim, line)}${clr(C.bold + C.cyan, "║")}\n${clr(C.bold + C.cyan, "╚" + "═".repeat(68) + "╝")}`;
}

function subHeader(text: string): string {
  return `\n  ${clr(C.bold + C.yellow, "▸ " + text)}`;
}

function normalize(val: number, min: number, max: number): number {
  if (max === min) return 50;
  return ((val - min) / (max - min)) * 100;
}

function getWeather(day: number): WeatherForecast {
  return WEATHER_FORECAST.find((w) => w.day === day) ?? WEATHER_FORECAST[0];
}

function dominantArea(activities: Activity[]): string {
  const counts = new Map<string, number>();
  for (const act of activities) {
    counts.set(act.area, (counts.get(act.area) ?? 0) + 1);
  }
  let best = "Tokyo";
  let bestCount = 0;
  for (const [area, count] of counts.entries()) {
    if (count > bestCount) {
      best = area;
      bestCount = count;
    }
  }
  return best;
}

function dayTheme(activities: Activity[]): string {
  const area = dominantArea(activities);
  return AREA_THEMES[area] ?? "A mix of neighborhoods with short transit hops";
}

function getRestaurantSet(area: string): RestaurantSet {
  return RESTAURANT_SETS[area] ?? DEFAULT_RESTAURANT_SET;
}

function transitHint(fromArea: string, toArea: string, km: number): string {
  if (fromArea === toArea) {
    return `Walk between spots in ${toArea} (~${Math.max(5, Math.round(km * 12))} min)`;
  }
  if (km < 1.2) {
    return `Walk ~${Math.max(8, Math.round(km * 12))} min to ${toArea}`;
  }
  const key = `${fromArea}->${toArea}`;
  const reverse = `${toArea}->${fromArea}`;
  const line = TRANSIT_HINTS[key] ?? TRANSIT_HINTS[reverse];
  if (line) {
    return `Take ${line} from ${fromArea} to ${toArea}`;
  }
  return `Take Tokyo Metro from ${fromArea} to ${toArea} (~${Math.round(travelMinutes(km))} min)`;
}

function splitByTime(activities: ScheduledActivity[]) {
  const morning: ScheduledActivity[] = [];
  const afternoon: ScheduledActivity[] = [];
  const evening: ScheduledActivity[] = [];
  for (const act of activities) {
    if (act.startTime < 12) {
      morning.push(act);
    } else if (act.startTime < 17) {
      afternoon.push(act);
    } else {
      evening.push(act);
    }
  }
  return { morning, afternoon, evening };
}

function pickDontMiss(dayPlan: DayPlan): string {
  for (const act of dayPlan.activities) {
    const line = HIGHLIGHT_LINES[act.name];
    if (line) return line;
  }
  const area = dominantArea(dayPlan.activities);
  return `Take a slow evening stroll in ${area} and let the city settle in.`;
}

function collectHighlights(dayPlans: DayPlan[]): string[] {
  const highlights: string[] = [];
  const seen = new Set<string>();
  for (const plan of dayPlans) {
    for (const act of plan.activities) {
      const line = HIGHLIGHT_LINES[act.name];
      if (line && !seen.has(line)) {
        highlights.push(line);
        seen.add(line);
      }
    }
  }
  if (highlights.length < 5) {
    highlights.push("Nighttime neighborhood wander with glowing lantern streets.");
  }
  return highlights.slice(0, 5);
}

function buildPackingSuggestions(): string[] {
  const suggestions = new Set<string>([
    "Comfortable walking shoes",
    "IC card holder (Suica/PASMO)",
    "Portable phone charger",
  ]);
  const minLow = Math.min(...WEATHER_FORECAST.map((w) => w.lowC));
  const maxHigh = Math.max(...WEATHER_FORECAST.map((w) => w.highC));
  const rainChance = Math.max(...WEATHER_FORECAST.map((w) => w.chanceRain));
  if (minLow <= 11) suggestions.add("Light sweater or cardigan");
  if (maxHigh >= 22) suggestions.add("Breathable layers");
  if (rainChance >= 35) suggestions.add("Compact umbrella or packable rain shell");
  return Array.from(suggestions);
}

// ── Agent 1: Flight Agent ───────────────────────────────────────────────────

interface FlightResult {
  flight: Flight;
  totalCost: number;
  score: number;
}

async function flightAgent(): Promise<FlightResult> {
  console.log(header("✈️", "Flight Agent", 1));
  await sleep(400);
  console.log(subHeader("Analyzing 5 flight options LAX → NRT (round-trip pricing)..."));
  await sleep(300);
  console.log(clr(C.dim, "  I value fewer layovers and total travel time, then price as the tie-breaker."));
  await sleep(200);

  const prices = FLIGHTS.map((f) => f.price);
  const durations = FLIGHTS.map((f) => f.durationMin);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minD = Math.min(...durations), maxD = Math.max(...durations);

  const scored = FLIGHTS.map((f) => {
    const priceScore = 100 - normalize(f.price, minP, maxP);
    const durScore = 100 - normalize(f.durationMin, minD, maxD);
    const stopPenalty = f.stops * 20;
    const total = priceScore * 0.45 + durScore * 0.35 - stopPenalty + 20; // base 20
    return { flight: f, totalCost: f.price * 2, priceScore, durScore, stopPenalty, score: Math.round(total) };
  });

  scored.sort((a, b) => b.score - a.score);
  const cheapest = scored.reduce((best, cur) => (cur.flight.price < best.flight.price ? cur : best), scored[0]);
  const fastest = scored.reduce((best, cur) => (cur.flight.durationMin < best.flight.durationMin ? cur : best), scored[0]);

  // Table header
  console.log("");
  console.log(
    `  ${clr(C.dim, pad("Flight Option", 28))} ${padL("$/pp", 7)} ${padL("Total", 8)} ${padL("Duration", 10)} ${padL("Stops", 6)} ${padL("Score", 6)}`
  );
  console.log(`  ${clr(C.dim, "─".repeat(68))}`);

  for (let i = 0; i < scored.length; i++) {
    const s = scored[i];
    const f = s.flight;
    const isWinner = i === 0;
    const color = isWinner ? C.green + C.bold : C.white;
    const marker = isWinner ? " ★" : "  ";
    console.log(
      `${clr(color, marker + pad(f.name, 28))} ${padL(fmtUsd(f.price), 7)} ${padL(fmtUsd(f.price * 2), 8)} ${padL(fmtDuration(f.durationMin), 10)} ${padL(String(f.stops), 6)} ${padL(String(s.score), 6)}`
    );
    await sleep(150);
  }

  const winner = scored[0];
  const priceDelta = winner.flight.price - cheapest.flight.price;
  const timeSavedVsCheapest = cheapest.flight.durationMin - winner.flight.durationMin;
  const timeSaved = fastest.flight.durationMin - winner.flight.durationMin;
  const layoverNote = winner.flight.stops === 0 ? "no layovers" : `${winner.flight.stops} layover(s)`;
  console.log(
    `\n  ${clr(C.green, "✓")} Selected: ${clr(C.bold + C.green, winner.flight.name)} — ${fmtUsd(winner.totalCost)} for 2 travelers (score ${winner.score})`
  );
  console.log(
    clr(
      C.dim,
      `  Why this pick: ${layoverNote}, ${fmtDuration(winner.flight.durationMin)} total travel, and strong value score.`
    )
  );
  if (winner.flight.name !== cheapest.flight.name) {
    const timePhrase =
      timeSavedVsCheapest >= 0
        ? `saves ${fmtDuration(timeSavedVsCheapest)} of travel time`
        : `adds ${fmtDuration(Math.abs(timeSavedVsCheapest))} of travel time`;
    console.log(
      clr(
        C.dim,
        `  Trade-off: ${priceDelta >= 0 ? "+" : "-"}${fmtUsd(Math.abs(priceDelta))} per person vs cheapest, but ${timePhrase}.`
      )
    );
  }
  if (winner.flight.name !== fastest.flight.name && timeSaved > 0) {
    console.log(
      clr(
        C.dim,
        `  Trade-off: ${fmtUsd(winner.flight.price - fastest.flight.price)} per person for only ${fmtDuration(timeSaved)} longer than the fastest option.`
      )
    );
  }

  return { flight: winner.flight, totalCost: winner.totalCost, score: winner.score };
}

// ── Agent 2: Hotel Agent ────────────────────────────────────────────────────

interface HotelResult {
  hotel: Hotel;
  totalCost: number;
  score: number;
}

async function hotelAgent(budgetRemaining: number): Promise<HotelResult> {
  console.log(header("🏨", "Hotel Agent", 2));
  await sleep(400);
  console.log(subHeader(`Evaluating 6 hotels (budget remaining: ${fmtUsd(budgetRemaining)})...`));
  await sleep(300);
  console.log(clr(C.dim, "  I balance neighborhood walkability with rating, then check the price tag."));
  await sleep(200);

  // Top 5 attractions by popularity for proximity scoring
  const topAttractions: Coord[] = [
    { lat: 35.6595, lon: 139.7004 }, // Shibuya
    { lat: 35.7148, lon: 139.7967 }, // Senso-ji
    { lat: 35.6586, lon: 139.7454 }, // Tokyo Tower
    { lat: 35.6764, lon: 139.6993 }, // Meiji Shrine
    { lat: 35.7023, lon: 139.7745 }, // Akihabara
  ];

  const prices = HOTELS.map((h) => h.pricePerNight);
  const ratings = HOTELS.map((h) => h.rating);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minR = Math.min(...ratings), maxR = Math.max(...ratings);

  const scored = HOTELS.map((h) => {
    const avgDist = topAttractions.reduce((s, a) => s + haversineKm(h.coord, a), 0) / topAttractions.length;
    const priceScore = 100 - normalize(h.pricePerNight, minP, maxP);
    const ratingScore = normalize(h.rating, minR, maxR);
    const locationScore = Math.max(0, 100 - avgDist * 10); // closer = higher
    const total = priceScore * 0.35 + ratingScore * 0.30 + locationScore * 0.35;
    const totalCost = h.pricePerNight * TRIP.days;
    return { hotel: h, totalCost, priceScore, ratingScore, locationScore, avgDist, score: Math.round(total) };
  });

  scored.sort((a, b) => b.score - a.score);
  const cheapest = scored.reduce((best, cur) => (cur.hotel.pricePerNight < best.hotel.pricePerNight ? cur : best), scored[0]);
  const closest = scored.reduce((best, cur) => (cur.avgDist < best.avgDist ? cur : best), scored[0]);

  console.log("");
  console.log(
    `  ${clr(C.dim, pad("Hotel", 24))} ${padL("$/night", 8)} ${padL("5 nights", 9)} ${padL("Rating", 7)} ${padL("Avg km", 7)} ${padL("Score", 6)}`
  );
  console.log(`  ${clr(C.dim, "─".repeat(64))}`);

  for (let i = 0; i < scored.length; i++) {
    const s = scored[i];
    const h = s.hotel;
    const isWinner = i === 0;
    const color = isWinner ? C.green + C.bold : C.white;
    const marker = isWinner ? " ★" : "  ";
    console.log(
      `${clr(color, marker + pad(h.name, 24))} ${padL(fmtUsd(h.pricePerNight), 8)} ${padL(fmtUsd(s.totalCost), 9)} ${padL(h.rating.toFixed(1), 7)} ${padL(s.avgDist.toFixed(1), 7)} ${padL(String(s.score), 6)}`
    );
    await sleep(150);
  }

  const winner = scored[0];
  console.log(
    `\n  ${clr(C.green, "✓")} Selected: ${clr(C.bold + C.green, winner.hotel.name)} — ${fmtUsd(winner.totalCost)} for 5 nights (${winner.hotel.location})`
  );
  console.log(clr(C.dim, `  Neighborhood vibe: ${winner.hotel.vibe}`));
  if (winner.hotel.name !== cheapest.hotel.name) {
    const priceDelta = winner.hotel.pricePerNight - cheapest.hotel.pricePerNight;
    const distanceDelta = cheapest.avgDist - winner.avgDist;
    const distancePhrase =
      Math.abs(distanceDelta) < 0.2
        ? "about the same distance"
        : distanceDelta >= 0
        ? `${distanceDelta.toFixed(1)} km closer`
        : `${Math.abs(distanceDelta).toFixed(1)} km farther`;
    console.log(
      clr(
        C.dim,
        `  Trade-off: ${priceDelta >= 0 ? "+" : "-"}${fmtUsd(Math.abs(priceDelta))}/night vs cheapest, but ${distancePhrase} to top sights.`
      )
    );
  }
  if (winner.hotel.name !== closest.hotel.name) {
    const priceDelta = winner.hotel.pricePerNight - closest.hotel.pricePerNight;
    console.log(clr(C.dim, `  Trade-off: ${priceDelta >= 0 ? "+" : "-"}${fmtUsd(Math.abs(priceDelta))}/night vs the most central option.`));
  }

  return { hotel: winner.hotel, totalCost: winner.totalCost, score: winner.score };
}

// ── Agent 3: Activity Agent ─────────────────────────────────────────────────

// K-means-ish clustering of activities into 5 day groups by location
function clusterActivities(acts: Activity[], k: number): Activity[][] {
  // Seed centroids from evenly-spaced landmarks
  const seedIndices = [0, 3, 6, 10, 14]; // spread across LANDMARKS
  const centroids: Coord[] = seedIndices.slice(0, k).map((i) => ({ ...LANDMARKS[i] }));

  let clusters: Activity[][] = Array.from({ length: k }, () => []);

  for (let iter = 0; iter < 10; iter++) {
    clusters = Array.from({ length: k }, () => []);
    for (const a of acts) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const d = haversineKm(a.coord, centroids[c]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = c;
        }
      }
      clusters[bestIdx].push(a);
    }

    // Update centroids
    for (let c = 0; c < k; c++) {
      if (clusters[c].length === 0) continue;
      centroids[c].lat = clusters[c].reduce((s, a) => s + a.coord.lat, 0) / clusters[c].length;
      centroids[c].lon = clusters[c].reduce((s, a) => s + a.coord.lon, 0) / clusters[c].length;
    }
  }

  return clusters;
}

// Nearest-neighbor ordering within a cluster
function nearestNeighborOrder(acts: Activity[], startCoord: Coord): Activity[] {
  if (acts.length <= 1) return [...acts];
  const remaining = [...acts];
  const ordered: Activity[] = [];
  let current = startCoord;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(current, remaining[i].coord);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    current = next.coord;
  }

  return ordered;
}

// Balance clusters so each day has 3-4 activities
function balanceClusters(clusters: Activity[][]): Activity[][] {
  const target = Math.ceil(ACTIVITIES.length / TRIP.days);
  const flat = clusters.flatMap((c) => c);
  const balanced: Activity[][] = Array.from({ length: TRIP.days }, () => []);

  // Redistribute: fill each day up to target
  let idx = 0;
  for (const a of flat) {
    if (balanced[idx].length >= target) idx = Math.min(idx + 1, TRIP.days - 1);
    balanced[idx].push(a);
  }
  return balanced;
}

async function activityAgent(hotelCoord: Coord): Promise<DayPlan[]> {
  console.log(header("🎌", "Activity Agent", 3));
  await sleep(400);
  console.log(subHeader("Clustering activities by geographic proximity..."));
  await sleep(300);
  console.log(clr(C.dim, "  Goal: keep each day tight so you're not zig-zagging across the city."));
  await sleep(200);

  const rawClusters = clusterActivities(ACTIVITIES, TRIP.days);
  const clusters = balanceClusters(rawClusters);

  const dayPlans: DayPlan[] = [];

  for (let d = 0; d < TRIP.days; d++) {
    // Sort by opening time so early-morning activities come first
    const sorted = [...clusters[d]].sort((a, b) => a.opensAt - b.opensAt);

    // Split into morning/afternoon groups for better scheduling
    const morning = sorted.filter((a) => a.opensAt < 14);
    const afternoon = sorted.filter((a) => a.opensAt >= 14);

    // Order each group by nearest-neighbor, then concatenate
    const ordered = [
      ...nearestNeighborOrder(morning, hotelCoord),
      ...nearestNeighborOrder(afternoon, morning.length > 0 ? morning[morning.length - 1].coord : hotelCoord),
    ];

    const scheduled: ScheduledActivity[] = [];
    let clock = 9.0; // Start at 9 AM

    for (let i = 0; i < ordered.length; i++) {
      const a = ordered[i];
      const prevCoord = i === 0 ? hotelCoord : ordered[i - 1].coord;
      const distKm = haversineKm(prevCoord, a.coord);
      const tMin = travelMinutes(distKm);

      clock += tMin / 60; // travel time
      if (clock < a.opensAt) clock = a.opensAt;

      // Skip if we can't finish before closing
      if (clock + a.hours > a.closesAt && a.closesAt < 24) continue;

      // Insert lunch break if crossing noon
      if (clock < 12.5 && clock + a.hours > 13) {
        // Do nothing — we'll just schedule through
      }

      const startTime = clock;
      const endTime = clock + a.hours;
      scheduled.push({ ...a, startTime, endTime, travelKm: distKm, travelMin: tMin });
      clock = endTime + 0.17; // ~10 min buffer
    }

    const totalCost = scheduled.reduce((s, a) => s + a.costPP * TRIP.travelers, 0);
    const totalDistKm = scheduled.reduce((s, a) => s + a.travelKm, 0);
    dayPlans.push({ day: d + 1, label: TRIP.dayLabels[d], activities: scheduled, totalCost, totalDistKm });
  }

  // Print day summaries
  for (const dp of dayPlans) {
    const area = dominantArea(dp.activities);
    console.log(subHeader(`Day ${dp.day} (${dp.label}) — ${AREA_THEMES[area] ?? "Mixed highlights"}`));
    console.log(clr(C.dim, `    ${dp.activities.length} stops · ${dp.totalDistKm.toFixed(1)} km transit · ${NEIGHBORHOOD_VIBES[area] ?? "A varied Tokyo day."}`));
    for (const a of dp.activities) {
      const dist = a.travelKm > 0.01 ? clr(C.dim, ` (${a.travelKm.toFixed(1)} km, ${Math.round(a.travelMin)} min transit)`) : "";
      console.log(
        `    ${clr(C.cyan, fmtTime(a.startTime))} – ${clr(C.cyan, fmtTime(a.endTime))}  ${a.emoji} ${a.name}${dist}  ${clr(C.dim, a.costPP > 0 ? fmtUsd(a.costPP * 2) : "Free")}`
      );
      if (a.localTip) {
        console.log(clr(C.dim, `       Tip: ${a.localTip}`));
      }
      await sleep(100);
    }
    console.log(clr(C.dim, `    Day cost: ${fmtUsd(dp.totalCost)}`));
  }

  return dayPlans;
}

// ── Agent 4: Budget Agent ───────────────────────────────────────────────────

interface BudgetResult {
  lines: BudgetLine[];
  total: number;
  remaining: number;
  isOver: boolean;
}

async function budgetAgent(
  flightCost: number,
  hotelCost: number,
  dayPlans: DayPlan[]
): Promise<BudgetResult> {
  console.log(header("💰", "Budget Agent", 4));
  await sleep(400);
  console.log(subHeader("Computing total trip cost and verifying budget constraints..."));
  await sleep(300);

  const activityTotal = dayPlans.reduce((s, dp) => s + dp.totalCost, 0);
  const mealTotal = TRIP.mealCostPPPerDay * TRIP.travelers * TRIP.days;
  const transportTotal = TRIP.transportCostPPPerDay * TRIP.travelers * TRIP.days;
  const hotelPerNight = hotelCost / TRIP.days;

  const lines: BudgetLine[] = [
    { label: "Flights", emoji: "✈️", amount: flightCost },
    { label: "Hotel", emoji: "🏨", amount: hotelCost },
    { label: "Activities", emoji: "🎌", amount: activityTotal },
    { label: "Food", emoji: "🍜", amount: mealTotal },
    { label: "Transport", emoji: "🚃", amount: transportTotal },
  ];

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const remaining = TRIP.budget - total;

  // Running budget bar
  console.log("");
  const fraction = total / TRIP.budget;
  const budgetColor = fraction > 1 ? C.red : fraction > 0.85 ? C.yellow : C.green;
  console.log(
    `  Budget: [${clr(budgetColor, bar(Math.min(fraction, 1), 30))}] ${fmtUsd(total)} / ${fmtUsd(TRIP.budget)} (${(fraction * 100).toFixed(1)}%)`
  );
  await sleep(200);

  // Category breakdown
  console.log(subHeader("Cost breakdown"));
  console.log("");
  for (const l of lines) {
    const pct = l.amount / TRIP.budget;
    console.log(
      `  ${l.emoji} ${pad(l.label, 12)} ${bar(pct)} ${padL(fmtUsd(l.amount), 7)}  (${(pct * 100).toFixed(1)}%)`
    );
    await sleep(120);
  }
  // Remaining
  const remPct = Math.max(0, remaining) / TRIP.budget;
  console.log(
    `  💰 ${pad("Remaining", 12)} ${bar(remPct)} ${padL(fmtUsd(Math.max(0, remaining)), 7)}  (${(remPct * 100).toFixed(1)}%)`
  );

  const isOver = remaining < 0;
  if (isOver) {
    console.log(
      `\n  ${clr(C.red, "⚠  OVER BUDGET by " + fmtUsd(Math.abs(remaining)))}`
    );
    console.log(clr(C.yellow, "  Suggestions:"));
    console.log(
      clr(
        C.yellow,
        "    • Switch to Tokyu Stay Shinjuku to save " + fmtUsd(Math.max(0, Math.round((hotelPerNight - 110) * TRIP.days)))
      )
    );
    console.log(clr(C.yellow, "    • Skip teamLab Borderless to save $100 for two"));
  } else {
    console.log(
      `\n  ${clr(C.green, "✓")} ${clr(C.bold + C.green, "Under budget!")} ${fmtUsd(remaining)} remaining for souvenirs & extras`
    );
    const hilton = HOTELS.find((h) => h.name === "Hilton Tokyo");
    const hiltonUpgrade = hilton ? hilton.pricePerNight * TRIP.days - hotelCost : 0;
    const upgrades = [
      { label: "Upgrade hotel to Hilton Tokyo", cost: hiltonUpgrade, note: "Spa access + skyline views." },
      { label: "Omakase dinner for two", cost: 260, note: "Intimate chef-led sushi experience." },
      { label: "Tokyo DisneySea day tickets", cost: 180, note: "A full-day adventure in the bay." },
      { label: "Private tea ceremony", cost: 140, note: "Quiet cultural reset in a historic room." },
    ].filter((u) => u.cost > 0 && u.cost <= remaining);

    if (upgrades.length > 0) {
      console.log(clr(C.yellow, "  Splurge ideas with your remaining budget:"));
      for (const u of upgrades.slice(0, 3)) {
        console.log(clr(C.yellow, `    • ${u.label} (+${fmtUsd(u.cost)}) — ${u.note}`));
      }
    } else {
      console.log(clr(C.yellow, "  Consider saving the rest for shopping, cafés, and last-minute finds."));
    }
  }

  return { lines, total, remaining, isOver };
}

// ── Agent 5: Itinerary Agent ────────────────────────────────────────────────

async function itineraryAgent(
  flight: Flight,
  hotel: Hotel,
  dayPlans: DayPlan[],
  budget: BudgetResult
): Promise<void> {
  console.log(header("📋", "Itinerary Agent", 5));
  await sleep(400);
  console.log(subHeader("Assembling final optimized 5-day itinerary...\n"));
  await sleep(300);

  // Trip overview card
  const cardWidth = 62;
  const cLine = "─".repeat(cardWidth);
  console.log(clr(C.bold + C.magenta, `  ┌${cLine}┐`));
  console.log(clr(C.bold + C.magenta, `  │${pad("  🗾  TOKYO TRAVEL PLAN  —  5 Days / 2 Travelers", cardWidth)}│`));
  console.log(clr(C.bold + C.magenta, `  │${pad("  ✈️  " + flight.name + " — " + fmtUsd(flight.price * 2), cardWidth)}│`));
  console.log(clr(C.bold + C.magenta, `  │${pad("  🏨  " + hotel.name + " — " + fmtUsd(hotel.pricePerNight) + "/night × 5", cardWidth)}│`));
  console.log(clr(C.bold + C.magenta, `  │${pad("  💰  Total: " + fmtUsd(budget.total) + " / " + fmtUsd(TRIP.budget) + " budget", cardWidth)}│`));
  console.log(clr(C.bold + C.magenta, `  └${cLine}┘`));
  await sleep(200);

  console.log(subHeader("Weather outlook (simulated)"));
  for (const w of WEATHER_FORECAST) {
    console.log(
      clr(
        C.dim,
        `  Day ${w.day} (${TRIP.dayLabels[w.day - 1]}): ${w.summary} · ${w.highC}°C/${w.lowC}°C · ${w.chanceRain}% rain · ${w.note}`
      )
    );
  }

  for (const dp of dayPlans) {
    const area = dominantArea(dp.activities);
    const theme = dayTheme(dp.activities);
    const vibe = NEIGHBORHOOD_VIBES[area] ?? "Tokyo charm in every direction.";
    const weather = getWeather(dp.day);
    const restaurants = getRestaurantSet(area);
    const dontMiss = pickDontMiss(dp);
    const { morning, afternoon, evening } = splitByTime(dp.activities);
    let previousArea = hotel.area;

    console.log(
      `\n  ${clr(C.bold + C.blue, "━━━ Day " + dp.day + " — " + dp.label + " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`
    );
    console.log(clr(C.dim, `  Theme: ${theme}`));
    console.log(clr(C.dim, `  Weather: ${weather.summary} · ${weather.highC}°C/${weather.lowC}°C · ${weather.chanceRain}% rain`));
    console.log(clr(C.dim, `  Neighborhood vibe: ${vibe}`));

    const printSection = (
      label: string,
      acts: ScheduledActivity[],
      meal: RestaurantPick,
      mealLabel: string,
      snack?: RestaurantPick
    ) => {
      console.log(clr(C.bold + C.yellow, `  ${label}`));
      if (acts.length === 0) {
        console.log(clr(C.dim, "    Open time for wandering, cafés, or shopping."));
      }
      for (const a of acts) {
        const costStr = a.costPP > 0 ? padL(fmtUsd(a.costPP * 2), 8) : padL("Free", 8);
        const costColored = a.costPP > 0 ? costStr : clr(C.green, costStr);
        console.log(
          `    ${clr(C.cyan, fmtTime(a.startTime) + " – " + fmtTime(a.endTime))}  ${a.emoji} ${pad(a.name, 28)} ${costColored}`
        );
        console.log(clr(C.dim, `       Transit: ${transitHint(previousArea, a.area, a.travelKm)}`));
        if (a.localTip) {
          console.log(clr(C.dim, `       Local tip: ${a.localTip}`));
        }
        previousArea = a.area;
      }
      console.log(
        clr(
          C.yellow,
          `    ${mealLabel}: ${meal.name} (${meal.cuisine}, ${meal.price}) — ${meal.note}`
        )
      );
      if (snack) {
        console.log(
          clr(
            C.yellow,
            `    Snack: ${snack.name} (${snack.cuisine}, ${snack.price}) — ${snack.note}`
          )
        );
      }
    };

    printSection("Morning", morning, restaurants.breakfast, "Breakfast");
    printSection("Afternoon", afternoon, restaurants.lunch, "Lunch", restaurants.snack);
    printSection("Evening", evening, restaurants.dinner, "Dinner");

    console.log(clr(C.yellow, `  Don't miss: ${dontMiss}`));
    console.log(
      clr(C.dim, `  Day total: ${fmtUsd(dp.totalCost)} activities + ~$90 meals + ~$30 transit = ${fmtUsd(dp.totalCost + 120)}`)
    );
  }

  console.log(subHeader("Trip highlights (top 5 moments)"));
  const highlights = collectHighlights(dayPlans);
  highlights.forEach((h, i) => {
    console.log(clr(C.dim, `  ${i + 1}. ${h}`));
  });

  // Final summary
  console.log(`\n${clr(C.bold + C.cyan, "  ╔" + "═".repeat(62) + "╗")}`);
  console.log(`${clr(C.bold + C.cyan, "  ║")}${clr(C.bold + C.white, "  📊  FINAL BUDGET SUMMARY" + " ".repeat(36))}${clr(C.bold + C.cyan, "║")}`);
  console.log(`${clr(C.bold + C.cyan, "  ╠" + "═".repeat(62) + "╣")}`);

  for (const l of budget.lines) {
    const pct = l.amount / TRIP.budget;
    const lineStr = `  ${l.emoji} ${pad(l.label, 12)} ${bar(pct)} ${padL(fmtUsd(l.amount), 7)}  (${padL((pct * 100).toFixed(1), 5)}%)`;
    console.log(`${clr(C.bold + C.cyan, "  ║")}${lineStr}${" ".repeat(Math.max(0, 62 - lineStr.length + 2))}${clr(C.bold + C.cyan, "║")}`);
    await sleep(100);
  }

  const remPct = Math.max(0, budget.remaining) / TRIP.budget;
  const remLine = `  💰 ${pad("Remaining", 12)} ${bar(remPct)} ${padL(fmtUsd(Math.max(0, budget.remaining)), 7)}  (${padL((remPct * 100).toFixed(1), 5)}%)`;
  console.log(`${clr(C.bold + C.cyan, "  ║")}${remLine}${" ".repeat(Math.max(0, 62 - remLine.length + 2))}${clr(C.bold + C.cyan, "║")}`);
  console.log(`${clr(C.bold + C.cyan, "  ╚" + "═".repeat(62) + "╝")}`);

  // Haversine verification
  console.log(subHeader("Haversine distance verification (sample pairs)"));
  const pairs: [number, number, string, string][] = [
    [0, 1, "Shibuya", "Senso-ji"],
    [2, 4, "Tokyo Tower", "Meiji Shrine"],
    [3, 10, "Akihabara", "Ueno Park"],
    [6, 9, "Shinjuku Gyoen", "Harajuku"],
    [0, 11, "Shibuya", "Odaiba"],
  ];
  for (const [a, b, na, nb] of pairs) {
    const d = haversineKm(LANDMARKS[a], LANDMARKS[b]);
    console.log(clr(C.dim, `    ${na} ↔ ${nb}: ${d.toFixed(2)} km`));
  }

  console.log(subHeader("What to pack"));
  const packList = new Set<string>([...PACKING_ESSENTIALS, ...buildPackingSuggestions()]);
  for (const item of packList) {
    console.log(clr(C.dim, `  • ${item}`));
  }

  console.log(subHeader("Useful phrases"));
  for (const phrase of USEFUL_PHRASES) {
    console.log(clr(C.dim, `  • ${phrase.jp} — ${phrase.en}`));
  }

  console.log(
    `\n  ${clr(C.bold + C.green, "✅ Trip planning complete!")} ${TRIP.days} days in ${TRIP.destination}`
  );
  console.log(
    clr(C.dim, `  All ${ACTIVITIES.length} activities scheduled · ${dayPlans.reduce((s, d) => s + d.totalDistKm, 0).toFixed(1)} km total transit · ${fmtUsd(budget.total)} total cost\n`)
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(clr(C.bold + C.magenta, "\n  ╔══════════════════════════════════════════════════════════════════╗"));
  console.log(clr(C.bold + C.magenta, "  ║   🗾  SQUAD TRAVEL PLANNER — Multi-Agent Trip Optimization  🗾  ║"));
  console.log(clr(C.bold + C.magenta, "  ╠══════════════════════════════════════════════════════════════════╣"));
  console.log(clr(C.bold + C.magenta, "  ║") + `  Destination: ${clr(C.bold, "Tokyo, Japan")}                                   ` + clr(C.bold + C.magenta, "║"));
  console.log(clr(C.bold + C.magenta, "  ║") + `  Duration:    ${clr(C.bold, "5 days")} (Mon – Fri)                              ` + clr(C.bold + C.magenta, "║"));
  console.log(clr(C.bold + C.magenta, "  ║") + `  Travelers:   ${clr(C.bold, "2 people")}                                        ` + clr(C.bold + C.magenta, "║"));
  console.log(clr(C.bold + C.magenta, "  ║") + `  Budget:      ${clr(C.bold + C.green, "$4,000")}                                          ` + clr(C.bold + C.magenta, "║"));
  console.log(clr(C.bold + C.magenta, "  ║") + `  Interests:   Culture · Food · Technology · Nature               ` + clr(C.bold + C.magenta, "║"));
  console.log(clr(C.bold + C.magenta, "  ╚══════════════════════════════════════════════════════════════════╝"));

  console.log(subHeader("Why Tokyo?"));
  for (const reason of WHY_TOKYO) {
    console.log(clr(C.dim, `  • ${reason}`));
  }

  console.log(clr(C.dim, "\n  Initializing 5 planning agents...\n"));
  await sleep(600);

  // Agent 1 – Flights
  const flightResult = await flightAgent();
  await sleep(300);

  // Agent 2 – Hotel
  const budgetAfterFlights = TRIP.budget - flightResult.totalCost;
  const hotelResult = await hotelAgent(budgetAfterFlights);
  await sleep(300);

  // Agent 3 – Activities
  const dayPlans = await activityAgent(hotelResult.hotel.coord);
  await sleep(300);

  // Agent 4 – Budget
  const budgetResult = await budgetAgent(flightResult.totalCost, hotelResult.totalCost, dayPlans);
  await sleep(300);

  // Agent 5 – Itinerary
  await itineraryAgent(flightResult.flight, hotelResult.hotel, dayPlans, budgetResult);
}

main().catch(console.error);
