/**
 * portfolioData.js
 *
 * Static data for the portfolio — separated from translation logic so that
 * content edits never require touching i18n.js or any component file.
 */

const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path}`.replace(/\/+/g, '/');
};

/** Core profile information used across the site */
export const profileData = {
  name: 'Yehia Hatem Salah Salem',
  role: 'Integrated Marketing Communication & Computer Science Student',
  location: 'Heliopolis, Cairo, Egypt',
  contact: {
    whatsapp: '+201226094788',
    phone: '+201105177931',
    email: 'yehiahatemsalem@gmail.com',
  },
  summary:
    'Highly motivated dual-degree student blending creativity and technology across marketing communications and computer science. Experienced in digital media creation, storytelling, and problem solving with fluency in Arabic, English, and French.',
  highlights: [
    'Dual-degree student (IMC & Computer Science)',
    'IELTS Overall Band 8.5',
    'Cairo Mobile Film Festival Winner (Under 18)',
  ],
  tools: [
    'Photoshop',
    'DaVinci Resolve',
    'Affinity Photo',
    'Affinity Designer',
    'Affinity Publisher',
    'Krita',
    'Paint Tool SAI',
    'Sony Vegas',
    'Adobe Premiere',
    'GIMP',
  ],
  interests: [
    'Film Storytelling',
    'Visual Communication',
    'Brand Identity',
    'UX Strategy',
    'Motion Graphics',
    'Open Source',
    'Creative Coding',
    'Marketing Analytics',
    'Typography',
    'AI & Design',
  ],
  values: [
    {
      title: 'Craftsmanship',
      description: 'Every pixel matters. I obsess over the details that make work feel deliberate.',
    },
    {
      title: 'Cross-Disciplinary Thinking',
      description: 'IMC and Computer Science give me two lenses. I use both to solve harder problems.',
    },
    {
      title: 'Narrative First',
      description: 'Design is storytelling I never start with aesthetics: I start with meaning.',
    },
  ],
  skills: [
    {
      title: 'Visual & Motion',
      items: [
        'Photo Editing: Affinity Photo, Photoshop, GIMP',
        'Video Editing: Sony Vegas, DaVinci Resolve, Adobe Premiere',
        'Graphic Design: Affinity Designer, Affinity Publisher',
        'Animation: Krita',
      ],
    },
    {
      title: 'Digital Art & Tools',
      items: ['Digital Art: Krita, Paint Tool SAI, Affinity Photo', 'Creative Suite Workflow & Asset Management'],
    },
    { title: 'Languages', items: ['Arabic — Fluent', 'English — Fluent', 'French — Fluent'] },
    {
      title: 'Personal Strengths',
      items: [
        'Excellent Communication & Presentation',
        'Dedicated & Meticulous Work Ethic',
        'Problem Solving & Lateral Thinking',
      ],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Arts in Integrated Marketing Communication',
      institution: 'The British University in Egypt',
      location: 'Cairo, Egypt',
      period: 'Expected 2026',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of the People',
      period: 'Expected 2027',
    },
  ],
  awards: [
    { name: 'IELTS Certificate — Overall Band 8.5', year: '2022' },
    { name: 'French Immersion Certificate', year: '2022' },
    { name: 'International Business Award', year: '2022' },
    { name: 'Cairo Mobile Film Festival Winner (Under 18)', year: '2016' },
    { name: 'Graduation Award — International Business', year: '2022' },
  ],
};

/** Portfolio projects shown in the Portfolio page */
export const portfolioWorks = [
  {
    id: 1,
    title: 'BUE Film Festival Poster Banner',
    description:
      'Official poster design for the British University in Egypt International Student Film Festival, featuring bold typography and cinematic imagery.',
    category: 'Poster Design',
    thumbnail: getAssetPath('portfolio/festival-posters/New Posters/bue poster banner.png'),
    media: { type: 'image', src: getAssetPath('portfolio/festival-posters/New Posters/bue poster banner.png') },
    year: '2024',
    reflection:
      'This project taught me the importance of visual hierarchy in promotional design. Creating a poster for an actual institution rather than a hypothetical brief sharpened my ability to interpret client expectations and translate them into a cohesive visual narrative.',
    skillsGained: ['Visual Hierarchy', 'Client Communication', 'Promotional Design', 'IMC Strategy'],
  },
  {
    id: 2,
    title: 'BUE ISFF Logo',
    description:
      'Brand identity design for the International Student Film Festival, combining film reel motifs with modern minimalism.',
    category: 'Logo Design',
    thumbnail: getAssetPath('portfolio/logos/Logo_BUE_Official.png'),
    media: { type: 'image', src: getAssetPath('portfolio/logos/Logo_BUE_Official.png') },
    year: '2024',
    reflection:
      'Designing a logo forced me to distill complex ideas into a single symbolic mark. The iterative process — from initial sketches through multiple critique rounds — improved my visual problem-solving and resilience.',
    skillsGained: ['Brand Identity', 'Symbolic Design', 'Iterative Critique', 'Visual Problem-Solving'],
  },
  {
    id: 3,
    title: 'Film Festival Billboard',
    description:
      'Large-scale billboard design for campus-wide festival promotion with high-impact visual hierarchy.',
    category: 'Billboard Design',
    thumbnail: getAssetPath('portfolio/design-files/POSTER-COMPRESSED.jpg'),
    media: { type: 'image', src: getAssetPath('portfolio/design-files/POSTER-COMPRESSED.jpg') },
    year: '2024',
    reflection:
      'Scaling a design from poster to billboard required understanding how visual legibility changes with distance and environment. This developed my spatial reasoning and technical production skills.',
    skillsGained: ['Large-Format Design', 'Resolution Management', 'Production Readiness'],
  },
  {
    id: 4,
    title: 'Book Cover Design',
    description:
      'Editorial design project featuring typography exploration and narrative-driven composition.',
    category: 'Book Design',
    thumbnail: getAssetPath('portfolio/academic/Book_Cover_Sunset_Oasis_English_V2.jpeg'),
    media: { type: 'image', src: getAssetPath('portfolio/academic/Book_Cover_Sunset_Oasis_English_V2.jpeg') },
    year: '2024',
    reflection:
      'Editorial design pushed me into a different discipline — one where typography, pacing, and narrative structure become the primary tools. Designing a book cover meant capturing the essence of an entire narrative in a single frame.',
    skillsGained: ['Editorial Design', 'Typographic Mastery', 'Narrative Storytelling'],
  },
];
