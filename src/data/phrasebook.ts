export interface DialogueLine {
  speaker: 'A' | 'B';
  darija: string;
  transliteration: string;
  english: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dialogue: DialogueLine[];
  keyPhrases: { darija: string; transliteration: string; english: string }[];
  culturalNote?: string;
}

export const PHRASEBOOK_SCENARIOS: Scenario[] = [
  {
    id: 'greetings',
    title: 'Meeting Someone',
    description: 'Learn how to greet people and introduce yourself in Darija',
    icon: '👋',
    category: 'Social',
    difficulty: 'beginner',
    dialogue: [
      { speaker: 'A', darija: 'Salam! Labas?', transliteration: 'Salam! Labas?', english: 'Hello! How are you?' },
      { speaker: 'B', darija: 'Labas, hamdullah. Nta labas?', transliteration: 'Labas, hamdullah. Nta labas?', english: 'Fine, thank God. And you?' },
      { speaker: 'A', darija: 'Mzyan, shukran. Smiytek ash?', transliteration: 'Mzyan, shukran. Smiytek ash?', english: 'Good, thanks. What\'s your name?' },
      { speaker: 'B', darija: 'Smiyti Youssef. Nta?', transliteration: 'Smiyti Youssef. Nta?', english: 'My name is Youssef. And you?' },
      { speaker: 'A', darija: 'Smiyti Ahmed. Mtsharfin!', transliteration: 'Smiyti Ahmed. Mtsharfin!', english: 'My name is Ahmed. Nice to meet you!' },
      { speaker: 'B', darija: 'Mtsharfin bhal bhal!', transliteration: 'Mtsharfin bhal bhal!', english: 'Likewise!' },
    ],
    keyPhrases: [
      { darija: 'Labas?', transliteration: 'Labas?', english: 'How are you?' },
      { darija: 'Hamdullah', transliteration: 'Hamdullah', english: 'Thank God (I\'m fine)' },
      { darija: 'Smiytek ash?', transliteration: 'Smiytek ash?', english: 'What\'s your name?' },
      { darija: 'Smiyti...', transliteration: 'Smiyti...', english: 'My name is...' },
      { darija: 'Mtsharfin', transliteration: 'Mtsharfin', english: 'Nice to meet you' },
    ],
    culturalNote: 'In Morocco, it\'s common to ask "Labas?" multiple times in a conversation as a sign of genuine care. Always respond with "Hamdullah" (Thank God) even if you\'re not feeling great.',
  },
  {
    id: 'cafe',
    title: 'At the Café',
    description: 'Order drinks and snacks at a Moroccan café',
    icon: '☕',
    category: 'Food & Drink',
    difficulty: 'beginner',
    dialogue: [
      { speaker: 'A', darija: 'Salam! Ash bghiti?', transliteration: 'Salam! Ash bghiti?', english: 'Hello! What would you like?' },
      { speaker: 'B', darija: 'Bghit atay b na3na3, afak.', transliteration: 'Bghit atay b na3na3, afak.', english: 'I\'d like mint tea, please.' },
      { speaker: 'A', darija: 'Bghad walo?', transliteration: 'Bghad walo?', english: 'Anything else?' },
      { speaker: 'B', darija: 'Iyeh, wahd lkahwa hlib.', transliteration: 'Iyeh, wahd lkahwa hlib.', english: 'Yes, one coffee with milk.' },
      { speaker: 'A', darija: 'Wakha, daba njib lik.', transliteration: 'Wakha, daba njib lik.', english: 'OK, I\'ll bring it right away.' },
      { speaker: 'B', darija: 'Shukran bzaf!', transliteration: 'Shukran bzaf!', english: 'Thank you very much!' },
    ],
    keyPhrases: [
      { darija: 'Bghit...', transliteration: 'Bghit...', english: 'I want / I\'d like...' },
      { darija: 'Afak', transliteration: 'Afak', english: 'Please' },
      { darija: 'Bghad walo?', transliteration: 'Bghad walo?', english: 'Anything else?' },
      { darija: 'Wakha', transliteration: 'Wakha', english: 'OK / Alright' },
      { darija: 'Shukran bzaf', transliteration: 'Shukran bzaf', english: 'Thank you very much' },
    ],
    culturalNote: 'Moroccan mint tea (atay) is a symbol of hospitality. It\'s traditionally poured from a height to create foam. Refusing tea can be considered impolite.',
  },
  {
    id: 'market',
    title: 'At the Market (Souk)',
    description: 'Bargain and shop at a traditional Moroccan market',
    icon: '🛒',
    category: 'Shopping',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', darija: 'Salam! Bghiti tshri?', transliteration: 'Salam! Bghiti tshri?', english: 'Hello! Do you want to buy?' },
      { speaker: 'B', darija: 'Bshal had lkamija?', transliteration: 'Bshal had lkamija?', english: 'How much is this shirt?' },
      { speaker: 'A', darija: 'Miya w khamsin dirham.', transliteration: 'Miya w khamsin dirham.', english: '150 dirhams.' },
      { speaker: 'B', darija: 'Ghali bzaf! Miya dirham?', transliteration: 'Ghali bzaf! Miya dirham?', english: 'Too expensive! 100 dirhams?' },
      { speaker: 'A', darija: 'La, miya w 3ashrin.', transliteration: 'La, miya w 3ashrin.', english: 'No, 120.' },
      { speaker: 'B', darija: 'Wakha, miya w 3ashrin. Maqbul.', transliteration: 'Wakha, miya w 3ashrin. Maqbul.', english: 'OK, 120. Deal.' },
    ],
    keyPhrases: [
      { darija: 'Bshal?', transliteration: 'Bshal?', english: 'How much?' },
      { darija: 'Ghali bzaf', transliteration: 'Ghali bzaf', english: 'Too expensive' },
      { darija: 'Rkhis', transliteration: 'Rkhis', english: 'Cheap' },
      { darija: 'Maqbul', transliteration: 'Maqbul', english: 'Deal / Acceptable' },
      { darija: 'Tnaqqas', transliteration: 'Tnaqqas', english: 'Bargain / Negotiate' },
    ],
    culturalNote: 'Bargaining (tnaqqas) is expected and part of the culture in Moroccan souks. Start by offering about 50-60% of the asking price. Always be friendly and smile — it\'s a social interaction, not a confrontation.',
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    description: 'Navigate the medina and ask for directions',
    icon: '🗺️',
    category: 'Navigation',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', darija: 'Afak, fin kayn lhammam?', transliteration: 'Afak, fin kayn lhammam?', english: 'Excuse me, where is the hammam?' },
      { speaker: 'B', darija: 'Sir niyshan, men ba3d dir liser.', transliteration: 'Sir niyshan, men ba3d dir liser.', english: 'Go straight, then turn right.' },
      { speaker: 'A', darija: 'B3id?', transliteration: 'B3id?', english: 'Is it far?' },
      { speaker: 'B', darija: 'La, qrib. 5 dqayeq f rejlik.', transliteration: 'La, qrib. 5 dqayeq f rejlik.', english: 'No, close. 5 minutes on foot.' },
      { speaker: 'A', darija: 'Shukran, Allah yhbarek fik.', transliteration: 'Shukran, Allah yhbarek fik.', english: 'Thank you, God bless you.' },
      { speaker: 'B', darija: 'Bla jmil!', transliteration: 'Bla jmil!', english: 'You\'re welcome!' },
    ],
    keyPhrases: [
      { darija: 'Fin kayn...?', transliteration: 'Fin kayn...?', english: 'Where is...?' },
      { darija: 'Sir niyshan', transliteration: 'Sir niyshan', english: 'Go straight' },
      { darija: 'Dir liser / limin', transliteration: 'Dir liser / limin', english: 'Turn left / right' },
      { darija: 'Qrib / B3id', transliteration: 'Qrib / B3id', english: 'Near / Far' },
      { darija: 'Bla jmil', transliteration: 'Bla jmil', english: 'You\'re welcome' },
    ],
    culturalNote: 'Moroccans are very helpful with directions. Don\'t be surprised if someone walks you to your destination instead of just pointing. This hospitality is called "karam" (generosity).',
  },
  {
    id: 'taxi',
    title: 'Taking a Taxi',
    description: 'Negotiate fares and give directions to taxi drivers',
    icon: '🚕',
    category: 'Transport',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', darija: 'Taxi! Bghit nmshi l Jama3 Lfna.', transliteration: 'Taxi! Bghit nmshi l Jama3 Lfna.', english: 'Taxi! I want to go to Jemaa el-Fna.' },
      { speaker: 'B', darija: 'Wakha. B 30 dirham.', transliteration: 'Wakha. B 30 dirham.', english: 'OK. For 30 dirhams.' },
      { speaker: 'A', darija: 'La, ghali. 20 dirham.', transliteration: 'La, ghali. 20 dirham.', english: 'No, too expensive. 20 dirhams.' },
      { speaker: 'B', darija: 'Wakha, 25 dirham. Rkeb.', transliteration: 'Wakha, 25 dirham. Rkeb.', english: 'OK, 25 dirhams. Get in.' },
      { speaker: 'A', darija: 'Wqef hna, afak.', transliteration: 'Wqef hna, afak.', english: 'Stop here, please.' },
      { speaker: 'B', darija: 'Wslna. 25 dirham.', transliteration: 'Wslna. 25 dirham.', english: 'We\'ve arrived. 25 dirhams.' },
    ],
    keyPhrases: [
      { darija: 'Bghit nmshi l...', transliteration: 'Bghit nmshi l...', english: 'I want to go to...' },
      { darija: 'Bshal?', transliteration: 'Bshal?', english: 'How much?' },
      { darija: 'Wqef hna', transliteration: 'Wqef hna', english: 'Stop here' },
      { darija: 'Rkeb', transliteration: 'Rkeb', english: 'Get in' },
      { darija: 'Wslna', transliteration: 'Wslna', english: 'We\'ve arrived' },
    ],
    culturalNote: 'In Morocco, petit taxis (small taxis) are metered but drivers often prefer to negotiate. Always agree on the price before getting in. Grand taxis (shared taxis) go between cities at fixed prices.',
  },
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    description: 'Order food and handle the bill at a Moroccan restaurant',
    icon: '🍽️',
    category: 'Food & Drink',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', darija: 'Mrhba! Shhal f nas?', transliteration: 'Mrhba! Shhal f nas?', english: 'Welcome! How many people?' },
      { speaker: 'B', darija: 'Juj d nas, afak.', transliteration: 'Juj d nas, afak.', english: 'Two people, please.' },
      { speaker: 'A', darija: 'Ash bghitiu taklu?', transliteration: 'Ash bghitiu taklu?', english: 'What would you like to eat?' },
      { speaker: 'B', darija: 'Bghit tajin djaj w couscous.', transliteration: 'Bghit tajin djaj w couscous.', english: 'I\'d like chicken tajine and couscous.' },
      { speaker: 'A', darija: 'Wakha. W tashrabu ash?', transliteration: 'Wakha. W tashrabu ash?', english: 'OK. And to drink?' },
      { speaker: 'B', darija: 'Jib lina lma w atay, afak. W lhsab men fadlak.', transliteration: 'Jib lina lma w atay, afak. W lhsab men fadlak.', english: 'Bring us water and tea, please. And the bill please.' },
    ],
    keyPhrases: [
      { darija: 'Lhsab, afak', transliteration: 'Lhsab, afak', english: 'The bill, please' },
      { darija: 'Jib lina...', transliteration: 'Jib lina...', english: 'Bring us...' },
      { darija: 'Juj d nas', transliteration: 'Juj d nas', english: 'Two people' },
      { darija: 'Tajin', transliteration: 'Tajin', english: 'Tajine (slow-cooked stew)' },
      { darija: 'Couscous', transliteration: 'Couscous', english: 'Couscous (Friday dish)' },
    ],
    culturalNote: 'Couscous is traditionally eaten on Fridays in Morocco, often as a family meal after Friday prayers. Tajine is the most common everyday dish — named after the conical clay pot it\'s cooked in.',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    description: 'Describe symptoms and understand medical advice',
    icon: '🏥',
    category: 'Health',
    difficulty: 'advanced',
    dialogue: [
      { speaker: 'A', darija: 'Salam, ash kayn?', transliteration: 'Salam, ash kayn?', english: 'Hello, what\'s the matter?' },
      { speaker: 'B', darija: 'Rassi kayderni w jismi skhon.', transliteration: 'Rassi kayderni w jismi skhon.', english: 'My head hurts and I have a fever.' },
      { speaker: 'A', darija: 'Mnin bda had lmard?', transliteration: 'Mnin bda had lmard?', english: 'When did this illness start?' },
      { speaker: 'B', darija: 'Men lbarh f l3shiya.', transliteration: 'Men lbarh f l3shiya.', english: 'Since yesterday evening.' },
      { speaker: 'A', darija: 'Khud had dwa telt mrat f nhar.', transliteration: 'Khud had dwa telt mrat f nhar.', english: 'Take this medicine three times a day.' },
      { speaker: 'B', darija: 'Shukran, doktor.', transliteration: 'Shukran, doktor.', english: 'Thank you, doctor.' },
    ],
    keyPhrases: [
      { darija: '...kayderni', transliteration: '...kayderni', english: 'My ... hurts' },
      { darija: 'Jismi skhon', transliteration: 'Jismi skhon', english: 'I have a fever' },
      { darija: 'Mrid / Mrida', transliteration: 'Mrid / Mrida', english: 'Sick (m/f)' },
      { darija: 'Dwa', transliteration: 'Dwa', english: 'Medicine' },
      { darija: 'Telt mrat f nhar', transliteration: 'Telt mrat f nhar', english: 'Three times a day' },
    ],
    culturalNote: 'In Morocco, pharmacies (farmasyan) are very accessible and pharmacists can often recommend treatments for minor ailments without a prescription. They\'re a good first stop for common illnesses.',
  },
  {
    id: 'phone',
    title: 'Phone Conversation',
    description: 'Make and receive phone calls in Darija',
    icon: '📱',
    category: 'Communication',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', darija: 'Alo?', transliteration: 'Alo?', english: 'Hello?' },
      { speaker: 'B', darija: 'Alo, labas? Bghit nhdar m3a Fatima.', transliteration: 'Alo, labas? Bghit nhdar m3a Fatima.', english: 'Hello, how are you? I\'d like to speak with Fatima.' },
      { speaker: 'A', darija: 'Fatima mashi hna daba. Tkhlli rissala?', transliteration: 'Fatima mashi hna daba. Tkhlli rissala?', english: 'Fatima isn\'t here right now. Would you like to leave a message?' },
      { speaker: 'B', darija: 'Iyeh, gul liha t3ayyet liya men fadlha.', transliteration: 'Iyeh, gul liha t3ayyet liya men fadlha.', english: 'Yes, tell her to call me back please.' },
      { speaker: 'A', darija: 'Wakha, nqul liha. Smiytek ash?', transliteration: 'Wakha, nqul liha. Smiytek ash?', english: 'OK, I\'ll tell her. What\'s your name?' },
      { speaker: 'B', darija: 'Smiyti Karim. Shukran bzaf!', transliteration: 'Smiyti Karim. Shukran bzaf!', english: 'My name is Karim. Thank you very much!' },
    ],
    keyPhrases: [
      { darija: 'Alo?', transliteration: 'Alo?', english: 'Hello? (on phone)' },
      { darija: 'Bghit nhdar m3a...', transliteration: 'Bghit nhdar m3a...', english: 'I\'d like to speak with...' },
      { darija: 'Mashi hna', transliteration: 'Mashi hna', english: 'Not here' },
      { darija: 'T3ayyet liya', transliteration: 'T3ayyet liya', english: 'Call me back' },
      { darija: 'Rissala', transliteration: 'Rissala', english: 'Message' },
    ],
    culturalNote: 'Moroccans often use French words mixed with Darija in phone conversations, especially in urban areas. "Allo" comes from French, and you\'ll hear many French loanwords in everyday speech.',
  },
];

export const PHRASEBOOK_CATEGORIES = Array.from(
  new Set(PHRASEBOOK_SCENARIOS.map((s) => s.category))
);
