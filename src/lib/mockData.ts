export interface Course {
  id?: string;
  name: string;
  duration: number;
  fees: number;
  seats: number;
  collegeId?: string;
}

export interface Review {
  id?: string;
  rating: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
  batch?: number;
  userId?: string;
  userName?: string;
  userImage?: string;
  collegeId?: string;
  createdAt?: string;
}

export interface PredictorData {
  id?: string;
  collegeId?: string;
  exam: string;
  category: string;
  branch: string;
  openingRank: number;
  closingRank: number;
  year: number;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: string;
  established?: number | null;
  ranking?: number | null;
  rating: number;
  reviewCount: number;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  website?: string | null;
  description: string;
  fees: { min: number; max: number; currency: string };
  placements: { averageSalary: number; highestSalary: number; topRecruiters: string[]; placementRate: number };
  facilities: string[];
  courses?: Course[];
  reviews?: Review[];
  predictorData?: PredictorData[];
}

export const INITIAL_COLLEGES: College[] = [
  {
    id: "col_iitb",
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    location: "Main Gate Rd, IIT Area, Powai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Government",
    established: 1958,
    ranking: 1,
    rating: 4.8,
    reviewCount: 1500,
    imageUrl: "https://www.google.com/s2/favicons?domain=iitb.ac.in&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80",
    website: "https://www.iitb.ac.in",
    description: "IIT Bombay is a premier public technical and research university located in Powai, Mumbai, Maharashtra, India. It is widely regarded as one of the top engineering colleges in India.",
    fees: { min: 200000, max: 800000, currency: "INR" },
    placements: {
      averageSalary: 2000000,
      highestSalary: 15000000,
      topRecruiters: ["Google", "Microsoft", "Jane Street", "Optiver"],
      placementRate: 98
    },
    facilities: ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi Campus"],
    courses: [
      { name: "B.Tech Computer Science and Engineering", duration: 4, fees: 800000, seats: 150 },
      { name: "B.Tech Electrical Engineering", duration: 4, fees: 800000, seats: 120 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 800000, seats: 140 }
    ],
    predictorData: [
      { exam: "JEE_ADVANCED", category: "GENERAL", branch: "Computer Science", openingRank: 1, closingRank: 60, year: 2023 },
      { exam: "JEE_ADVANCED", category: "OBC", branch: "Computer Science", openingRank: 1, closingRank: 35, year: 2023 }
    ]
  },
  {
    id: "col_iitd",
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    location: "Hauz Khas",
    city: "New Delhi",
    state: "Delhi",
    type: "Government",
    established: 1961,
    ranking: 2,
    rating: 4.7,
    reviewCount: 1200,
    imageUrl: "https://www.google.com/s2/favicons?domain=home.iitd.ac.in&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=500&fit=crop&q=80",
    website: "https://home.iitd.ac.in",
    description: "IIT Delhi is a globally ranked public technical and research university located in Hauz Khas, Delhi. It offers prestigious programs in engineering, technology, and sciences.",
    fees: { min: 200000, max: 850000, currency: "INR" },
    placements: {
      averageSalary: 1800000,
      highestSalary: 12000000,
      topRecruiters: ["Microsoft", "Google", "Amazon", "McKinsey"],
      placementRate: 95
    },
    facilities: ["Library", "Hostel", "Gym", "Cafeteria", "Medical"],
    courses: [
      { name: "B.Tech Computer Science and Engineering", duration: 4, fees: 850000, seats: 100 },
      { name: "B.Tech Mathematics and Computing", duration: 4, fees: 850000, seats: 60 }
    ],
    predictorData: [
      { exam: "JEE_ADVANCED", category: "GENERAL", branch: "Computer Science", openingRank: 2, closingRank: 100, year: 2023 }
    ]
  },
  {
    id: "col_bitsp",
    name: "BITS Pilani",
    slug: "bits-pilani",
    location: "Vidya Vihar",
    city: "Pilani",
    state: "Rajasthan",
    type: "Private",
    established: 1964,
    ranking: 15,
    rating: 4.6,
    reviewCount: 950,
    imageUrl: "https://www.google.com/s2/favicons?domain=bits-pilani.ac.in&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=500&fit=crop&q=80",
    website: "https://www.bits-pilani.ac.in",
    description: "Birla Institute of Technology & Science, Pilani is an all-India Institute for higher education. It is among the best private engineering colleges in India with a unique zero-attendance policy.",
    fees: { min: 1500000, max: 2500000, currency: "INR" },
    placements: {
      averageSalary: 1600000,
      highestSalary: 6000000,
      topRecruiters: ["Uber", "Amazon", "Swiggy", "Google"],
      placementRate: 92
    },
    facilities: ["Library", "Hostel", "Sports", "Labs", "Auditorium"],
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 2200000, seats: 250 },
      { name: "B.E. Electronics and Instrumentation", duration: 4, fees: 2200000, seats: 150 }
    ],
    predictorData: [
      { exam: "BITSAT", category: "GENERAL", branch: "Computer Science", openingRank: 330, closingRank: 390, year: 2023 }
    ]
  },
  {
    id: "col_nitt",
    name: "National Institute of Technology Trichy",
    slug: "nit-trichy",
    location: "Tanjore Main Road",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "Government",
    established: 1964,
    ranking: 8,
    rating: 4.5,
    reviewCount: 800,
    imageUrl: "https://www.google.com/s2/favicons?domain=nitt.edu&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&h=500&fit=crop&q=80",
    website: "https://www.nitt.edu",
    description: "NIT Trichy is a public technical and research university near the city of Tiruchirappalli. It is consistently ranked as the best NIT in India.",
    fees: { min: 100000, max: 600000, currency: "INR" },
    placements: {
      averageSalary: 1200000,
      highestSalary: 4500000,
      topRecruiters: ["Oracle", "Goldman Sachs", "Amazon", "Intel"],
      placementRate: 90
    },
    facilities: ["Library", "Hostel", "Sports", "Labs", "Hospital"],
    courses: [
      { name: "B.Tech Computer Science and Engineering", duration: 4, fees: 600000, seats: 120 }
    ],
    predictorData: [
      { exam: "JEE_MAIN", category: "GENERAL", branch: "Computer Science", openingRank: 100, closingRank: 1500, year: 2023 }
    ]
  },
  {
    id: "col_aiimsd",
    name: "All India Institute of Medical Sciences Delhi",
    slug: "aiims-delhi",
    location: "Ansari Nagar",
    city: "New Delhi",
    state: "Delhi",
    type: "Government",
    established: 1956,
    ranking: 1,
    rating: 4.9,
    reviewCount: 2000,
    imageUrl: "https://www.google.com/s2/favicons?domain=aiims.edu&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=500&fit=crop&q=80",
    website: "https://www.aiims.edu",
    description: "AIIMS Delhi is a medical college and medical research public university based in New Delhi. It is the best medical college in India.",
    fees: { min: 1000, max: 10000, currency: "INR" },
    placements: {
      averageSalary: 1000000,
      highestSalary: 3000000,
      topRecruiters: ["Apollo", "Fortis", "Max Healthcare", "AIIMS"],
      placementRate: 100
    },
    facilities: ["Library", "Hostel", "Hospital", "Labs", "Auditorium"],
    courses: [
      { name: "MBBS", duration: 5, fees: 6000, seats: 132 }
    ],
    predictorData: [
      { exam: "NEET", category: "GENERAL", branch: "MBBS", openingRank: 1, closingRank: 50, year: 2023 }
    ]
  },
  {
    id: "col_iima",
    name: "Indian Institute of Management Ahmedabad",
    slug: "iim-ahmedabad",
    location: "Vastrapur",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "Government",
    established: 1961,
    ranking: 1,
    rating: 4.9,
    reviewCount: 1800,
    imageUrl: "https://www.google.com/s2/favicons?domain=iima.ac.in&sz=256",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80",
    website: "https://www.iima.ac.in",
    description: "IIM Ahmedabad is a business school located in Ahmedabad, Gujarat, India. It is consistently ranked as the best business school in India.",
    fees: { min: 2500000, max: 3000000, currency: "INR" },
    placements: {
      averageSalary: 3000000,
      highestSalary: 10000000,
      topRecruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs"],
      placementRate: 100
    },
    facilities: ["Library", "Hostel", "Sports", "Labs", "Auditorium"],
    courses: [
      { name: "PGPM", duration: 2, fees: 3000000, seats: 400 }
    ],
    predictorData: [
      { exam: "CAT", category: "GENERAL", branch: "PGPM", openingRank: 99, closingRank: 100, year: 2023 }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    collegeId: "col_iitb",
    rating: 5,
    title: "Best Tech College in India",
    body: "The campus is amazing, professors are brilliant, and the placements are top-notch.",
    pros: "Great placements, brilliant peers",
    cons: "High pressure",
    batch: 2024,
    userName: "Alice"
  },
  {
    collegeId: "col_iitd",
    rating: 4.5,
    title: "Excellent academics",
    body: "Academically rigorous and prepares you well for the industry.",
    pros: "Delhi location, startups",
    cons: "Pollution",
    batch: 2023,
    userName: "Bob"
  }
];

const EXTRA_DEFS: [string,string,string,string,string,number,number,number,number,number,number,string[],string][] = [
  ["IIT Madras","iit-madras","Chennai","Tamil Nadu","Government",1959,3,4.8,1900000,14000000,97,["Google","Microsoft","Qualcomm","Intel"],"JEE_ADVANCED"],
  ["IIT Kanpur","iit-kanpur","Kanpur","Uttar Pradesh","Government",1959,4,4.7,1700000,12000000,95,["Microsoft","Samsung","Goldman Sachs"],"JEE_ADVANCED"],
  ["IIT Kharagpur","iit-kharagpur","Kharagpur","West Bengal","Government",1951,5,4.6,1600000,11000000,94,["Google","Amazon","Deloitte"],"JEE_ADVANCED"],
  ["IIT Roorkee","iit-roorkee","Roorkee","Uttarakhand","Government",1847,6,4.5,1500000,9000000,92,["Adobe","Samsung","Oracle"],"JEE_ADVANCED"],
  ["IIT Guwahati","iit-guwahati","Guwahati","Assam","Government",1994,7,4.4,1400000,8000000,90,["Amazon","Flipkart","TCS"],"JEE_ADVANCED"],
  ["IIT Hyderabad","iit-hyderabad","Hyderabad","Telangana","Government",2008,9,4.4,1500000,10000000,91,["Google","Microsoft","Amazon"],"JEE_ADVANCED"],
  ["IIT BHU","iit-bhu","Varanasi","Uttar Pradesh","Government",1919,10,4.3,1300000,7500000,89,["Flipkart","Samsung","Tata"],"JEE_ADVANCED"],
  ["NIT Warangal","nit-warangal","Warangal","Telangana","Government",1959,11,4.3,1100000,4000000,88,["Amazon","Infosys","TCS"],"JEE_MAIN"],
  ["NIT Surathkal","nit-surathkal","Mangalore","Karnataka","Government",1960,12,4.3,1200000,4500000,89,["Oracle","Cisco","Infosys"],"JEE_MAIN"],
  ["NIT Rourkela","nit-rourkela","Rourkela","Odisha","Government",1961,14,4.1,1000000,3500000,85,["SAIL","TCS","Wipro"],"JEE_MAIN"],
  ["NIT Calicut","nit-calicut","Kozhikode","Kerala","Government",1961,16,4.0,950000,3000000,84,["UST","TCS","Infosys"],"JEE_MAIN"],
  ["VIT Vellore","vit-vellore","Vellore","Tamil Nadu","Private",1984,17,4.2,1400000,5000000,88,["Cognizant","Infosys","Amazon"],"JEE_MAIN"],
  ["Manipal IT","manipal-it","Manipal","Karnataka","Private",1957,18,4.1,1800000,5500000,87,["Goldman Sachs","Cisco","SAP"],"JEE_MAIN"],
  ["IIIT Hyderabad","iiit-hyderabad","Hyderabad","Telangana","Deemed",1998,13,4.5,1600000,9000000,93,["Google","Microsoft","Uber"],"JEE_MAIN"],
  ["DTU Delhi","dtu-delhi","New Delhi","Delhi","Government",1941,19,4.2,1300000,6000000,90,["Amazon","Flipkart","Samsung"],"JEE_MAIN"],
  ["NSUT Delhi","nsut-delhi","New Delhi","Delhi","Government",1983,20,4.1,1200000,5500000,88,["Microsoft","Zomato","Paytm"],"JEE_MAIN"],
  ["IIM Bangalore","iim-bangalore","Bangalore","Karnataka","Government",1973,2,4.8,2800000,9500000,100,["McKinsey","BCG","Amazon"],"CAT"],
  ["IIM Calcutta","iim-calcutta","Kolkata","West Bengal","Government",1961,3,4.7,2700000,9000000,100,["Goldman Sachs","JP Morgan","Bain"],"CAT"],
  ["IIM Lucknow","iim-lucknow","Lucknow","Uttar Pradesh","Government",1984,4,4.5,2400000,7000000,98,["Deloitte","EY","KPMG"],"CAT"],
  ["IIM Kozhikode","iim-kozhikode","Kozhikode","Kerala","Government",1996,5,4.4,2200000,6500000,97,["Accenture","HSBC","Flipkart"],"CAT"],
  ["IIM Indore","iim-indore","Indore","Madhya Pradesh","Government",1996,6,4.3,2100000,6000000,96,["Amazon","Deloitte","TCS"],"CAT"],
  ["CMC Vellore","cmc-vellore","Vellore","Tamil Nadu","Private",1900,2,4.8,500000,1500000,100,["CMC Hospital","Apollo","Fortis"],"NEET"],
  ["Manipal Medical","manipal-medical","Manipal","Karnataka","Private",1953,10,4.3,2500000,1500000,95,["Manipal Hospital","Fortis","Max"],"NEET"],
  ["JIPMER","jipmer","Puducherry","Tamil Nadu","Government",1823,3,4.7,50000,1200000,98,["JIPMER","AIIMS","PGI"],"NEET"],
  ["BITS Goa","bits-goa","Goa","Goa","Private",2004,22,4.3,2000000,7000000,90,["Microsoft","Google","Goldman Sachs"],"BITSAT"],
  ["BITS Hyderabad","bits-hyderabad","Hyderabad","Telangana","Private",2008,23,4.2,2000000,6500000,88,["Amazon","Samsung","Deloitte"],"BITSAT"],
  ["SRM Chennai","srm-chennai","Chennai","Tamil Nadu","Private",1985,25,3.9,1600000,4000000,82,["TCS","Infosys","Wipro"],"JEE_MAIN"],
  ["Amity Noida","amity-noida","Noida","Uttar Pradesh","Private",2003,30,3.7,1400000,3000000,78,["Wipro","HCL","Tech Mahindra"],"JEE_MAIN"],
  ["Jadavpur Univ","jadavpur-university","Kolkata","West Bengal","Government",1955,21,4.3,50000,400000,85,["TCS","Cognizant","Infosys"],"JEE_MAIN"],
  ["Anna University","anna-university","Chennai","Tamil Nadu","Government",1978,24,4.0,100000,500000,83,["TCS","Zoho","Infosys"],"STATE_CET"],
  ["COEP Pune","coep-pune","Pune","Maharashtra","Government",1854,26,4.1,200000,600000,86,["Persistent","Infosys","TCS"],"JEE_MAIN"],
  ["VJTI Mumbai","vjti-mumbai","Mumbai","Maharashtra","Government",1887,27,4.0,150000,500000,84,["L&T","TCS","Godrej"],"JEE_MAIN"],
  ["PEC Chandigarh","pec-chandigarh","Chandigarh","Punjab","Government",1921,28,3.9,200000,600000,82,["Infosys","TCS","HCL"],"JEE_MAIN"],
  ["Thapar Patiala","thapar-patiala","Patiala","Punjab","Private",1956,29,4.0,1400000,4000000,84,["Amazon","Flipkart","Zomato"],"JEE_MAIN"],
  ["PSG Tech","psg-tech","Coimbatore","Tamil Nadu","Private",1951,31,3.9,400000,1000000,82,["Zoho","TCS","CTS"],"STATE_CET"],
  ["RVCE Bangalore","rvce-bangalore","Bangalore","Karnataka","Private",1963,32,3.9,800000,2000000,83,["Infosys","Wipro","TCS"],"STATE_CET"],
  ["MSRIT Bangalore","msrit-bangalore","Bangalore","Karnataka","Private",1962,33,3.8,900000,2200000,81,["Infosys","Wipro","IBM"],"STATE_CET"],
  ["BMS Bangalore","bms-bangalore","Bangalore","Karnataka","Private",1946,34,3.8,700000,1800000,80,["TCS","Infosys","HCL"],"STATE_CET"],
  ["NIT Jaipur","nit-jaipur","Jaipur","Rajasthan","Government",1963,35,4.0,600000,3000000,84,["Amazon","TCS","Infosys"],"JEE_MAIN"],
  ["NIT Bhopal","nit-bhopal","Bhopal","Madhya Pradesh","Government",1960,36,3.9,500000,2500000,82,["TCS","Infosys","Wipro"],"JEE_MAIN"],
  ["IIIT Delhi","iiit-delhi","New Delhi","Delhi","Government",2008,15,4.4,1500000,8000000,92,["Google","Amazon","Uber"],"JEE_MAIN"],
  ["IIT Indore","iit-indore","Indore","Madhya Pradesh","Government",2009,11,4.3,1400000,8500000,90,["Microsoft","Amazon","Goldman Sachs"],"JEE_ADVANCED"],
  ["IIT Gandhinagar","iit-gandhinagar","Gandhinagar","Gujarat","Government",2008,12,4.2,1300000,7000000,89,["Google","Qualcomm","Texas Instruments"],"JEE_ADVANCED"],
  ["NIT Allahabad","nit-allahabad","Prayagraj","Uttar Pradesh","Government",1961,37,3.9,500000,2800000,83,["Amazon","TCS","Infosys"],"JEE_MAIN"],

  ["AFMC Pune","afmc-pune","Pune","Maharashtra","Government",1948,2,4.8,1200000,2000000,100,["Army Hospital","Apollo","Fortis"],"NEET"],
  ["KGMU Lucknow","kgmu-lucknow","Lucknow","Uttar Pradesh","Government",1911,5,4.7,1000000,1800000,99,["KGMU","Max","Medanta"],"NEET"],
  ["MAMC New Delhi","mamc-delhi","New Delhi","Delhi","Government",1958,4,4.8,1100000,1900000,100,["LNJP","GB Pant","Apollo"],"NEET"],
  ["Grant Medical College","grant-medical-mumbai","Mumbai","Maharashtra","Government",1845,7,4.6,900000,1500000,98,["JJ Hospital","Hinduja","Breach Candy"],"NEET"],
  ["SJMC Bangalore","sjmc-bangalore","Bangalore","Karnataka","Private",1963,12,4.5,800000,1400000,95,["St Johns","Manipal","Apollo"],"NEET"],
  ["KMC Mangalore","kmc-mangalore","Mangalore","Karnataka","Private",1955,15,4.4,900000,1600000,96,["KMC","Fortis","Max"],"NEET"],
  ["IMS BHU Varanasi","ims-bhu","Varanasi","Uttar Pradesh","Government",1960,6,4.7,1100000,2000000,100,["BHU","Apollo","Medanta"],"NEET"],
  ["Madras Medical College","mmc-chennai","Chennai","Tamil Nadu","Government",1835,8,4.6,1000000,1700000,99,["Rajiv Gandhi Govt","Apollo","MIOT"],"NEET"],
  ["IIM Rohtak","iim-rohtak","Rohtak","Haryana","Government",2009,12,4.3,1600000,3600000,98,["Deloitte","KPMG","ICICI"],"CAT"],
  ["IIM Ranchi","iim-ranchi","Ranchi","Jharkhand","Government",2009,15,4.2,1600000,3200000,97,["Capgemini","Cognizant","Tata Steel"],"CAT"],
  ["IIM Raipur","iim-raipur","Raipur","Chhattisgarh","Government",2010,14,4.2,1500000,3000000,98,["Accenture","Infosys","Wipro"],"CAT"],
  ["IIM Trichy","iim-trichy","Tiruchirappalli","Tamil Nadu","Government",2011,18,4.1,1500000,3400000,96,["Amazon","TCS","JP Morgan"],"CAT"],
  ["IIM Udaipur","iim-udaipur","Udaipur","Rajasthan","Government",2011,16,4.2,1400000,3200000,97,["Bain","Cognizant","ICICI"],"CAT"],
  ["FMS Delhi","fms-delhi","New Delhi","Delhi","Government",1954,4,4.8,3200000,5800000,100,["McKinsey","BCG","TAS"],"CAT"],
  ["SPJIMR Mumbai","spjimr-mumbai","Mumbai","Maharashtra","Private",1981,8,4.6,2600000,5300000,100,["Amazon","HUL","P&G"],"CAT"],
  ["MDI Gurgaon","mdi-gurgaon","Gurgaon","Haryana","Private",1973,10,4.5,2300000,4500000,99,["Deloitte","PwC","Goldman Sachs"],"CAT"],
  ["JBIMS Mumbai","jbims-mumbai","Mumbai","Maharashtra","Government",1965,9,4.7,2700000,4200000,100,["McKinsey","Reliance","HDFC"],"CAT"],
  ["IIFT New Delhi","iift-delhi","New Delhi","Delhi","Government",1963,11,4.5,2100000,4600000,98,["ITC","Godrej","Amazon"],"CAT"],
];

export function generateExtraColleges(): College[] {
  const BANNERS = [
    "1541339907198-e08756dedf3f",
    "1498243691581-b145c3f54a5a", 
    "1521587760476-6c12a4b040da", 
    "1606761568499-6d2451b23c66", 
    "1517245386807-bb43f82c33c4"
  ];
  return EXTRA_DEFS.map(([name,slug,city,state,type,est,rank,rating,avgSal,highSal,placRate,recruiters,exam], idx) => {
    const domain = `${slug.replace(/-/g,'')}.ac.in`;
    const bnrId = BANNERS[slug.length % BANNERS.length];
    return {
    id: `col_${slug.replace(/-/g,'')}`,
    name, slug, location: city, city, state, type,
    established: est, ranking: rank, rating: rating as number,
    reviewCount: Math.floor(200 + Math.random()*800),
    imageUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`, 
    bannerUrl: `https://images.unsplash.com/photo-${bnrId}?w=1200&h=500&fit=crop&q=80`,
    website: `https://www.${domain}`,
    description: `${name} is a premier ${type.toLowerCase()} institution in ${city}, ${state}, renowned for academic excellence and strong industry connections.`,
    fees: { min: type==="Government"?100000:800000, max: type==="Government"?800000:2500000, currency: "INR" },
    placements: { averageSalary: avgSal as number, highestSalary: highSal as number, topRecruiters: recruiters as string[], placementRate: placRate as number },
    facilities: ["Library","Hostel","Sports Complex","Labs","Wi-Fi Campus","Cafeteria"],
    courses: exam === "NEET" ? [
      { name: "MBBS", duration: 5, fees: type==="Government"?50000:1500000, seats: 150 },
      { name: "BDS", duration: 5, fees: type==="Government"?40000:1000000, seats: 50 },
    ] : exam === "CAT" ? [
      { name: "MBA / PGDM", duration: 2, fees: type==="Government"?1500000:2500000, seats: 240 },
      { name: "Executive MBA", duration: 1, fees: type==="Government"?1200000:2000000, seats: 60 },
    ] : [
      { name: "B.Tech Computer Science", duration: 4, fees: type==="Government"?600000:2000000, seats: 120 },
      { name: "B.Tech Electronics & Communication", duration: 4, fees: type==="Government"?550000:1800000, seats: 90 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: type==="Government"?500000:1600000, seats: 100 }
    ],
    predictorData: exam === "NEET" ? [
      { exam: exam as string, category: "GENERAL", branch: "MBBS", openingRank: rank*10, closingRank: rank*50, year: 2023 },
      { exam: exam as string, category: "GENERAL", branch: "BDS", openingRank: rank*60, closingRank: rank*150, year: 2023 },
    ] : exam === "CAT" ? [
      { exam: exam as string, category: "GENERAL", branch: "MBA", openingRank: 99, closingRank: 100, year: 2023 },
    ] : [
      { exam: exam as string, category: "GENERAL", branch: "Computer Science", openingRank: rank*100, closingRank: rank*300, year: 2023 },
      { exam: exam as string, category: "GENERAL", branch: "ECE", openingRank: rank*250, closingRank: rank*550, year: 2023 },
      { exam: exam as string, category: "GENERAL", branch: "Mechanical", openingRank: rank*400, closingRank: rank*900, year: 2023 }
    ]
  };
  });
}

export const ALL_COLLEGES = [...INITIAL_COLLEGES, ...generateExtraColleges()];
