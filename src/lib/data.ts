
import { Timestamp } from 'firebase/firestore';

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
  date: string | Timestamp;
  location: string;
  description: string;
  longDescription?: string;
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
    id: "event-4",
    title: "Holi Celebration - Festival of Colors",
    date: "2025-03-25T11:00:00Z",
    location: "University Sports Complex",
    description: "Join us for a vibrant and joyous Holi celebration! Play with organic colors, enjoy traditional music, and savor delicious festive treats.",
    longDescription: "Get ready to immerse yourself in the festival of colors! The university is hosting a grand Holi celebration, complete with eco-friendly organic colors, a live DJ playing festive music, and food stalls offering traditional Indian sweets and snacks. It's a perfect opportunity to de-stress, have fun with friends, and experience the rich culture of this wonderful festival. Don't forget to wear white!",
    imageId: "https://images.unsplash.com/photo-1580538162817-7a8932342370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxIb2xpJTIwZmVzdGl2YWwlMjBjb2xvcnN8ZW58MHx8fHwxNzYwNzc4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "event-5",
    title: "DevFest 2025",
    date: "2025-10-26T09:00:00Z",
    location: "Grand Convention Center",
    description: "A full day of talks, workshops, and networking with experts on Google Cloud, Android, Web, and AI. A premier tech conference for developers.",
    longDescription: "Join us for DevFest 2025! A full day of talks, workshops, and networking with experts on Google Cloud, Android, Web, and AI. Whether you're a student, a professional developer, or a tech enthusiast, there's something for everyone. Don't miss this chance to learn, connect, and get inspired by the brightest minds in the industry. Food and swag will be provided!",
    imageId: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZXxlbnwwfHx8fDE3MjE4MzQ5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];
