
export type Benefit = {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  imageId: string;
  redirectUrl: string;
};

export type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageId: string;
};

export type CampusEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageId: string;
};

export const initialBenefits: Benefit[] = [
  {
    id: "benefit-1",
    title: "Student Discount",
    provider: "BookMyShow",
    description: "Get up to 50% off on movie tickets twice a month. Verified for all major cities in India.",
    category: "Entertainment",
    imageId: "benefit-1",
    redirectUrl: "https://in.bookmyshow.com/offers/student-discount/STUDENT",
  },
  {
    id: "benefit-2",
    title: "Prime Student",
    provider: "Amazon",
    description: "Enjoy 6 months of Amazon Prime for free, then 50% off. Includes Prime Video, Music, and free delivery.",
    category: "Shopping",
    imageId: "benefit-2",
    redirectUrl: "https://www.amazon.in/amazon-student-offer/b?ie=UTF8&node=21423439031",
  },
  {
    id: "benefit-3",
    title: "Free IDEs",
    provider: "JetBrains",
    description: "Access all JetBrains professional desktop IDEs like IntelliJ IDEA Ultimate, PyCharm, and more for free.",
    category: "Software",
    imageId: "benefit-3",
    redirectUrl: "https://www.jetbrains.com/community/education/#students",
  },
  {
    id: "benefit-4",
    title: "Student Developer Pack",
    provider: "GitHub",
    description: "Get free access to the best developer tools in one place, including cloud hosting, domains, and more.",
    category: "Software",
    imageId: "benefit-4",
    redirectUrl: "https://education.github.com/pack",
  },
  {
    id: "benefit-5",
    title: "National Digital Library",
    provider: "Govt. of India",
    description: "Free access to a vast repository of e-books, journals, and educational content for all students in India.",
    category: "Education",
    imageId: "benefit-5",
    redirectUrl: "https://ndl.iitkgp.ac.in/",
  },
];

export const initialClubs: Club[] = [
  {
    id: "club-1",
    name: "The Coding Circle",
    category: "Technology",
    description: "A community for programmers to collaborate on projects, participate in hackathons, and learn new technologies.",
    imageId: "club-1",
  },
  {
    id: "club-2",
    name: "Entrepreneurship Cell",
    category: "Business",
    description: "Fostering the spirit of entrepreneurship through workshops, speaker sessions, and startup competitions.",
    imageId: "club-2",
  },
  {
    id: "club-3",
    name: "Nritya - The Dance Society",
    category: "Arts & Culture",
    description: "Celebrating diverse Indian and Western dance forms. Open to all skill levels.",
    imageId: "club-3",
  },
  {
    id: "club-4",
    name: "Shutterbugs - Photography Club",
    category: "Arts & Culture",
    description: "For enthusiasts of photography and videography. Join us for photo walks, workshops, and exhibitions.",
    imageId: "club-4",
  },
  {
    id: "club-5",
    name: "The Debating Union",
    category: "Literary",
    description: "Hone your public speaking and critical thinking skills. Participate in parliamentary debates and MUNs.",
    imageId: "club-5",
  },
];

export const initialEvents: CampusEvent[] = [
  {
    id: "event-1",
    title: "AI & Machine Learning Workshop",
    date: "2024-10-26T10:00:00Z",
    location: "Auditorium",
    description: "An introductory workshop on the fundamentals of AI and Machine Learning by industry experts.",
    imageId: "event-1",
  },
  {
    id: "event-2",
    title: "Startup Pitching Seminar",
    date: "2024-11-05T14:30:00Z",
    location: "Convention Hall",
    description: "Learn the art of pitching your startup idea to investors. Featuring successful founders from the Indian startup ecosystem.",
    imageId: "event-2",
  },
  {
    id: "event-3",
    title: "Diwali Mela - Festival of Lights",
    date: "2024-11-01T17:00:00Z",
    location: "Campus Grounds",
    description: "A grand celebration of Diwali with food stalls, cultural performances, and a spectacular light show.",
    imageId: "event-3",
  },
];
