export interface Story {
  id: string;
  title: string;
  titleDarija: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  content: StoryParagraph[];
  vocabulary: StoryVocabulary[];
  comprehensionQuestions: [string, string[], number];
}

export interface StoryParagraph {
  darija: string;
  english: string;
  hasDialogue?: boolean;
}

export interface StoryVocabulary {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export type StoryQuestion = [string, string[], number];

export const STORIES: Story[] = [
  {
    id: '1',
    title: 'The Coffee Shop',
    titleDarija: 'Bistro dial قهوة',
    level: 'Beginner',
    duration: 5,
    content: [
      {
        darija: 'Sara tweel fi l-bistro. hiya bghat قهوة.',
        english: 'Sara is sitting in the coffee shop. She wants coffee.',
      },
      {
        darija: 'Weldha l-kamrin. "Labas, bghit قهوة bl-leben."',
        english: 'The waiter came. "Hello, I want coffee with milk."',
      },
      {
        darija: 'L-kamrin dah. "Hawel, khdamti hna."',
        english: 'The waiter said. "Okay, work here."',
      },
      {
        darija: 'Sara sharbet l-qahwa. kanat لذيذة!',
        english: 'Sara drank the coffee. It was delicious!',
      },
    ],
    vocabulary: [
      { word: 'bistro', transliteration: 'bis-tro', meaning: 'coffee shop' },
      { word: 'قهوة', transliteration: 'qahwa', meaning: 'coffee' },
      { word: 'kamrin', transliteration: 'kam-rin', meaning: 'waiter' },
      { word: 'labas', transliteration: 'la-bas', meaning: 'okay' },
      { word: 'sharbet', transliteration: 'shar-bet', meaning: 'she drank' },
    ],
    comprehensionQuestions: ['Where is Sara?', ['Fi l-bistro', 'Fi l-bit', 'Fi l-matri', 'Fi s-saf'], 0],
  },
  {
    id: '2',
    title: 'At the Market',
    titleDarija: 'Fi l-hourria',
    level: 'Beginner',
    duration: 7,
    content: [
      {
        darija: 'Ahmed rayeh l-hourria. bghat yeshri l-khdar.',
        english: 'Ahmed is going to the market. He wants to buy vegetables.',
      },
      {
        darija: '"Bsal, tomato, w khyar, min fadlak?"',
        english: '"Onions, tomatoes, and cucumbers, please?"',
      },
      {
        darija: 'L-bayyi3 mil. "Hna l-khdar fresj!"',
        english: 'The seller said. "Here are fresh vegetables!"',
      },
      {
        darija: 'Ahmed shra l-khdar. shtara 5 kilogram.',
        english: 'Ahmed bought the vegetables. He bought 5 kilograms.',
      },
      {
        darija: '"Shukran, bslama!" "Bslama, twali!"',
        english: '"Thank you, goodbye!" "Goodbye, come back!"',
      },
    ],
    vocabulary: [
      { word: 'hourria', transliteration: 'hou-ri-a', meaning: 'market (literally: freedom)' },
      { word: 'khdar', transliteration: 'kha-dar', meaning: 'vegetables' },
      { word: 'bayyi3', transliteration: 'bay-yi3', meaning: 'seller' },
      { word: 'fresj', transliteration: 'fresj', meaning: 'fresh' },
      { word: 'shtara', transliteration: 'sh-ta-ra', meaning: 'he bought' },
    ],
    comprehensionQuestions: ['What did Ahmed want to buy?', ['l-fakha', 'l-khdar', 'l-lhme', 'l-hobz'], 1],
  },
  {
    id: '3',
    title: 'A New Job',
    titleDarija: 'Wazifed jdida',
    level: 'Intermediate',
    duration: 10,
    content: [
      {
        darija: 'Fatima labset l-yom l-jdid. hadret l-maktab.',
        english: 'Fatima dressed up today. She went to the office.',
      },
      {
        darija: 'Hiya khdat wazifa jdida fi sharikt programmer.',
        english: 'She got a new job at a programming company.',
      },
      {
        darija: '"Marhaba, ana Fatima l-jdida. hadmi hna."',
        english: '"Hello, I am Fatima the new one. I work here."',
      },
      {
        darija: 'L-mudir dakhelha l-biro. "Hadi hya bhajtek, hadi hya l-maktab dialek."',
        english: 'The manager showed her the office. "This is your desk, this is your office."',
      },
      {
        darija: 'Fatima bethet. "Shukran, sa nebda l-amel."',
        english: 'Fatima sat down. "Thank you, we will start working."',
      },
    ],
    vocabulary: [
      { word: 'labset', transliteration: 'lab-set', meaning: 'she dressed up' },
      { word: 'mudir', transliteration: 'mu-dir', meaning: 'manager' },
      { word: 'biro', transliteration: 'bi-ro', meaning: 'office' },
      { word: 'bhajtek', transliteration: 'b-ha-jtek', meaning: 'your room' },
      { word: 'nebda', transliteration: 'neb-da', meaning: 'we will start' },
    ],
    comprehensionQuestions: ['Where does Fatima work?', ['Fi l-matbakh', 'Fi sharikt programmer', 'Fi l-madrassa', 'Fi l-ospital'], 1],
  },
  {
    id: '4',
    title: 'The Taxi Ride',
    titleDarija: 'Ri7a t-taksi',
    level: 'Intermediate',
    duration: 8,
    content: [
      {
        darija: 'Youssef wave3 t-taksi. "L-mina, min fadlak!"',
        english: 'Youssef flagged down a taxi. "To the port, please!"',
      },
      {
        darija: 'S-so3ir dakhel. "30 dirham."',
        english: 'The driver got in. "30 dirhams."',
      },
      {
        darija: '"Mashi, wash tqder tqaddem?" "Namel, la bash."',
        english: '"Okay, can you go faster?" "We can, no problem."',
      },
      {
        darija: 'T-taksi t7awel. Youssef dakh fi l-mina ba3d 20 dakika.',
        english: 'The taxi sped up. Youssef arrived at the port after 20 minutes.',
      },
      {
        darija: '"Hna l-mina. Shukran lik." "Bslama, twali."',
        english: '"Here is the port. Thank you." "Goodbye, come back."',
      },
    ],
    vocabulary: [
      { word: 'wave3', transliteration: 'wa-ve3', meaning: 'flagged down' },
      { word: 'mina', transliteration: 'mi-na', meaning: 'port' },
      { word: 'so3ir', transliteration: 'so-3ir', meaning: 'driver' },
      { word: 't7awel', transliteration: 't-ha-wel', meaning: 'sped up' },
      { word: 'ba3d', transliteration: 'ba3d', meaning: 'after' },
    ],
    comprehensionQuestions: ['How much was the taxi fare?', ['20 dirham', '30 dirham', '50 dirham', '10 dirham'], 1],
  },
  {
    id: '5',
    title: 'Traditional Wedding',
    titleDarija: 'Zifaf tarishi',
    level: 'Advanced',
    duration: 15,
    content: [
      {
        darija: 'L-zifaf kan l-yom fi Dar l-hbib. kulshi kan mnifer.',
        english: 'The wedding was today at the community hall. Everything was wonderful.',
      },
      {
        darija: 'L-3rousayn labsin l传统elle. l-3rous lbes qamis, w l-3rousa lbes kaftan.',
        english: 'The couple wore traditional clothes. The groom wore a qamis, and the bride wore a kaftan.',
      },
      {
        darija: 'Nqes l-qasida. "Nqes l-3rouda dial l-hbib..."',
        english: 'They recited the qasida. "The song of the beloved ones..."',
      },
      {
        darija: 'L-hna dachinbin. "Tfaddalu, kulو hak yji!"',
        english: 'The henna was applied. "Please come in, everyone is welcome!"',
      },
      {
        darija: 'Ba3d l-zifaf, kulshi dance3. "Bslama, l-3rousayn!"',
        english: 'After the wedding, everyone celebrated. "Congratulations, the couple!"',
      },
    ],
    vocabulary: [
      { word: 'zifaf', transliteration: 'zi-faf', meaning: 'wedding' },
      { word: '3rousayn', transliteration: '3rou-sayn', meaning: 'couple (bride and groom)' },
      { word: 'kaftan', transliteration: 'kaf-tan', meaning: 'traditional wedding dress' },
      { word: 'hna', transliteration: 'hna', meaning: 'henna (traditional dye)' },
      { word: 'dance3', transliteration: 'dan-ce3', meaning: 'celebrated' },
    ],
    comprehensionQuestions: ['What did the bride wear?', ['Jeans', 'Kaftan', 'T-shirt', 'Costume'], 1],
  },
];
