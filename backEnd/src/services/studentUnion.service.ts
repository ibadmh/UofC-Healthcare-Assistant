export class StudentUnionService {
  getResources() {
    return {
      insurance: {
        name: "StudentCare Health & Dental Plan",
        website: "https://www.studentcare.ca/rte/en/UniversityofCalgaryStudentsUnion_Home",
        coverage: {
          mentalHealth: "Up to $1,500/year for psychologists and counsellors",
          dental: "80% coverage up to $750/year",
          vision: "$200 every 24 months",
          prescription: "80% coverage",
        },
        phone: "1-866-369-2800",
      },
      foodSecurity: {
        name: "SU Food Bank",
        location: "MacEwan Student Centre, Room 251",
        hours: "Monday-Friday, 10:00 AM - 4:00 PM",
        services: ["Free groceries for students", "No ID required", "Confidential"],
        website: "https://www.su.ucalgary.ca/programs-services/student-support/food-bank/",
      },
      peerSupport: {
        name: "SU Peer Support Centre",
        description: "Free, confidential peer support for students",
        services: [
          "One-on-one support",
          "Group sessions",
          "Academic stress support",
          "Mental health peer support",
        ],
        website: "https://www.su.ucalgary.ca/programs-services/student-support/peer-support/",
      },
      advocacy: {
        name: "SU Student Advocacy",
        description: "Free support for academic appeals and disputes",
        phone: "403-220-6551",
        website: "https://www.su.ucalgary.ca/programs-services/student-support/student-advocacy/",
      },
    };
  }
}