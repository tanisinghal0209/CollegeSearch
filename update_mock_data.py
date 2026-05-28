import re

with open("src/lib/mockData.ts", "r") as f:
    content = f.read()

# 1. Add extra colleges to EXTRA_DEFS array
new_colleges = """
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
"""

content = content.replace("];\n\nexport function generateExtraColleges()", new_colleges + "];\n\nexport function generateExtraColleges()")

# 2. Update dynamic generation block
old_block = """    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: type==="Government"?600000:2000000, seats: 120 },
      { name: "B.Tech Electronics & Communication", duration: 4, fees: type==="Government"?550000:1800000, seats: 90 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: type==="Government"?500000:1600000, seats: 100 }
    ],
    predictorData: [
      { exam: exam as string, category: "GENERAL", branch: "Computer Science", openingRank: rank*100, closingRank: rank*300, year: 2023 },
      { exam: exam as string, category: "GENERAL", branch: "ECE", openingRank: rank*250, closingRank: rank*550, year: 2023 },
      { exam: exam as string, category: "GENERAL", branch: "Mechanical", openingRank: rank*400, closingRank: rank*900, year: 2023 }
    ]"""

new_block = """    courses: exam === "NEET" ? [
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
    ]"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("src/lib/mockData.ts", "w") as f:
        f.write(content)
    print("Successfully updated mockData.ts")
else:
    print("Could not find the block to replace!")

