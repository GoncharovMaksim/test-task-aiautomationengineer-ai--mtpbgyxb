import { Game, RawReview } from "../../domain/entities/Game";

export interface SeedGameData {
  title: string;
  slug: string;
  coverImage: string;
  platforms: { platform: string; metascore: number | null; userscore: number | null }[];
  primaryPlatform: string;
  metascore: number;
  userscore: number;
  developer: string;
  publisher: string;
  releaseDate: string;
  description: string;
  videoUrl: string;
  genres: string[];
  criticReviews: RawReview[];
  userReviews: RawReview[];
}

export const SEED_GAMES: SeedGameData[] = [
  {
    title: "Astro Bot",
    slug: "astro-bot",
    coverImage: "https://www.metacritic.com/a/img/resize/f0be10be6ffc1f03f3fb4c87cb7884ec88722a27/catalog/provider/2/3/2-1065113-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [{ platform: "PS5", metascore: 94, userscore: 9.3 }],
    primaryPlatform: "PS5",
    metascore: 94,
    userscore: 9.3,
    developer: "Team ASOBI",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "Sep 6, 2024",
    description: "Join ASTRO on a supersized space adventure! The PS5 mothership has been wrecked, leaving ASTRO and the bot crew scattered across galaxies.",
    videoUrl: "https://www.youtube.com/watch?v=k5lO_2rZ_E0",
    genres: ["Platformer", "3D", "Action"],
    criticReviews: [
      { id: "c1", author: "IGN", score: 100, date: "Sep 5, 2024", content: "Astro Bot is a joyous masterpiece of 3D platforming that celebrates PlayStation history with relentless creativity and immaculate DualSense haptics.", type: "critic" },
      { id: "c2", author: "GameSpot", score: 90, date: "Sep 5, 2024", content: "Team ASOBI has crafted one of the finest pure platformers in modern memory, bursting with personality and clever level designs.", type: "critic" },
      { id: "c3", author: "Eurogamer", score: 100, date: "Sep 5, 2024", content: "Incredible attention to detail, tactile charm, and effortless joy in every single stage.", type: "critic" }
    ],
    userReviews: [
      { id: "u1", author: "Gamer99", score: 10, date: "Sep 7, 2024", content: "Pure fun from start to finish! Reminds me why I fell in love with video games in the first place.", type: "user" },
      { id: "u2", author: "DualSenseFan", score: 9, date: "Sep 8, 2024", content: "The use of controller vibration and triggers is the best on PS5 yet. Levels are a bit short though.", type: "user" }
    ]
  },
  {
    title: "Black Myth: Wukong",
    slug: "black-myth-wukong",
    coverImage: "https://www.metacritic.com/a/img/resize/b97ff64205874251cbbe9c18f8e71b2d7112005e/catalog/provider/2/3/2-1002345-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 81, userscore: 8.4 },
      { platform: "PS5", metascore: 82, userscore: 8.1 }
    ],
    primaryPlatform: "PC",
    metascore: 81,
    userscore: 8.4,
    developer: "Game Science",
    publisher: "Game Science",
    releaseDate: "Aug 20, 2024",
    description: "An action RPG rooted in Chinese mythology. Set out as the Destined One to uncover the obscured truth beneath the glorious legend of Journey to the West.",
    videoUrl: "https://www.youtube.com/watch?v=pnSsgmrpnGs",
    genres: ["Action RPG", "Soulslike", "Fantasy"],
    criticReviews: [
      { id: "c4", author: "PC Gamer", score: 87, date: "Aug 19, 2024", content: "Spectacular boss fights, rich mythical environments, and fast-paced staff combat make for an unforgettable journey.", type: "critic" },
      { id: "c5", author: "IGN", score: 80, date: "Aug 18, 2024", content: "Breathtaking visuals and diverse enemy designs, though invisible walls and uneven level layouts hold it back.", type: "critic" }
    ],
    userReviews: [
      { id: "u3", author: "WukongFan", score: 9, date: "Aug 22, 2024", content: "The combat transforms and martial arts moves feel exhilarating. Performance on PC is great after day-one patch.", type: "user" },
      { id: "u4", author: "SoulsPlayer", score: 8, date: "Aug 23, 2024", content: "Boss encounters are top tier. Navigation without a mini-map is occasionally frustrating with invisible walls.", type: "user" }
    ]
  },
  {
    title: "Metaphor: ReFantazio",
    slug: "metaphor-refantazio",
    coverImage: "https://www.metacritic.com/a/img/resize/920ba011f0624d6faefebf1a3ebc453caeb91bf1/catalog/provider/2/3/2-1078921-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PS5", metascore: 94, userscore: 9.1 },
      { platform: "PC", metascore: 92, userscore: 8.9 },
      { platform: "Xbox Series X", metascore: 92, userscore: 9.0 }
    ],
    primaryPlatform: "PS5",
    metascore: 94,
    userscore: 9.1,
    developer: "Studio Zero / Atlus",
    publisher: "Sega",
    releaseDate: "Oct 11, 2024",
    description: "From the creative minds behind Persona 3, 4, and 5 comes Metaphor: ReFantazio, a unique fantasy world where your protagonist will journey alongside their fairy companion.",
    videoUrl: "https://www.youtube.com/watch?v=N4t_W0rZ_aI",
    genres: ["JRPG", "Turn-Based", "Fantasy"],
    criticReviews: [
      { id: "c6", author: "Game Informer", score: 95, date: "Oct 9, 2024", content: "Atlus delivers an ambitious masterclass in narrative RPGs with stellar Archetype customization and musical genius.", type: "critic" }
    ],
    userReviews: [
      { id: "u5", author: "PersonaKing", score: 10, date: "Oct 12, 2024", content: "The UI design and music alone deserve awards. The Archetype class system is deeply rewarding.", type: "user" }
    ]
  },
  {
    title: "Final Fantasy VII Rebirth",
    slug: "final-fantasy-vii-rebirth",
    coverImage: "https://www.metacritic.com/a/img/resize/8ba4efadceb3b248a39e87900b904cf7b8a82d02/catalog/provider/2/3/2-1052132-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [{ platform: "PS5", metascore: 92, userscore: 9.0 }],
    primaryPlatform: "PS5",
    metascore: 92,
    userscore: 9.0,
    developer: "Square Enix",
    publisher: "Square Enix",
    releaseDate: "Feb 29, 2024",
    description: "Cloud and his comrades journey across the planet after escaping Midgar. An expansive world brimming with new adventures and iconic story moments.",
    videoUrl: "https://www.youtube.com/watch?v=Q5aT_d_cE0k",
    genres: ["Action RPG", "Open World", "Sci-Fi"],
    criticReviews: [
      { id: "c7", author: "Kotaku", score: 90, date: "Feb 28, 2024", content: "A massive, gorgeous celebration of classic characters with an electrifying real-time tactical combat engine.", type: "critic" }
    ],
    userReviews: [
      { id: "u6", author: "CloudStrife", score: 9, date: "Mar 2, 2024", content: "Exploration across the grasslands and Junon is breathtaking. Queen's Blood card game is surprisingly addictive.", type: "user" }
    ]
  },
  {
    title: "Hades II",
    slug: "hades-2",
    coverImage: "https://www.metacritic.com/a/img/resize/93ff868c22dc9b3da27ff017f8b9e69c10816cf6/catalog/provider/2/3/2-1061244-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [{ platform: "PC", metascore: 91, userscore: 9.1 }],
    primaryPlatform: "PC",
    metascore: 91,
    userscore: 9.1,
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "May 6, 2024",
    description: "Battle beyond the Underworld using dark sorcery as you take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler.",
    videoUrl: "https://www.youtube.com/watch?v=l-iHDj3ceQw",
    genres: ["Roguelike", "Action", "Mythology"],
    criticReviews: [
      { id: "c8", author: "Rock Paper Shotgun", score: 90, date: "May 10, 2024", content: "Melinoë's witchcraft combat toolkit is even more satisfying than Zagreus. Supergiant has struck gold once again.", type: "critic" }
    ],
    userReviews: [
      { id: "u7", author: "UnderworldGod", score: 10, date: "May 8, 2024", content: "Even in Early Access, the polish, voice acting, and boon synergies are leagues ahead of most finished games.", type: "user" }
    ]
  },
  {
    title: "Balatro",
    slug: "balatro",
    coverImage: "https://www.metacritic.com/a/img/resize/81e57c6b4458fef56f2f9c3eb7d949b28b76c8c4/catalog/provider/2/3/2-1058221-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 90, userscore: 8.6 },
      { platform: "Nintendo Switch", metascore: 90, userscore: 8.8 },
      { platform: "PS5", metascore: 90, userscore: 8.5 }
    ],
    primaryPlatform: "PC",
    metascore: 90,
    userscore: 8.6,
    developer: "LocalThunk",
    publisher: "Playstack",
    releaseDate: "Feb 20, 2024",
    description: "The poker roguelike. Balatro is a hypnotically satisfying deckbuilder where you play illegal poker hands, discover game-changing jokers, and trigger adrenaline-fueled combos.",
    videoUrl: "https://www.youtube.com/watch?v=3gA3z92H7K0",
    genres: ["Roguelike", "Deckbuilder", "Strategy"],
    criticReviews: [
      { id: "c9", author: "Polygon", score: 95, date: "Feb 22, 2024", content: "Incredibly clever, endlessly inventive, and dangerously addictive. The best roguelike since Slay the Spire.", type: "critic" }
    ],
    userReviews: [
      { id: "u8", author: "CardShark", score: 10, date: "Feb 25, 2024", content: "I told myself just one more run at 11 PM and suddenly it was 4 AM. Phenomenal mechanics.", type: "user" }
    ]
  },
  {
    title: "Animal Well",
    slug: "animal-well",
    coverImage: "https://www.metacritic.com/a/img/resize/f24d772ecf9909241b12b5ea912f718aa66bb0c8/catalog/provider/2/3/2-1060931-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 91, userscore: 8.3 },
      { platform: "PS5", metascore: 90, userscore: 8.5 },
      { platform: "Nintendo Switch", metascore: 89, userscore: 8.4 }
    ],
    primaryPlatform: "PC",
    metascore: 91,
    userscore: 8.3,
    developer: "Shared Memory",
    publisher: "Bigmode",
    releaseDate: "May 9, 2024",
    description: "Hatch from a flower and navigate through the lovely and unsettling world of Animal Well, a pixelated labyrinth packed with secrets, puzzles, and atmospheric tension.",
    videoUrl: "https://www.youtube.com/watch?v=0kG7yZ6P3xQ",
    genres: ["Metroidvania", "Puzzle", "Pixel Art"],
    criticReviews: [
      { id: "c10", author: "Destructoid", score: 90, date: "May 9, 2024", content: "A hauntingly beautiful puzzle box of a game with non-linear ingenuity and mind-bending puzzle depths.", type: "critic" }
    ],
    userReviews: [
      { id: "u9", author: "PixelExplorer", score: 9, date: "May 12, 2024", content: "The visual effects engine and sound design create an unforgettable eerie mood.", type: "user" }
    ]
  },
  {
    title: "Tekken 8",
    slug: "tekken-8",
    coverImage: "https://www.metacritic.com/a/img/resize/75db9be09000a6f81a700508a8ff717b01d3688b/catalog/provider/2/3/2-1051992-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PS5", metascore: 90, userscore: 7.7 },
      { platform: "PC", metascore: 90, userscore: 7.5 },
      { platform: "Xbox Series X", metascore: 89, userscore: 7.8 }
    ],
    primaryPlatform: "PS5",
    metascore: 90,
    userscore: 7.7,
    developer: "Bandai Namco Studios",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "Jan 26, 2024",
    description: "Fist Meets Fate in Tekken 8. Powered by Unreal Engine 5, featuring the revolutionary Heat System and intense 3D fighting combat.",
    videoUrl: "https://www.youtube.com/watch?v=2r1o_zO2rEE",
    genres: ["Fighting", "3D", "Competitive"],
    criticReviews: [
      { id: "c11", author: "Push Square", score: 90, date: "Jan 25, 2024", content: "Tekken 8 is the absolute peak of 3D fighting games right now. The Heat System injects blistering aggression.", type: "critic" }
    ],
    userReviews: [
      { id: "u10", author: "MishimaFighter", score: 8, date: "Jan 29, 2024", content: "Combat feel and graphics are unmatched. Netcode is solid, though microtransaction shop later added sparked debate.", type: "user" }
    ]
  },
  {
    title: "Silent Hill 2 Remake",
    slug: "silent-hill-2",
    coverImage: "https://www.metacritic.com/a/img/resize/9852f6b3cfdcba6554e2091c5e9f8f2b7a95058c/catalog/provider/2/3/2-1077732-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PS5", metascore: 86, userscore: 9.3 },
      { platform: "PC", metascore: 86, userscore: 9.1 }
    ],
    primaryPlatform: "PS5",
    metascore: 86,
    userscore: 9.3,
    developer: "Bloober Team",
    publisher: "Konami",
    releaseDate: "Oct 8, 2024",
    description: "Having received a letter from his deceased wife, James heads to where they shared so many memories: Silent Hill. A psychological survival horror masterpiece remade.",
    videoUrl: "https://www.youtube.com/watch?v=pyC_qiW_eGM",
    genres: ["Survival Horror", "Psychological Horror", "Action"],
    criticReviews: [
      { id: "c12", author: "VGC", score: 90, date: "Oct 5, 2024", content: "Bloober Team has delivered a faithful, haunting, and terrifyingly atmospheric recreation of a classic.", type: "critic" }
    ],
    userReviews: [
      { id: "u11", author: "JamesSunderland", score: 10, date: "Oct 10, 2024", content: "Exceeded all expectations. The sound design with headphones is nerve-shreddingly good.", type: "user" }
    ]
  },
  {
    title: "Helldivers 2",
    slug: "helldivers-2",
    coverImage: "https://www.metacritic.com/a/img/resize/97ebc1f09bbda45c10ad8ca50e30396013a77fcb/catalog/provider/2/3/2-1052844-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 82, userscore: 8.2 },
      { platform: "PS5", metascore: 82, userscore: 8.0 }
    ],
    primaryPlatform: "PS5",
    metascore: 82,
    userscore: 8.2,
    developer: "Arrowhead Game Studios",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "Feb 8, 2024",
    description: "Join the Helldivers and fight for freedom with friends across a hostile galaxy in a fast, frantic, and ferocious third-person co-op shooter.",
    videoUrl: "https://www.youtube.com/watch?v=l8bW0M0pE8c",
    genres: ["Co-op Shooter", "Third-Person", "Sci-Fi"],
    criticReviews: [
      { id: "c13", author: "GamesRadar+", score: 85, date: "Feb 14, 2024", content: "Hilarious, chaotic, and relentlessly entertaining co-op firepower against hordes of bugs and bots.", type: "critic" }
    ],
    userReviews: [
      { id: "u12", author: "SuperEarthCitizen", score: 9, date: "Feb 16, 2024", content: "For Democracy! Best co-op experience with friends in years. Friendly fire makes for hilarious moments.", type: "user" }
    ]
  },
  {
    title: "Like a Dragon: Infinite Wealth",
    slug: "like-a-dragon-infinite-wealth",
    coverImage: "https://www.metacritic.com/a/img/resize/920ba011f0624d6faefebf1a3ebc453caeb91bf1/catalog/provider/2/3/2-1051511-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PS5", metascore: 89, userscore: 8.5 },
      { platform: "PC", metascore: 89, userscore: 8.7 },
      { platform: "Xbox Series X", metascore: 92, userscore: 8.8 }
    ],
    primaryPlatform: "PS5",
    metascore: 89,
    userscore: 8.5,
    developer: "Ryu Ga Gotoku Studio",
    publisher: "Sega",
    releaseDate: "Jan 26, 2024",
    description: "Two larger-than-life heroes brought together by the hand of fate: Ichiban Kasuga and Kazuma Kiryu. Live it up in Japan and explore all that Hawaii has to offer.",
    videoUrl: "https://www.youtube.com/watch?v=eQ0pZqW-u9I",
    genres: ["JRPG", "Turn-Based", "Comedy/Crime"],
    criticReviews: [
      { id: "c14", author: "IGN", score: 90, date: "Jan 24, 2024", content: "Endlessly charming, filled with mini-games, and emotionally rich with both humor and tears.", type: "critic" }
    ],
    userReviews: [
      { id: "u13", author: "IchibanHero", score: 9, date: "Jan 30, 2024", content: "Dondoko Island resort builder inside this RPG could be its own standalone game. Fantastic sequel.", type: "user" }
    ]
  },
  {
    title: "Dragon's Dogma 2",
    slug: "dragons-dogma-2",
    coverImage: "https://www.metacritic.com/a/img/resize/f0be10be6ffc1f03f3fb4c87cb7884ec88722a27/catalog/provider/2/3/2-1051877-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PS5", metascore: 86, userscore: 6.8 },
      { platform: "PC", metascore: 88, userscore: 6.5 },
      { platform: "Xbox Series X", metascore: 86, userscore: 6.7 }
    ],
    primaryPlatform: "PC",
    metascore: 86,
    userscore: 6.8,
    developer: "Capcom",
    publisher: "Capcom",
    releaseDate: "Mar 22, 2024",
    description: "Dragon's Dogma 2 is a narrative driven action-RPG that challenges players to choose their own experience – from the appearance of their Arisen to their vocation and Pawns.",
    videoUrl: "https://www.youtube.com/watch?v=7u203vP2kR4",
    genres: ["Action RPG", "Open World", "Fantasy"],
    criticReviews: [
      { id: "c15", author: "Polygon", score: 90, date: "Mar 20, 2024", content: "An emergent gameplay triumph that treats player curiosity with respect, filled with unforgettable monsters.", type: "critic" }
    ],
    userReviews: [
      { id: "u14", author: "ArisenPawn", score: 7, date: "Mar 25, 2024", content: "Combat and Pawn interactions are top tier, but city frame drops on PC were rough at launch.", type: "user" }
    ]
  },
  {
    title: "Shin Megami Tensei V: Vengeance",
    slug: "shin-megami-tensei-v-vengeance",
    coverImage: "https://www.metacritic.com/a/img/resize/81e57c6b4458fef56f2f9c3eb7d949b28b76c8c4/catalog/provider/2/3/2-1064319-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "Nintendo Switch", metascore: 87, userscore: 8.8 },
      { platform: "PS5", metascore: 90, userscore: 8.9 },
      { platform: "PC", metascore: 89, userscore: 8.8 }
    ],
    primaryPlatform: "Nintendo Switch",
    metascore: 87,
    userscore: 8.8,
    developer: "Atlus",
    publisher: "Sega",
    releaseDate: "Jun 14, 2024",
    description: "Embark on this definitive version of the critically acclaimed Shin Megami Tensei V, massively expanded with a brand-new storyline featuring new locations and demons.",
    videoUrl: "https://www.youtube.com/watch?v=rU0_8pZ_pT8",
    genres: ["JRPG", "Turn-Based", "Post-Apocalyptic"],
    criticReviews: [
      { id: "c16", author: "Nintendo Life", score: 90, date: "Jun 13, 2024", content: "The Canon of Vengeance fixes previous story shortcomings while adding tremendous quality-of-life additions.", type: "critic" }
    ],
    userReviews: [
      { id: "u15", author: "NahobinoLord", score: 9, date: "Jun 18, 2024", content: "Smooth 60fps on PS5 and PC makes demon negotiations and combat a joy.", type: "user" }
    ]
  },
  {
    title: "Warhammer 40,000: Space Marine 2",
    slug: "warhammer-40000-space-marine-2",
    coverImage: "https://www.metacritic.com/a/img/resize/9852f6b3cfdcba6554e2091c5e9f8f2b7a95058c/catalog/provider/2/3/2-1056581-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 82, userscore: 8.0 },
      { platform: "PS5", metascore: 82, userscore: 8.1 },
      { platform: "Xbox Series X", metascore: 83, userscore: 8.2 }
    ],
    primaryPlatform: "PC",
    metascore: 82,
    userscore: 8.0,
    developer: "Saber Interactive",
    publisher: "Focus Entertainment",
    releaseDate: "Sep 9, 2024",
    description: "Embody the superhuman skill and brutality of a Space Marine. Unleash deadly abilities and devastating weaponry to obliterate relentless Tyranid swarms.",
    videoUrl: "https://www.youtube.com/watch?v=9_dF42jE7vM",
    genres: ["Third-Person Shooter", "Action", "Co-op"],
    criticReviews: [
      { id: "c17", author: "PC Invasion", score: 85, date: "Sep 6, 2024", content: "Visceral, heavy, and delightfully gory. Saber Interactive perfectly nails the sheer scale of the 40K universe.", type: "critic" }
    ],
    userReviews: [
      { id: "u16", author: "UltramarineTitus", score: 9, date: "Sep 11, 2024", content: "The Swarm Engine rendering thousands of Tyranids on screen at once is technical wizardry.", type: "user" }
    ]
  },
  {
    title: "Prince of Persia: The Lost Crown",
    slug: "prince-of-persia-the-lost-crown",
    coverImage: "https://www.metacritic.com/a/img/resize/93ff868c22dc9b3da27ff017f8b9e69c10816cf6/catalog/provider/2/3/2-1052678-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "Nintendo Switch", metascore: 86, userscore: 8.5 },
      { platform: "PS5", metascore: 86, userscore: 8.6 },
      { platform: "PC", metascore: 85, userscore: 8.3 }
    ],
    primaryPlatform: "Nintendo Switch",
    metascore: 86,
    userscore: 8.5,
    developer: "Ubisoft Montpellier",
    publisher: "Ubisoft",
    releaseDate: "Jan 18, 2024",
    description: "Dash into a stylish and thrilling action-adventure platformer set in a mythological Persian world where the boundaries of time and space are yours to manipulate.",
    videoUrl: "https://www.youtube.com/watch?v=w0vD4828f_U",
    genres: ["Metroidvania", "Action", "Platformer"],
    criticReviews: [
      { id: "c18", author: "GameSpot", score: 90, date: "Jan 16, 2024", content: "Razor-sharp platforming, inventive time powers, and revolutionary screenshot map pins make this a genre standout.", type: "critic" }
    ],
    userReviews: [
      { id: "u17", author: "PersianGamer", score: 9, date: "Jan 21, 2024", content: "Plays butter-smooth at 60fps on Switch. Boss fights push your timing and reflexes in the best way.", type: "user" }
    ]
  },
  {
    title: "The Legend of Zelda: Echoes of Wisdom",
    slug: "the-legend-of-zelda-echoes-of-wisdom",
    coverImage: "https://www.metacritic.com/a/img/resize/f24d772ecf9909241b12b5ea912f718aa66bb0c8/catalog/provider/2/3/2-1070543-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [{ platform: "Nintendo Switch", metascore: 86, userscore: 8.2 }],
    primaryPlatform: "Nintendo Switch",
    metascore: 86,
    userscore: 8.2,
    developer: "Nintendo / Grezzo",
    publisher: "Nintendo",
    releaseDate: "Sep 26, 2024",
    description: "Save the kingdom of Hyrule – this time with the wisdom of Princess Zelda. Create 'echoes' of objects and monsters to solve intricate environmental puzzles.",
    videoUrl: "https://www.youtube.com/watch?v=9jP8c3f_0Xw",
    genres: ["Action-Adventure", "Puzzle", "Fantasy"],
    criticReviews: [
      { id: "c19", author: "IGN", score: 90, date: "Sep 25, 2024", content: "Zelda stepping into the starring role brings a fresh, highly playful puzzle sandbox that rewards experimentation.", type: "critic" }
    ],
    userReviews: [
      { id: "u18", author: "HyruleHero", score: 8, date: "Sep 28, 2024", content: "The echo creation system gives so much creative freedom. Minor framerate drops in the overworld.", type: "user" }
    ]
  },
  {
    title: "Frostpunk 2",
    slug: "frostpunk-2",
    coverImage: "https://www.metacritic.com/a/img/resize/b97ff64205874251cbbe9c18f8e71b2d7112005e/catalog/provider/2/3/2-1053421-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [{ platform: "PC", metascore: 85, userscore: 7.2 }],
    primaryPlatform: "PC",
    metascore: 85,
    userscore: 7.2,
    developer: "11 bit studios",
    publisher: "11 bit studios",
    releaseDate: "Sep 20, 2024",
    description: "Discover a city-survival game set 30 years after an apocalyptic blizzard ravaged Earth. Build your city at a new scale, balancing districts and political factions.",
    videoUrl: "https://www.youtube.com/watch?v=0kF_3r7_pQQ",
    genres: ["City Builder", "Survival", "Strategy"],
    criticReviews: [
      { id: "c20", author: "PC Gamer", score: 85, date: "Sep 17, 2024", content: "A grander and politically tenser evolution of the frostbitten society simulator, shifting focus to ideological conflict.", type: "critic" }
    ],
    userReviews: [
      { id: "u19", author: "StewardOfNewLondon", score: 7, date: "Sep 22, 2024", content: "The district system changes the micro scale of FP1, but the Council voting mechanics are brilliantly tense.", type: "user" }
    ]
  },
  {
    title: "Neva",
    slug: "neva",
    coverImage: "https://www.metacritic.com/a/img/resize/81e57c6b4458fef56f2f9c3eb7d949b28b76c8c4/catalog/provider/2/3/2-1076541-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 86, userscore: 8.9 },
      { platform: "PS5", metascore: 87, userscore: 9.0 },
      { platform: "Nintendo Switch", metascore: 85, userscore: 8.7 }
    ],
    primaryPlatform: "PC",
    metascore: 86,
    userscore: 8.9,
    developer: "Nomada Studio",
    publisher: "Devolver Digital",
    releaseDate: "Oct 15, 2024",
    description: "From the visionary team behind the acclaimed GRIS, Neva chronicles the story of Alba, a young woman bound to a curious wolf cub following a traumatic encounter.",
    videoUrl: "https://www.youtube.com/watch?v=7u0_0pZ_xW8",
    genres: ["Action-Adventure", "Artistic", "Platformer"],
    criticReviews: [
      { id: "c21", author: "Eurogamer", score: 90, date: "Oct 14, 2024", content: "An emotionally devastating, watercolor-drenched tour de force that builds upon Gris with fluid combat.", type: "critic" }
    ],
    userReviews: [
      { id: "u20", author: "ArtGamer", score: 9, date: "Oct 17, 2024", content: "The bond with the wolf cub will break your heart and mend it again. Outstanding soundtrack.", type: "user" }
    ]
  },
  {
    title: "STALKER 2: Heart of Chornobyl",
    slug: "stalker-2-heart-of-chornobyl",
    coverImage: "https://www.metacritic.com/a/img/resize/75db9be09000a6f81a700508a8ff717b01d3688b/catalog/provider/2/3/2-1049912-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "PC", metascore: 74, userscore: 7.9 },
      { platform: "Xbox Series X", metascore: 74, userscore: 7.8 }
    ],
    primaryPlatform: "PC",
    metascore: 74,
    userscore: 7.9,
    developer: "GSC Game World",
    publisher: "GSC Game World",
    releaseDate: "Nov 20, 2024",
    description: "Discover the vast Chornobyl Exclusion Zone full of dangerous enemies, deadly anomalies, and powerful artifacts in this dark post-apocalyptic open-world FPS.",
    videoUrl: "https://www.youtube.com/watch?v=8pA0_zW_eX4",
    genres: ["FPS", "Survival Horror", "Open World"],
    criticReviews: [
      { id: "c22", author: "Windows Central", score: 80, date: "Nov 20, 2024", content: "Unrivaled atmosphere, unforgiving gunplay, and an authentically terrifying radioactive wilderness.", type: "critic" }
    ],
    userReviews: [
      { id: "u21", author: "ZoneStalker", score: 8, date: "Nov 22, 2024", content: "Atmosphere is a 10/10. AI and bugs need post-launch patches, but this is the real Stalker experience we wanted.", type: "user" }
    ]
  },
  {
    title: "Indiana Jones and the Great Circle",
    slug: "indiana-jones-and-the-great-circle",
    coverImage: "https://www.metacritic.com/a/img/resize/8ba4efadceb3b248a39e87900b904cf7b8a82d02/catalog/provider/2/3/2-1067210-53.jpg?auto=webp&fit=cover&height=300&width=200",
    platforms: [
      { platform: "Xbox Series X", metascore: 86, userscore: 8.4 },
      { platform: "PC", metascore: 87, userscore: 8.5 }
    ],
    primaryPlatform: "Xbox Series X",
    metascore: 86,
    userscore: 8.4,
    developer: "MachineGames",
    publisher: "Bethesda Softworks",
    releaseDate: "Dec 9, 2024",
    description: "Uncover one of history’s greatest mysteries in Indiana Jones and the Great Circle, a first-person, single-player adventure set between the events of Raiders of the Lost Ark and The Last Crusade.",
    videoUrl: "https://www.youtube.com/watch?v=kY0w_vQ9xT8",
    genres: ["Action-Adventure", "First-Person", "Cinematic"],
    criticReviews: [
      { id: "c23", author: "IGN", score: 90, date: "Dec 6, 2024", content: "MachineGames nails the cinematic spirit of Indiana Jones with smart puzzle-solving and tactile whip mechanics.", type: "critic" }
    ],
    userReviews: [
      { id: "u22", author: "IndyFan89", score: 9, date: "Dec 11, 2024", content: "Troy Baker's voice performance as Indy is uncanny. The globe-trotting ruins and stealth are thrilling.", type: "user" }
    ]
  }
];
