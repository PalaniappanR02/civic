import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Sample civic reports data
const reportsData = [
  {
    title: "Massive pothole on MG Road",
    description: "A 3-foot wide pothole near the central junction causing accidents.",
    category: "infrastructure",
    priority: "critical",
    status: "in-progress",
    latitude: 12.9716,
    longitude: 77.5946,
    ward: "Ward 14",
    votes: 147,
    userId: 1,
  },
  {
    title: "Broken streetlight cluster — Sector 7",
    description: "Entire block of 6 streetlights non-functional for 2 weeks.",
    category: "utilities",
    priority: "high",
    status: "open",
    latitude: 12.9750,
    longitude: 77.5900,
    ward: "Ward 14",
    votes: 89,
    userId: 1,
  },
  {
    title: "Illegal waste dumping near lake",
    description: "Construction debris and household garbage being dumped.",
    category: "environment",
    priority: "critical",
    status: "open",
    latitude: 12.9800,
    longitude: 77.6100,
    ward: "Ward 15",
    votes: 234,
    userId: 1,
  },
  {
    title: "Water main leak on 5th Cross",
    description: "Continuous water leak from underground pipe.",
    category: "utilities",
    priority: "high",
    status: "in-progress",
    latitude: 12.9680,
    longitude: 77.5980,
    ward: "Ward 14",
    votes: 56,
    userId: 1,
  },
  {
    title: "Missing manhole cover — pedestrian zone",
    description: "Open manhole on the main pedestrian walkway.",
    category: "safety",
    priority: "critical",
    status: "open",
    latitude: 12.9720,
    longitude: 77.6050,
    ward: "Ward 14",
    votes: 312,
    userId: 1,
  },
  {
    title: "Traffic signal malfunction at junction",
    description: "Traffic signal stuck on green for all directions.",
    category: "infrastructure",
    priority: "high",
    status: "resolved",
    latitude: 12.9690,
    longitude: 77.6020,
    ward: "Ward 14",
    votes: 178,
    userId: 1,
  },
  {
    title: "Overflowing garbage bins — Market area",
    description: "Garbage bins overflowing for 3 days.",
    category: "sanitation",
    priority: "medium",
    status: "in-progress",
    latitude: 12.9660,
    longitude: 77.5780,
    ward: "Ward 13",
    votes: 67,
    userId: 1,
  },
  {
    title: "Fallen tree blocking road",
    description: "Large banyan tree fallen during last night's storm.",
    category: "environment",
    priority: "high",
    status: "resolved",
    latitude: 12.9780,
    longitude: 77.5850,
    ward: "Ward 15",
    votes: 45,
    userId: 1,
  },
  {
    title: "Footpath encroachment by vendors",
    description: "Entire footpath occupied by unauthorized vendors.",
    category: "infrastructure",
    priority: "medium",
    status: "open",
    latitude: 12.9730,
    longitude: 77.6080,
    ward: "Ward 14",
    votes: 93,
    userId: 1,
  },
  {
    title: "Stray dog menace — Residential area",
    description: "Pack of aggressive stray dogs in Indiranagar.",
    category: "safety",
    priority: "medium",
    status: "in-progress",
    latitude: 12.9785,
    longitude: 77.6400,
    ward: "Ward 16",
    votes: 124,
    userId: 1,
  },
];

// Insert reports
for (const report of reportsData) {
  await connection.execute(
    `INSERT INTO civic_reports (title, description, category, priority, status, latitude, longitude, ward, votes, userId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      report.title,
      report.description,
      report.category,
      report.priority,
      report.status,
      report.latitude,
      report.longitude,
      report.ward,
      report.votes,
      report.userId,
    ]
  );
}

// Insert sample daily trends
const trendsData = [];
const categories = ["infrastructure", "utilities", "environment", "safety", "sanitation"];
const today = new Date();

for (let i = 0; i < 30; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  
  for (const category of categories) {
    trendsData.push({
      date,
      category,
      reportCount: Math.floor(Math.random() * 50) + 10,
      resolvedCount: Math.floor(Math.random() * 30) + 5,
      averagePriority: (Math.random() * 3 + 1).toFixed(2),
    });
  }
}

for (const trend of trendsData) {
  await connection.execute(
    `INSERT INTO daily_trends (date, category, reportCount, resolvedCount, averagePriority)
     VALUES (?, ?, ?, ?, ?)`,
    [trend.date, trend.category, trend.reportCount, trend.resolvedCount, trend.averagePriority]
  );
}

// Insert sample hotspots
const hotspotsData = [
  { latitude: 12.9716, longitude: 77.5946, ward: "Ward 14", intensity: 8.5, reportCount: 45, category: "infrastructure" },
  { latitude: 12.9800, longitude: 77.6100, ward: "Ward 15", intensity: 7.2, reportCount: 38, category: "environment" },
  { latitude: 12.9750, longitude: 77.5900, ward: "Ward 14", intensity: 6.8, reportCount: 32, category: "utilities" },
  { latitude: 12.9785, longitude: 77.6400, ward: "Ward 16", intensity: 5.5, reportCount: 28, category: "safety" },
  { latitude: 12.9660, longitude: 77.5780, ward: "Ward 13", intensity: 4.2, reportCount: 18, category: "sanitation" },
];

for (const hotspot of hotspotsData) {
  await connection.execute(
    `INSERT INTO hotspots (latitude, longitude, ward, intensity, reportCount, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [hotspot.latitude, hotspot.longitude, hotspot.ward, hotspot.intensity, hotspot.reportCount, hotspot.category]
  );
}

console.log("✓ Sample data seeded successfully!");
await connection.end();
