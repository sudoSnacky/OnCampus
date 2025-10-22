
import { Timestamp } from 'firebase/firestore';

export type Benefit = {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  imageUrl: string;
  redirectUrl: string;
};

export type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
};

export type CampusEvent = {
  id: string;
  title: string;
  date: string | Timestamp;
  location: string;
  description: string;
  imageUrl: string;
};

export const initialBenefits: Benefit[] = [
  {
    id: "benefit-1",
    title: "Student Discount",
    provider: "BookMyShow",
    description: "Get up to 50% off on movie tickets twice a month. Verified for all major cities in India.",
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRpY2tldCUyMGFic3RyYWN0fGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    redirectUrl: "https://in.bookmyshow.com/offers/student-discount/STUDENT",
  },
  {
    id: "benefit-2",
    title: "Prime Student",
    provider: "Amazon",
    description: "Enjoy 6 months of Amazon Prime for free, then 50% off. Includes Prime Video, Music, and free delivery.",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1595341888016-a392d8edb6a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZyUyMGNvbG9yZnVsfGVufDB8fHx8MTc2MDczNjIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    redirectUrl: "https://www.amazon.in/amazon-student-offer/b?ie=UTF8&node=21423439031",
  },
  {
    id: "benefit-3",
    title: "Free IDEs",
    provider: "JetBrains",
    description: "Access all JetBrains professional desktop IDEs like IntelliJ IDEA Ultimate, PyCharm, and more for free.",
    category: "Software",
    imageUrl: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjB0b29scyUyMGNsZWFufGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    redirectUrl: "https://www.jetbrains.com/community/education/#students",
  },
  {
    id: "benefit-4",
    title: "Student Developer Pack",
    provider: "GitHub",
    description: "Get free access to the best developer tools in one place, including cloud hosting, domains, and more.",
    category: "Software",
    imageUrl: "https://images.unsplash.com/photo-1610416343589-952b07987251?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXRodWIlMjBhYnN0cmFjdHxlbnwwfHx8fDE3NjA3NzEwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    redirectUrl: "https://education.github.com/pack",
  },
  {
    id: "benefit-5",
    title: "National Digital Library",
    provider: "Govt. of India",
    description: "Free access to a vast repository of e-books, journals, and educational content for all students in India.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBjb2xvcmZ1bHxlbnwwfHx8fDE3NjA3MzExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    redirectUrl: "https://ndl.iitkgp.ac.in/",
  },
];

export const initialClubs: Club[] = [
  {
    id: "club-1",
    name: "The Coding Circle",
    category: "Technology",
    description: "A community for programmers to collaborate on projects, participate in hackathons, and learn new technologies.",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjb2xsYWJvcmF0aW9ufGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "club-2",
    name: "Entrepreneurship Cell",
    category: "Business",
    description: "Fostering the spirit of entrepreneurship through workshops, speaker sessions, and startup competitions.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNzYwNzcxMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "club-3",
    name: "Nritya - The Dance Society",
    category: "Arts & Culture",
    description: "Celebrating diverse Indian and Western dance forms. Open to all skill levels.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGZlc3RpdmFsfGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "club-4",
    name: "Shutterbugs - Photography Club",
    category: "Arts & Culture",
    description: "For enthusiasts of photography and videography. Join us for photo walks, workshops, and exhibitions.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNvbG9yZnVsfGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "club-5",
    name: "The Debating Union",
    category: "Literary",
    description: "Hone your public speaking and critical thinking skills. Participate in parliamentary debates and MUNs.",
    imageUrl: "https://images.unsplash.com/photo-1598288293399-25191b72b849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZWJhdGUlMjBtaWNyb3Bob25lfGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const initialEvents: CampusEvent[] = [
  {
    id: "event-1",
    title: "AI & Machine Learning Workshop",
    date: "2024-10-26T10:00:00Z",
    location: "Auditorium",
    description: "An introductory workshop on the fundamentals of AI and Machine Learning by industry experts.",
    imageUrl: "https://images.unsplash.com/photo-1573495627361-ab2b3c41e873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc2hvcHxlbnwwfHx8fDE3NjA3NzEwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "event-2",
    title: "Startup Pitching Seminar",
    date: "2024-11-05T14:30:00Z",
    location: "Convention Hall",
    description: "Learn the art of pitching your startup idea to investors. Featuring successful founders from the Indian startup ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzZW1pbmFyJTIwcHJlc2VudGF0aW9ufGVufDB8fHx8MTc2MDc3MTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];
