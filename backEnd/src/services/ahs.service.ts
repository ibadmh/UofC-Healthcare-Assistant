import axios from "axios";
import * as cheerio from "cheerio";

export class AHSService {
  async getResources() {
    return {
      healthLink: {
        name: "Health Link 811",
        phone: "811",
        description: "24/7 health advice from registered nurses",
        website: "https://www.albertahealthservices.ca/assets/healthinfo/link/index.html",
        whenToCall: [
          "You need health advice",
          "You're not sure if you should go to the emergency room",
          "You need information about health services in Alberta",
        ],
      },
      mentalHealthHelpLine: {
        name: "Mental Health Help Line",
        phone: "1-877-303-2642",
        description: "24/7 mental health support and crisis intervention",
        available: "24/7",
      },
      addictionHelpLine: {
        name: "Addiction Help Line",
        phone: "1-866-332-2322",
        description: "24/7 support for substance use concerns",
        available: "24/7",
      },
      distressCentre: {
        name: "Distress Centre Calgary",
        phone: "403-266-4357",
        text: "587-333-2724",
        description: "24/7 crisis support and suicide prevention",
        website: "https://www.distresscentre.com",
      },
      urgentCare: [
        {
          name: "Sheldon M. Chumir Health Centre",
          address: "1213 4 St SW, Calgary, AB",
          phone: "403-955-6200",
          hours: "24/7",
          services: ["Urgent care", "Mental health crisis support"],
        },
        {
          name: "South Health Campus Urgent Care",
          address: "4448 Front St SE, Calgary, AB",
          phone: "403-956-1300",
          hours: "24/7",
        },
      ],
      emergencyRooms: [
        {
          name: "Foothills Medical Centre",
          address: "1403 29 St NW, Calgary, AB",
          phone: "403-944-1110",
          distance: "Closest to UofC Main Campus",
        },
        {
          name: "Peter Lougheed Centre",
          address: "3500 26 Ave NE, Calgary, AB",
          phone: "403-943-4555",
        },
      ],
    };
  }

  async searchClinics(location: string = "Calgary") {
    // In production, this would call AHS API or scrape their website
    return [
      {
        name: "Sheldon M. Chumir Health Centre",
        type: "Urgent Care & Walk-in",
        address: "1213 4 St SW, Calgary",
        phone: "403-955-6200",
        hours: "24/7",
      },
      {
        name: "Calgary Sexual Health Centre",
        type: "Sexual Health Clinic",
        address: "301 14 St NW, Calgary",
        phone: "403-283-5580",
        services: ["STI testing", "Birth control", "Pregnancy testing"],
      },
    ];
  }
}