/**
 * VTU Curriculum — Subject definitions per Scheme → Year → Branch → Semester
 *
 * Drive links are managed separately via Google Sheets (see app-config.ts).
 * This file defines the stable curriculum structure.
 *
 * Schemes: 2025, 2022, 2021, 2018
 */

export const SCHEMES = ["2025 Scheme", "2022 Scheme", "2021 Scheme", "2018 Scheme"] as const;
export type Scheme = typeof SCHEMES[number];

export const YEARS = ["First Year", "Second Year", "Third Year", "Fourth Year"] as const;
export type Year = typeof YEARS[number];

export const BRANCHES = [
  "Computer Science and Engineering (CSE)",
  "Information Science and Engineering (ISE)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical and Electronics Engineering (EEE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Artificial Intelligence and Machine Learning (AIML)",
  "Computer Science and Business Systems (CSBS)",
  "Electronics and Telecommunication Engineering (ETE)",
  "Industrial Engineering and Management (IEM)",
] as const;
export type Branch = typeof BRANCHES[number];

export interface SubjectEntry {
  code: string;
  name: string;
  type?: "theory" | "lab" | "project";
}

export type SemesterMap = Record<string, SubjectEntry[]>;

// ─────────────────────────────────────────────────────────────────────────────
// 2025 SCHEME
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS_2025: Record<string, SemesterMap> = {
  // First Year is common for ALL branches
  "First Year": {
    "Physics Cycle": [
      { code: "BMA101", name: "Engineering Mathematics - I" },
      { code: "BPH102", name: "Engineering Physics" },
      { code: "BCEE103", name: "Elements of Civil Engineering & Mechanics" },
      { code: "BENGK104", name: "Engineering Graphics" },
      { code: "BKXC105", name: "Communicative English (HSMC)" },
      { code: "BKSK106", name: "Kannada / Constitution of India (HSMC)" },
      { code: "BPH107", name: "Engineering Physics Lab" },
      { code: "BWSK108", name: "Workshop / Civil Engineering Lab" },
      { code: "BKCK109", name: "Computer Aided Engineering Drawing Lab" },
    ],
    "Chemistry Cycle": [
      { code: "BMA201", name: "Engineering Mathematics - II" },
      { code: "BCH202", name: "Engineering Chemistry" },
      { code: "BEEE203", name: "Elements of Electrical Engineering" },
      { code: "BCS204", name: "C Programming for Problem Solving" },
      { code: "BCPE205", name: "Constitution of India & Professional Ethics" },
      { code: "BKSK206", name: "Kannada / Sanskrit (HSMC)" },
      { code: "BCH207", name: "Engineering Chemistry Lab" },
      { code: "BCS208", name: "C Programming Lab" },
      { code: "BPWL209", name: "Physical Education / Yoga" },
    ],
  },

  // CSE
  "Computer Science and Engineering (CSE)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BCS302", name: "Discrete Mathematical Structures" },
      { code: "BCS303", name: "Digital Electronics" },
      { code: "BCS304", name: "Data Structures and Applications" },
      { code: "BCS306A", name: "Object Oriented Programming with Java" },
      { code: "BCS357", name: "Data Structures Lab" },
      { code: "BCS358", name: "Digital Electronics Lab" },
      { code: "BNSK359", name: "Samskrutika Kannada" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BCS401", name: "Analysis and Design of Algorithms" },
      { code: "BCS402", name: "Microcontrollers" },
      { code: "BCS403", name: "Operating Systems" },
      { code: "BCS404", name: "Software Engineering & Project Management" },
      { code: "BCS457", name: "ADA Lab" },
      { code: "BCS458", name: "Microcontrollers Lab" },
      { code: "BPWL459", name: "Ability Enhancement Course" },
    ],
    "Semester 5": [
      { code: "BCS501", name: "Automata Theory & Compiler Design" },
      { code: "BCS502", name: "Computer Networks" },
      { code: "BCS503", name: "Database Management System" },
      { code: "BCS504", name: "System Software & OS Lab" },
      { code: "BCS505A", name: "Elective I: Artificial Intelligence" },
      { code: "BCS505B", name: "Elective I: Cloud Computing" },
      { code: "BCS505C", name: "Elective I: Internet of Things" },
      { code: "BCS557", name: "DBMS Lab" },
      { code: "BCS558", name: "CN Lab" },
    ],
    "Semester 6": [
      { code: "BCS601", name: "Machine Learning" },
      { code: "BCS602", name: "Computer Graphics and Visualization" },
      { code: "BCS603", name: "System Design" },
      { code: "BCS606A", name: "Elective II: Big Data Analytics" },
      { code: "BCS606B", name: "Elective II: Cyber Security" },
      { code: "BCS606C", name: "Elective II: Natural Language Processing" },
      { code: "BCS657", name: "ML Lab" },
      { code: "BCS658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BCS701", name: "Cryptography & Network Security" },
      { code: "BCS702", name: "Deep Learning" },
      { code: "BCS703A", name: "Elective III: Blockchain Technology" },
      { code: "BCS703B", name: "Elective III: Software Testing" },
      { code: "BCS703C", name: "Elective III: Distributed Systems" },
      { code: "BINP707", name: "Internship" },
      { code: "BCS757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BCS801A", name: "Elective IV: Quantum Computing" },
      { code: "BCS801B", name: "Elective IV: Edge Computing" },
      { code: "BCS801C", name: "Elective IV: AR/VR Technologies" },
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // ISE
  "Information Science and Engineering (ISE)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BIS302", name: "Discrete Mathematical Structures" },
      { code: "BIS303", name: "Digital Electronics" },
      { code: "BIS304", name: "Data Structures and Applications" },
      { code: "BIS306A", name: "Object Oriented Programming with Java" },
      { code: "BIS357", name: "Data Structures Lab" },
      { code: "BIS358", name: "Digital Electronics Lab" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BIS401", name: "Analysis and Design of Algorithms" },
      { code: "BIS402", name: "Microcontrollers" },
      { code: "BIS403", name: "Operating Systems" },
      { code: "BIS404", name: "Software Engineering & Project Management" },
      { code: "BIS457", name: "ADA Lab" },
      { code: "BIS458", name: "Microcontrollers Lab" },
    ],
    "Semester 5": [
      { code: "BIS501", name: "Automata Theory & Compiler Design" },
      { code: "BIS502", name: "Computer Networks" },
      { code: "BIS503", name: "Database Management System" },
      { code: "BIS505A", name: "Elective I: Artificial Intelligence" },
      { code: "BIS505B", name: "Elective I: Big Data" },
      { code: "BIS557", name: "DBMS Lab" },
      { code: "BIS558", name: "CN Lab" },
    ],
    "Semester 6": [
      { code: "BIS601", name: "Machine Learning" },
      { code: "BIS602", name: "Information Security" },
      { code: "BIS603", name: "System Design" },
      { code: "BIS606A", name: "Elective II: Cloud Computing" },
      { code: "BIS606B", name: "Elective II: Cyber Security" },
      { code: "BIS657", name: "ML Lab" },
      { code: "BIS658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BIS701", name: "Cryptography & Network Security" },
      { code: "BIS702", name: "Deep Learning" },
      { code: "BIS703A", name: "Elective III: Blockchain" },
      { code: "BIS703B", name: "Elective III: Software Testing" },
      { code: "BIS757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BIS801A", name: "Elective IV: Advanced Topics in IS" },
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // ECE
  "Electronics and Communication Engineering (ECE)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BEC302", name: "Network Analysis" },
      { code: "BEC303", name: "Electronic Devices" },
      { code: "BEC304", name: "Signals and Systems" },
      { code: "BEC306A", name: "C Programming" },
      { code: "BEC357", name: "Electronics Devices Lab" },
      { code: "BEC358", name: "Simulation Lab" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BEC401", name: "Analog Electronics" },
      { code: "BEC402", name: "Digital Electronics" },
      { code: "BEC403", name: "Engineering Electromagnetics" },
      { code: "BEC404", name: "Linear Integrated Circuits" },
      { code: "BEC457", name: "Analog Electronics Lab" },
      { code: "BEC458", name: "Digital Electronics Lab" },
    ],
    "Semester 5": [
      { code: "BEC501", name: "Digital Communication" },
      { code: "BEC502", name: "Microcontrollers & Embedded Systems" },
      { code: "BEC503", name: "DSP Algorithms & Architecture" },
      { code: "BEC505A", name: "Elective I: VLSI Design" },
      { code: "BEC505B", name: "Elective I: RF & Microwave Engineering" },
      { code: "BEC557", name: "DSP Lab" },
      { code: "BEC558", name: "Microcontrollers Lab" },
    ],
    "Semester 6": [
      { code: "BEC601", name: "Wireless Communication" },
      { code: "BEC602", name: "Antenna & Wave Propagation" },
      { code: "BEC603", name: "VLSI Design" },
      { code: "BEC606A", name: "Elective II: Satellite Communication" },
      { code: "BEC606B", name: "Elective II: IoT" },
      { code: "BEC657", name: "VLSI Design Lab" },
      { code: "BEC658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BEC701", name: "5G & Emerging Wireless Technologies" },
      { code: "BEC702", name: "Machine Learning for Engineers" },
      { code: "BEC703A", name: "Elective III: Optical Communication" },
      { code: "BEC703B", name: "Elective III: Image Processing" },
      { code: "BEC757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BEC801A", name: "Elective IV: Advanced Communication Systems" },
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // EEE
  "Electrical and Electronics Engineering (EEE)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BEE302", name: "DC Machines & Transformers" },
      { code: "BEE303", name: "Network Analysis" },
      { code: "BEE304", name: "Electronic Devices & Circuits" },
      { code: "BEE306A", name: "C Programming" },
      { code: "BEE357", name: "DC Machines Lab" },
      { code: "BEE358", name: "Electronic Devices Lab" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BEE401", name: "AC Machines" },
      { code: "BEE402", name: "Signals and Systems" },
      { code: "BEE403", name: "Power Systems - I" },
      { code: "BEE404", name: "Measurement & Instrumentation" },
      { code: "BEE457", name: "AC Machines Lab" },
      { code: "BEE458", name: "Measurements Lab" },
    ],
    "Semester 5": [
      { code: "BEE501", name: "Power Electronics" },
      { code: "BEE502", name: "Control Systems" },
      { code: "BEE503", name: "Power Systems - II" },
      { code: "BEE505A", name: "Elective I: Renewable Energy Systems" },
      { code: "BEE557", name: "Power Electronics Lab" },
      { code: "BEE558", name: "Control Systems Lab" },
    ],
    "Semester 6": [
      { code: "BEE601", name: "Power System Analysis" },
      { code: "BEE602", name: "Electric Drives" },
      { code: "BEE603", name: "High Voltage Engineering" },
      { code: "BEE657", name: "Electric Drives Lab" },
      { code: "BEE658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BEE701", name: "Smart Grid" },
      { code: "BEE702", name: "Flexible AC Transmission Systems" },
      { code: "BEE757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // ME
  "Mechanical Engineering (ME)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BME302", name: "Material Science & Metallurgy" },
      { code: "BME303", name: "Mechanics of Materials" },
      { code: "BME304", name: "Thermodynamics" },
      { code: "BME357", name: "Material Testing Lab" },
      { code: "BME358", name: "Fluid Mechanics Lab" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BME401", name: "Kinematics of Machines" },
      { code: "BME402", name: "Fluid Mechanics" },
      { code: "BME403", name: "Manufacturing Process - I" },
      { code: "BME404", name: "Heat & Mass Transfer" },
      { code: "BME457", name: "Machine Shop Lab" },
      { code: "BME458", name: "CAD Lab" },
    ],
    "Semester 5": [
      { code: "BME501", name: "Dynamics of Machines" },
      { code: "BME502", name: "Turbo Machines" },
      { code: "BME503", name: "Manufacturing Process - II" },
      { code: "BME557", name: "Dynamics Lab" },
      { code: "BME558", name: "Computer Aided Manufacturing Lab" },
    ],
    "Semester 6": [
      { code: "BME601", name: "Finite Element Analysis" },
      { code: "BME602", name: "Design of Machine Elements" },
      { code: "BME603", name: "Heat Transfer Lab" },
      { code: "BME657", name: "FEA Lab" },
      { code: "BME658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BME701", name: "Operation Research" },
      { code: "BME702", name: "Robotics" },
      { code: "BME757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // CE
  "Civil Engineering (CE)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BCE302", name: "Strength of Materials" },
      { code: "BCE303", name: "Fluid Mechanics" },
      { code: "BCE304", name: "Building Materials & Construction" },
      { code: "BCE357", name: "Fluid Mechanics Lab" },
      { code: "BCE358", name: "Survey Lab - I" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BCE401", name: "Structural Analysis - I" },
      { code: "BCE402", name: "Hydraulics & Hydraulic Machinery" },
      { code: "BCE403", name: "Soil Mechanics" },
      { code: "BCE404", name: "Concrete Technology" },
      { code: "BCE457", name: "Soil Testing Lab" },
      { code: "BCE458", name: "Survey Lab - II" },
    ],
    "Semester 5": [
      { code: "BCE501", name: "Structural Analysis - II" },
      { code: "BCE502", name: "Water Supply & Treatment Engineering" },
      { code: "BCE503", name: "Transportation Engineering - I" },
      { code: "BCE557", name: "Concrete Lab" },
      { code: "BCE558", name: "Environmental Engineering Lab" },
    ],
    "Semester 6": [
      { code: "BCE601", name: "Design of RC Structures" },
      { code: "BCE602", name: "Sewage & Wastewater Treatment" },
      { code: "BCE603", name: "Foundation Engineering" },
      { code: "BCE657", name: "CAD Lab" },
      { code: "BCE658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BCE701", name: "Design of Steel Structures" },
      { code: "BCE702", name: "Town Planning & Traffic Engineering" },
      { code: "BCE757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },

  // AIML
  "Artificial Intelligence and Machine Learning (AIML)": {
    "Semester 3": [
      { code: "BMAT301", name: "Transform Calculus, Fourier Series & Numerical Techniques" },
      { code: "BAIML302", name: "Discrete Mathematical Structures" },
      { code: "BAIML303", name: "Digital Electronics" },
      { code: "BAIML304", name: "Data Structures and Applications" },
      { code: "BAIML306A", name: "Python Programming" },
      { code: "BAIML357", name: "Python Lab" },
      { code: "BAIML358", name: "Data Structures Lab" },
    ],
    "Semester 4": [
      { code: "BMAT401", name: "Complex Analysis, Probability & Statistical Methods" },
      { code: "BAIML401", name: "Analysis and Design of Algorithms" },
      { code: "BAIML402", name: "Machine Learning" },
      { code: "BAIML403", name: "Database Management" },
      { code: "BAIML457", name: "ML Lab" },
      { code: "BAIML458", name: "DBMS Lab" },
    ],
    "Semester 5": [
      { code: "BAIML501", name: "Deep Learning" },
      { code: "BAIML502", name: "Computer Vision" },
      { code: "BAIML503", name: "Natural Language Processing" },
      { code: "BAIML557", name: "Deep Learning Lab" },
      { code: "BAIML558", name: "NLP Lab" },
    ],
    "Semester 6": [
      { code: "BAIML601", name: "Reinforcement Learning" },
      { code: "BAIML602", name: "AI for IoT" },
      { code: "BAIML603", name: "Data Science" },
      { code: "BAIML657", name: "AI Projects Lab" },
      { code: "BAIML658", name: "Mini Project" },
    ],
    "Semester 7": [
      { code: "BAIML701", name: "Explainable AI" },
      { code: "BAIML702", name: "Generative AI" },
      { code: "BAIML757", name: "Project Phase - I" },
    ],
    "Semester 8": [
      { code: "BPRJ801", name: "Project Work Phase - II" },
      { code: "BSEM801", name: "Seminar" },
    ],
  },
};

// For older schemes, reuse CSE subjects with minor label adjustments
const buildLegacyScheme = (baseScheme: typeof SUBJECTS_2025): typeof SUBJECTS_2025 => {
  return baseScheme;
};

// ─────────────────────────────────────────────────────────────────────────────
// Master subject map: scheme → (year or branch) → semester → subjects
// ─────────────────────────────────────────────────────────────────────────────
export const VTU_SUBJECTS: Record<string, Record<string, SemesterMap>> = {
  "2025 Scheme": SUBJECTS_2025,
  "2022 Scheme": buildLegacyScheme(SUBJECTS_2025),
  "2021 Scheme": buildLegacyScheme(SUBJECTS_2025),
  "2018 Scheme": buildLegacyScheme(SUBJECTS_2025),
};

/** Get available semesters for a year + branch selection */
export function getSemesters(year: Year, branch: Branch): string[] {
  if (year === "First Year") return ["Physics Cycle", "Chemistry Cycle"];
  const start = year === "Second Year" ? 3 : year === "Third Year" ? 5 : 7;
  return [`Semester ${start}`, `Semester ${start + 1}`];
}

/** Look up subjects for a scheme / year / branch / semester combo */
export function getSubjects(
  scheme: string,
  year: string,
  branch: string,
  semester: string,
): SubjectEntry[] {
  const schemeData = VTU_SUBJECTS[scheme] ?? VTU_SUBJECTS["2025 Scheme"];

  // First year is common — key is "First Year"
  if (year === "First Year") {
    return schemeData["First Year"]?.[semester] ?? [];
  }

  // Other years — key is branch name
  return schemeData[branch]?.[semester] ?? [];
}
