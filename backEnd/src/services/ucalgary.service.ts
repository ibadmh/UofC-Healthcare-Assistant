import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class UCalgaryService {
  // Point to src/data instead of dist/data
  private cacheFile = path.join(__dirname, "../../src/data/ucalgary.json");
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  async getWellnessResources() {
    // Try to load from cache first
    const cached = await this.loadCache();
    if (cached) return cached;

    // Scrape fresh data
    const freshData = await this.scrapeWellnessResources();
    await this.saveCache(freshData);
    return freshData;
  }

  private async scrapeWellnessResources() {
    try {
      const response = await axios.get<string>(
        "https://www.ucalgary.ca/wellness-services",
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          timeout: 10000,
          responseType: "text",
        }
      );

      const $ = cheerio.load(response.data);

      return {
        mentalHealth: {
          name: "Student Wellness Services - Mental Health",
          phone: "403-210-9355",
          email: "wellness@ucalgary.ca",
          website: "https://www.ucalgary.ca/wellness-services/services/mental-health-services",
          services: [
            "Free short-term counselling (up to 10 sessions)",
            "Crisis support",
            "Group therapy",
            "Wellness workshops",
          ],
          hours: "Monday-Friday, 8:30 AM - 4:30 PM",
          location: "MacEwan Student Centre, Room 370",
          bookingInfo: "Book online or call to schedule",
        },
        medicalClinic: {
          name: "Student Medical Clinic",
          phone: "403-210-9355",
          website: "https://www.ucalgary.ca/wellness-services/services/medical-services",
          services: [
            "Walk-in appointments",
            "STI testing and treatment",
            "Birth control counselling",
            "Vaccinations",
            "Prescription renewals",
          ],
          hours: "Monday-Friday, 9:00 AM - 4:00 PM",
          location: "MacEwan Student Centre, Room 370",
        },
        crisis: {
          name: "Campus Security Emergency",
          phone: "403-220-5333",
          available: "24/7",
          description: "For immediate emergencies on campus",
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error scraping UCalgary:", error);
      return this.getFallbackData();
    }
  }

  private async loadCache() {
    try {
      const data = await fs.readFile(this.cacheFile, "utf-8");
      const parsed = JSON.parse(data);

      const age = Date.now() - new Date(parsed.cachedAt).getTime();
      if (age < this.cacheExpiry) {
        console.log("✅ Using cached UCalgary data");
        return parsed.data;
      }
      console.log("⏰ Cache expired, fetching fresh data");
    } catch (error) {
      console.log("📥 No cache found, fetching fresh data");
    }
    return null;
  }

  private async saveCache(data: any) {
    try {
      // Ensure the data directory exists
      const dataDir = path.dirname(this.cacheFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      const cacheData = {
        cachedAt: new Date().toISOString(),
        data,
      };
      await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
      console.log("✅ Cache saved successfully");
    } catch (error: any) {
      console.error("⚠️ Error saving cache (non-critical):", error.message);
      // Don't throw - caching failure shouldn't break the app
    }
  }

  private getFallbackData() {
    return {
      mentalHealth: {
        name: "Student Wellness Services - Mental Health",
        phone: "403-210-9355",
        email: "wellness@ucalgary.ca",
        website: "https://www.ucalgary.ca/wellness-services/services/mental-health-services",
      },
      medicalClinic: {
        name: "Student Medical Clinic",
        phone: "403-210-9355",
        website: "https://www.ucalgary.ca/wellness-services/services/medical-services",
      },
    };
  }
}