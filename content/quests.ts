export type Item = "modak" | "diya" | "star" | "laddoo";
export type ShapeName = "circle" | "triangle" | "square" | "rectangle";

export type Game =
  | { type: "count"; item: Item; rounds: number[] }
  | { type: "flash"; item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[] }
  | { type: "giveN"; item: Item; rounds: number[] }
  | { type: "conserve"; item: Item; rounds: number[] }
  | { type: "compare"; item: Item; rounds: [number, number][] }
  | { type: "pattern"; rounds: string[][] }
  | { type: "shapes"; rounds: ShapeName[] }
  | { type: "mixed"; parts: Game[] }
  | { type: "check"; items: number[] };

export type Bg = "feast" | "temple" | "night" | "kitchen" | "sky";
export type Mood = "happy" | "confused" | "excited" | "thinking";

export interface Scene {
  bg: Bg;
  cast?: ("ganesha" | "mooshak")[];
  mood?: Mood;
  web?: boolean;
  swing?: boolean;
  items?: { item: Item; n: number; on?: "plate" | "web" | "floor" };
  big?: string;
}

export interface Panel { t: string; s: Scene }

export type Demo =
  | { type: "count"; item: Item; n: number }
  | { type: "glance"; item: Item; n: number }
  | { type: "giveN"; item: Item; n: number; pile: number }
  | { type: "frame5"; n: number }
  | { type: "conserve"; item: Item; n: number }
  | { type: "match"; item: Item; a: number; b: number }
  | { type: "dice"; n: number }
  | { type: "pattern"; seq: string[] }
  | { type: "shape"; shape: ShapeName }
  | { type: "number"; n: number }
  | { type: "scene"; scene: Scene };

export interface LearnStep { t: string; demo: Demo }

export interface Quest {
  day: number;
  title: string;
  costars: string[];
  skill: string;
  review: string[];
  power: { name: string; desc: string };
  story: Panel[];
  learn: LearnStep[];
  talk?: string;
  game: Game;
  gameName: string;
  physical?: { title: string; steps: string[] };
  mistake?: { item: Item; shown: number; claim: number };
  easyWin: { item: Item; n: number };
  teaser: string;
}

export interface Arc {
  id: number;
  title: string;
  costars: string;
  days: [number, number];
  trophy: string;
}

export const ARCS: Arc[] = [
  { id: 1, title: "The Modak Mission", costars: "Ganesha + Spider-Man", days: [1, 14], trophy: "Golden Modak" },
  { id: 2, title: "The Great Leap", costars: "Hanuman + Iron Man", days: [15, 28], trophy: "Hanuman's Mace" },
  { id: 3, title: "The Hidden and the Missing", costars: "Durga + Captain America and Thor", days: [29, 42], trophy: "Durga's Lion Badge" },
  { id: 4, title: "Butter, Smash and Assemble", costars: "Krishna + Hulk", days: [43, 60], trophy: "Krishna's Flute" },
];

export const CARDS = [
  { name: "Mooshak", world: "Guide", color: "#8d6e63" },
  { name: "Ganesha", world: "Mythology", color: "#ef6c00" },
  { name: "Spider-Man", world: "Superhero", color: "#d32f2f" },
  { name: "Hanuman", world: "Mythology", color: "#e65100" },
  { name: "Iron Man", world: "Superhero", color: "#b71c1c" },
  { name: "Durga", world: "Mythology", color: "#c2185b" },
  { name: "Captain America", world: "Superhero", color: "#1565c0" },
  { name: "Krishna", world: "Mythology", color: "#283593" },
  { name: "Hulk", world: "Superhero", color: "#2e7d32" },
  { name: "Shiva", world: "Mythology", color: "#455a64" },
  { name: "Thor", world: "Superhero", color: "#5d4037" },
  { name: "Ram", world: "Mythology", color: "#00838f" },
];

export const STARS_PER_CARD = 10;

const F = (o: Partial<Scene> = {}): Scene => ({ bg: "feast", ...o });

export const QUESTS: Quest[] = [
  {
    day: 1, title: "Mooshak ko helper chahiye", costars: ["Mooshak", "Ganesha", "Spider-Man"], skill: "C2", review: [],
    power: { name: "Helper Badge", desc: "Tum Ganesha ji ke official Modak Helper ho!" },
    story: [
      { t: "Bahut door, Kailash parvat par rehte hain Ganesha ji. Badi si tummy, lambi si soond, aur bahut bada dil!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "Do hafte baad Ganesha ji ka birthday hai! Unhe chahiye modak - meethe meethe, soft soft modak - saare dosto ke liye.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Unka best friend hai Mooshak, ek chhota sa chuha. Mooshak Ganesha ji ko har jagah le jaata hai. Par Mooshak ki ek problem hai...", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "\"Itne saare modak!\" Mooshak bola. \"Ek, do, teen... arre, phir bhool gaya! Main toh itna chhota hoon, sab kaise ginunga?\"", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 8, on: "floor" } }) },
      { t: "Whoosh! Spider-Man apne jaal par jhoolte hue aaya. \"Main modak apne jaal mein la sakta hoon,\" woh bola. \"Par ginega kaun?\"", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 4, on: "web" } } },
      { t: "Mooshak ne idhar dekha, udhar dekha... aur phir TUMHE dekha. \"Medhu! Mera helper banoge? Tum toh counting mein super ho!\"", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "\"Par pehle,\" Mooshak bola, \"har helper ka ek Helper Test hota hai. Papa tumhare saath asli cheezon se khelenge. Ready?\"", s: F({ cast: ["ganesha", "mooshak"], mood: "happy" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 1",
    game: { type: "check", items: [1, 2, 3, 4] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Kal: Helper Test ka part 2!",
  },
  {
    day: 2, title: "Helper test, part 2", costars: ["Mooshak", "Spider-Man"], skill: "S1", review: [],
    power: { name: "Brave Helper", desc: "Tumne Helper Test ka part 2 kar liya!" },
    story: [
      { t: "Mooshak naach raha hai! \"Medhu, tumne Helper Test ka part 1 kar liya! Ganesha ji bahut khush hain!\"", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "Spider-Man ka ek game hai. Woh apne jaal ke peeche kuch modak chhupa deta hai aur poochta hai, \"Kitne chhupe hain?\"", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "Ganesha ji apne mandir se dekh rahe hain. Unki soond upar, upar, upar ja rahi hai. Matlab woh excited hain!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "\"Part 2 thoda tricky hai,\" Mooshak bola. \"Aaram se socho. Sochna achhi baat hai!\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 2",
    game: { type: "check", items: [5, 6, 7, 8] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Kal: Helper Test ka last part!",
  },
  {
    day: 3, title: "Helper test, part 3", costars: ["Mooshak", "Ganesha"], skill: "R1", review: [],
    power: { name: "Official Modak Helper", desc: "Tumne poora Helper Test kar liya!" },
    story: [
      { t: "\"Last part!\" Mooshak table par kood kar bola.", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "Aaj sawaal Ganesha ji poochenge. Bade numbers, zyada modak. Kuch toh puzzle bhi hain!", s: F({ cast: ["ganesha"], items: { item: "modak", n: 7, on: "plate" } }) },
      { t: "\"Yeh kar lo,\" Ganesha ji bole, \"aur tum ban jaoge mere official Modak Helper. Phir shuru hoga asli mission!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"] } },
    ],
    learn: [],
    gameName: "Helper Test, part 3",
    game: { type: "check", items: [9, 10, 11, 12] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Kal: tumhara pehla asli modak mission!",
  },
  {
    day: 4, title: "Last number wala trick", costars: ["Mooshak", "Spider-Man"], skill: "C2", review: ["S1"],
    power: { name: "Last Number Power", desc: "Jo number tum last mein bolte ho, utne hi cheezein hoti hain." },
    story: [
      { t: "Ganesha ji ne tumhe ek chamakta hua helper badge diya. Ab tum ho official Modak Helper!", s: F({ cast: ["ganesha"], big: "★" }) },
      { t: "Spider-Man pehle modak apne jaal mein laaya. Swish, swish! Usne unhe plate par rakh diya.", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "Mooshak ne gina: \"Ek, do, teen, chaar, paanch.\" Ganesha ji ne poocha, \"Toh Mooshak, kitne modak hain?\"", s: F({ cast: ["ganesha", "mooshak"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Aur Mooshak ne PHIR se ginna shuru kar diya! \"Ek, do, teen, chaar, paanch...\" Baar baar, baar baar. Bechara thak gaya!", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "\"Medhu,\" Mooshak ne ubaasi li, \"koi trick hai kya, taaki baar baar ginna na pade?\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "Haan! Ek secret trick hai. Chalo pehle hum seekhte hain, phir Mooshak ko sikhayenge.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "Yeh rahe kuch modak. Chalo saath mein ginte hain. Har modak ko sirf EK baar touch karna.", demo: { type: "count", item: "modak", n: 4 } },
      { t: "Humne bola ek, do, teen, chaar. Sabse LAST number tha chaar.", demo: { type: "number", n: 4 } },
      { t: "Yahi hai trick: last number batata hai KITNE hain. Toh chaar modak hain. Dobara ginne ki zaroorat nahi!", demo: { type: "count", item: "modak", n: 4 } },
      { t: "Ab zyada modak ke saath. Mere saath gino... last number hai chhah. Toh chhah modak hain!", demo: { type: "count", item: "modak", n: 6 } },
    ],
    talk: "Medhu se Papa ki ek haath ki ungliyan ginwao, phir poocho \"Toh kitni hain?\" - woh bina dobara gine 5 bole.",
    gameName: "Gino aur Batao",
    game: { type: "count", item: "modak", rounds: [3, 5, 4, 6, 7] },
    physical: { title: "Modak counting", steps: ["4-7 chhoti cheezein line mein rakho.", "Medhu har ek ko touch karke gine.", "Poocho \"Toh kitne hain?\" - bina dobara gine jawab de."] },
    mistake: { item: "modak", shown: 4, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Kal: Spider-Man ka super-fast jaal!",
  },
  {
    day: 5, title: "Super aankhen", costars: ["Spider-Man", "Mooshak"], skill: "S1", review: ["C2"],
    power: { name: "Super Eyes (1-3)", desc: "Tum 1, 2 ya 3 ek nazar mein dekh lete ho, bina gine." },
    story: [
      { t: "Aaj Spider-Man bahut jaldi mein hai. Woh aasmaan mein ITNI tezi se jhoolta hai. Whoosh!", s: { bg: "sky", swing: true, web: true } },
      { t: "Uske jaal mein modak chamakte hain - aur phir gaayab! Ek ek karke ginne ka time hi nahi hai.", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "\"Kitne dekhe?\" Spider-Man ne poocha. Mooshak ne aankhen band kar li. \"Bahut fast hai mere liye!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "Par superheroes ke paas ek trick hai: SUPER AANKHEN. Super aankhon se chhote numbers ek nazar mein dikh jaate hain.", s: F({ cast: ["mooshak"], mood: "excited", big: "1 2 3" }) },
    ],
    learn: [
      { t: "Yeh dekho. Ek modak. Isko ginna nahi padta. Tumhe bas pata hai ki yeh ek hai. Ek!", demo: { type: "glance", item: "modak", n: 1 } },
      { t: "Do modak. Ek jodi, jaise tumhari do aankhen ya do haath. Bas dekho: do!", demo: { type: "glance", item: "modak", n: 2 } },
      { t: "Teen modak aksar triangle jaise baithte hain. Dekho... teen!", demo: { type: "glance", item: "modak", n: 3 } },
      { t: "Yahi hain super aankhen: ek baar dekho, aur number bolo. Na touch, na counting. Chalo Flash khelein!", demo: { type: "glance", item: "modak", n: 2 } },
    ],
    talk: "1, 2 ya 3 ungliyan ek second ke liye dikhao aur chhupa lo. Medhu number bole!",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [2, 1, 3, 2, 3, 1] },
    mistake: { item: "modak", shown: 3, claim: 2 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Kal: Mooshak ki modak dukaan!",
  },
  {
    day: 6, title: "Mooshak ki modak dukaan", costars: ["Mooshak", "Ganesha"], skill: "C3", review: ["S1", "C2"],
    power: { name: "Exactly Power", desc: "Jo jitna maange, tum exactly utna de sakte ho." },
    story: [
      { t: "Mooshak ko ek idea aaya. \"Chalo party ke liye ek modak dukaan kholte hain!\" Usne ek chhota sa board laga diya.", s: { bg: "kitchen", cast: ["mooshak"], mood: "excited", items: { item: "modak", n: 10, on: "floor" } } },
      { t: "Aur dukaandaar ho TUM! Tumhara kaam hai har dost ko utne modak dena, jitne woh maange.", s: { bg: "kitchen", cast: ["mooshak"], items: { item: "modak", n: 10, on: "floor" } } },
      { t: "Sabse pehle aaye Ganesha ji. \"Mujhe chaar modak dena, please.\"", s: { bg: "kitchen", cast: ["ganesha"], big: "4" } },
      { t: "Mooshak ne help karni chahi. Usne mutthi bhar ke Ganesha ji ko de diye... saat! \"Arre! Bahut zyada!\" Ganesha ji hans pade.", s: { bg: "kitchen", cast: ["ganesha", "mooshak"], mood: "confused", items: { item: "modak", n: 7, on: "plate" } } },
      { t: "Achha dukaandaar EXACTLY utna deta hai jitna maanga. Na ek zyada, na ek kam. Chalo seekhte hain kaise.", s: { bg: "kitchen", cast: ["mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "Kisi ne chaar maange. Chaar number ko dimaag mein rakho. Bolo: \"chaar!\"", demo: { type: "number", n: 4 } },
      { t: "Ab modak ko EK EK karke plate par rakho, aur saath mein gino: ek... do... teen... chaar.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "Jaise hi chaar bola - RUKO! Yahi number maanga tha. Plate par exactly chaar.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "Ek baar aur dekho, chhah ke saath. Rakho, gino, aur chhah par RUKO.", demo: { type: "giveN", item: "modak", n: 6, pile: 9 } },
    ],
    talk: "Medhu se bolo: \"Mujhe exactly 3 chammach do.\" Kya woh 3 par ruka?",
    gameName: "Modak Dukaan",
    game: { type: "giveN", item: "modak", rounds: [3, 5, 4, 6, 8] },
    physical: { title: "Asli modak dukaan", steps: ["15 chhoti cheezon ka dher banao.", "Aap customer bano: \"Mujhe 6 dena please!\"", "Check karo: kya woh 6 par ruka? 4, 7, 8 bhi try karo."] },
    mistake: { item: "modak", shown: 6, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Kal: Spider-Man ka jaal aur bhi fast!",
  },
  {
    day: 7, title: "Super aankhen level 2", costars: ["Spider-Man", "Mooshak"], skill: "S2", review: ["S1", "C3"],
    power: { name: "Super Eyes (4-5)", desc: "Tum 4 aur 5 ek nazar mein dekh lete ho." },
    story: [
      { t: "Spider-Man ka naya trick! Ab uska jaal ek saath chaar ya paanch modak pakadta hai!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "Mooshak ginne ki koshish karta hai, par jaal bahut fast hai. \"Ek, do... kahan gaye?\"", s: { bg: "sky", cast: ["mooshak"], mood: "confused" } },
      { t: "Tumhari super aankhon ko level up karna hoga! Bade numbers ko do chhote groups mein dekh sakte ho.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "Chaar modak aksar square jaise baithte hain, har kone mein ek. Dekho: chaar!", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "Ek secret: chaar matlab do aur do. Do jodiyan! Do jodi dikhe toh chaar.", demo: { type: "dice", n: 4 } },
      { t: "Paanch matlab chaar kone aur beech mein ek. Paanch! Bilkul dice ke paanch jaisa.", demo: { type: "dice", n: 5 } },
      { t: "Ek haath ki saari ungliyan bhi paanch hain. Apna haath dikhao - yeh hai paanch!", demo: { type: "number", n: 5 } },
    ],
    talk: "Jaldi se 4 ya 5 ungliyan dikhao. Poocho: \"Itni jaldi kaise pata chala?\"",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [4, 3, 5, 4, 5, 2] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Kal: Ganesha ji ki special modak trays!",
  },
  {
    day: 8, title: "Ganesha ji ki paanch wali tray", costars: ["Ganesha", "Mooshak"], skill: "P1", review: ["S2"],
    power: { name: "Tray of Five", desc: "Bhari hui paanch wali tray matlab 5 - ginna nahi padta." },
    story: [
      { t: "Ganesha ji apni special sone ki trays laaye. Har tray mein exactly paanch chhote khaane hain.", s: F({ cast: ["ganesha"] }) },
      { t: "\"Har khaane mein ek modak,\" Ganesha ji bole. \"Party ke liye sab ekdum neat.\"", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Mooshak tray bharta hai, phir ginta hai. \"Ek, do, teen, chaar, paanch.\" Phir agli tray. \"Ek, do, teen, chaar, paanch.\" Uff!", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "Ganesha ji muskuraye. \"Mooshak, BHARI hui tray hamesha paanch hoti hai. Ginne ki zaroorat hi nahi!\"", s: F({ cast: ["ganesha", "mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "Yeh hai paanch wali tray. Isme paanch jagah hain. Jab saari bhari hon, toh paanch modak.", demo: { type: "frame5", n: 5 } },
      { t: "Ab kuch jagah khaali hai. Chaar bhari, ek khaali. Poori tray paanch, ek kam, toh chaar.", demo: { type: "frame5", n: 4 } },
      { t: "Yahan teen bhari hain aur do khaali. Bhari wali dekho: teen!", demo: { type: "frame5", n: 3 } },
      { t: "Yaad rakho: bhari tray matlab paanch. Khaali jagah dekh kar bhi help milti hai!", demo: { type: "frame5", n: 5 } },
    ],
    talk: "Paanch ungliyan dikhao - bhara haath bhari tray jaisa! Ek modo: ab kitni?",
    gameName: "Tray Flash",
    game: { type: "flash", item: "modak", layout: "frame5", rounds: [5, 3, 4, 5, 2, 5] },
    physical: { title: "Egg tray bharo", steps: ["Egg tray ke 5 khaane kaat lo.", "Modak ya balls se bharo - \"bhari tray matlab 5!\"", "3 ya 4 bharo: \"kitne hain? kitne khaali?\""] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "Kal: Spider-Man ka jaal hilega!",
  },
  {
    day: 9, title: "Hilta hua jaal", costars: ["Spider-Man", "Mooshak"], skill: "C4", review: ["P1", "C2"],
    power: { name: "Still-the-Same Power", desc: "Cheezein idhar udhar karne se ginti nahi badalti." },
    story: [
      { t: "Spider-Man ne apne jaal par chhah modak ek seedhi line mein rakhe. Mooshak ne gina: \"Chhah modak!\"", s: { bg: "sky", web: true, items: { item: "modak", n: 6, on: "web" } } },
      { t: "Achaanak - WHOOOSH! - zor ki hawa chali. Jaal hilne laga, dolne laga!", s: { bg: "sky", web: true, swing: true } },
      { t: "Modak idhar udhar ludhak gaye. Ab woh door door bikhre hue hain.", s: { bg: "sky", items: { item: "modak", n: 6, on: "floor" } } },
      { t: "Mooshak chillaya, \"Arre! Kuch kho gaye kya? Zyada lag rahe hain! Ya kam? Pata nahi!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "Hmm. Jab cheezein idhar udhar hoti hain, kya number badal jaata hai? Chalo pata karte hain.", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "Yeh rahe paanch modak line mein. Gino: ek, do, teen, chaar, paanch. Toh paanch hain.", demo: { type: "count", item: "modak", n: 5 } },
      { t: "Ab dekho. Modak hilte hain aur bikhar jaate hain. Kisi ne modak joda? Nahi. Kisi ne liya? Nahi.", demo: { type: "conserve", item: "modak", n: 5 } },
      { t: "Toh ab bhi paanch hi hain! Idhar udhar karne se ginti nahi badalti.", demo: { type: "number", n: 5 } },
      { t: "Sirf jodne ya nikaalne se number badalta hai. Bikharne se nahi!", demo: { type: "conserve", item: "modak", n: 4 } },
    ],
    talk: "5 khilaune line mein rakho, gino, phir bikhar do. Poocho: \"Ab bhi 5? Kaise pata?\"",
    gameName: "Hilta Jaal",
    game: { type: "conserve", item: "modak", rounds: [4, 6, 5, 7] },
    physical: { title: "Bikhra do", steps: ["6 cheezein line mein saath gino.", "Medhu ke saamne unhe door door bikhra do.", "\"Ab kitne?\" - kya use bina gine pata hai ki ab bhi 6?"] },
    mistake: { item: "modak", shown: 6, claim: 7 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Kal: kis plate mein zyada?",
  },
  {
    day: 10, title: "Kis plate mein zyada?", costars: ["Ganesha", "Spider-Man"], skill: "R2", review: ["C4", "S2"],
    power: { name: "More-or-Less Power", desc: "Tum pata kar sakte ho kis group mein zyada hai." },
    story: [
      { t: "Party ke liye do plate ready hain: ek Ganesha ji ki, ek Spider-Man ki.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Ganesha ji bole, \"Birthday mera hai! Mujhe ZYADA modak wali plate milni chahiye!\"", s: F({ cast: ["ganesha"], mood: "excited" }) },
      { t: "Spider-Man ne apne modak door door phaila diye. Ab uski plate BADI dikh rahi hai. Par kya sach mein zyada hain?", s: { bg: "sky", web: true, items: { item: "modak", n: 4, on: "floor" } } },
      { t: "Mooshak confuse ho gaya. \"Bada dikhna matlab zyada hona nahi hota! Pakka kaise pata karein?\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
    ],
    learn: [
      { t: "Yeh rahi modak ki do lines. Jodi bana kar dekhte hain kisme zyada hain.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "Upar wala har modak neeche wale ek modak ka haath pakadta hai. Jinka koi partner nahi, woh EXTRA hain.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "Jis line mein extra modak hain, usme ZYADA hain. Neeche wali line mein zyada hain!", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "Dono gin bhi sakte ho: chaar aur chhah. Ginti mein chhah chaar ke baad aata hai, toh chhah zyada hai.", demo: { type: "number", n: 6 } },
    ],
    talk: "Papa ke aage 3 angoor, Medhu ke aage 5. Kiske paas zyada? Kaise pata?",
    gameName: "Zyada ya Kam",
    game: { type: "compare", item: "modak", rounds: [[3, 5], [6, 4], [2, 7], [5, 6], [8, 7]] },
    physical: { title: "Do plate", steps: ["Ek plate par 5, doosri par 7 rakho.", "\"Kisme zyada hain? Kaise pata?\"", "5 wale ko door door phailao - kya woh confuse hota hai?"] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 4 },
    teaser: "Kal: Mooshak ko mila jaadui dice!",
  },
  {
    day: 11, title: "Mooshak ka jaadui dice", costars: ["Mooshak", "Spider-Man"], skill: "S3", review: ["R2", "P1"],
    power: { name: "Dice Eyes", desc: "Tum dice ka koi bhi number ek nazar mein padh lete ho." },
    story: [
      { t: "Ganesha ji ka kamra saaf karte hue Mooshak ko bed ke neeche kuch chamakta hua mila. Ek jaadui dice!", s: { bg: "night", cast: ["mooshak"], mood: "excited" } },
      { t: "Har side par dots hain. Ek dot, do dots, teen dots... chhah dots tak!", s: { bg: "night", cast: ["mooshak"], big: "1-6" } },
      { t: "Spider-Man bola, \"Superheroes dice ke dots kabhi nahi ginte. Unhe PATTERN pata hota hai!\"", s: { bg: "sky", web: true, swing: true } },
    ],
    learn: [
      { t: "Dice ke har number ki apni ek picture hai. Ek matlab beech mein ek dot.", demo: { type: "dice", n: 1 } },
      { t: "Teen ek slide jaisa hai - teen dots neeche ki taraf, jaise slide!", demo: { type: "dice", n: 3 } },
      { t: "Chaar matlab chaar kone. Paanch matlab chaar kone aur beech mein ek.", demo: { type: "dice", n: 5 } },
      { t: "Chhah matlab teen teen ki do lines, jaise do line mein sipahi. Picture yaad karo, ginna kabhi nahi padega!", demo: { type: "dice", n: 6 } },
    ],
    talk: "Asli dice 3 baar ghumao. Medhu bina dots gine number bole.",
    gameName: "Dice Flash",
    game: { type: "flash", item: "modak", layout: "dice", rounds: [3, 5, 4, 6, 2, 5] },
    physical: { title: "Asli dice", steps: ["Saath mein asli dice ghumao.", "Medhu bina dots gine number bole.", "Wahi number ungliyon par bhi dikhaye."] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Kal: party ke liye diye!",
  },
  {
    day: 12, title: "Diyon ka pattern", costars: ["Ganesha", "Mooshak"], skill: "M1", review: ["S3", "R2"],
    power: { name: "Pattern Power", desc: "Tum dekh lete ho kya repeat ho raha hai aur aage kya aayega." },
    story: [
      { t: "Andhera ho raha hai. Party ko roshni chahiye! Ganesha ji bahut saare chhote diye laaye.", s: { bg: "night", cast: ["ganesha"] } },
      { t: "\"Chalo inhe ek sundar pattern mein rakhte hain,\" Ganesha ji bole. \"Laal, neela, laal, neela...\"", s: { bg: "night", cast: ["ganesha"] } },
      { t: "Mooshak help karta hai, par sab mix kar deta hai. Laal, laal, neela, laal... \"Oops! Yeh toh sundar nahi lag raha!\"", s: { bg: "night", cast: ["mooshak"], mood: "confused" } },
    ],
    learn: [
      { t: "Pattern woh hai jo baar baar repeat hota hai. Dekho: laal, neela, laal, neela.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "Woh hissa dhoondo jo repeat hota hai. Yahan hai \"laal, neela\". Phir se shuru.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "Kuch pattern lambe hote hain: neela, neela, laal. Neela, neela, laal. Gaane ki tarah bolo!", demo: { type: "pattern", seq: ["blue", "blue", "red", "blue", "blue", "red"] } },
    ],
    talk: "Taali-pair, taali-pair... aage kya? Body se pattern banao!",
    gameName: "Pattern Maala",
    game: { type: "pattern", rounds: [["red", "blue", "red", "blue", "red"], ["yellow", "green", "yellow", "green"], ["blue", "blue", "red", "blue", "blue"], ["red", "yellow", "red", "yellow", "red", "yellow"]] },
    physical: { title: "Blocks ka pattern", steps: ["Blocks se laal-neela-laal-neela line banao.", "\"Aage kya aayega?\"", "Medhu apna pattern banaye, aap aage badhao."] },
    easyWin: { item: "diya", n: 2 },
    teaser: "Kal: Ganesha ji ka mandir banao!",
  },
  {
    day: 13, title: "Ganesha ji ka mandir", costars: ["Ganesha", "Spider-Man"], skill: "G1", review: ["M1", "S2"],
    power: { name: "Shape Spotter", desc: "Tum circle, triangle, square aur rectangle pehchaante ho." },
    story: [
      { t: "Party Ganesha ji ke mandir mein hogi. Par bade din se pehle mandir ko theek karna hai!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "Spider-Man apne jaal mein building blocks laaya: circle, triangle, square aur rectangle.", s: { bg: "sky", web: true, swing: true } },
      { t: "\"Kaunsi shape kahan jaayegi?\" Ganesha ji ne poocha. \"Sahi shapes dhoondne mein meri help karo!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "Circle gol hota hai, roti jaisa. Iska koi kona nahi hota.", demo: { type: "shape", shape: "circle" } },
      { t: "Triangle ki teen side aur teen kone hote hain. Mandir ka upar wala hissa triangle hai!", demo: { type: "shape", shape: "triangle" } },
      { t: "Square ki chaar side hoti hain, sab ek jaisi, aur chaar kone.", demo: { type: "shape", shape: "square" } },
      { t: "Rectangle ki bhi chaar side aur chaar kone, par yeh lamba hota hai - darwaze jaisa.", demo: { type: "shape", shape: "rectangle" } },
    ],
    talk: "Is kamre mein saath mein ek circle aur ek rectangle dhoondo.",
    gameName: "Shape Quest",
    game: { type: "shapes", rounds: ["circle", "triangle", "square", "rectangle"] },
    physical: { title: "Shape hunt", steps: ["Ghar mein saath mein ghoomo.", "2 circle, 2 rectangle, 1 triangle dhoondo.", "Har ek ka naam lo aur kone gino."] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Kal: BADI PARTY! Aur ek surprise trophy...",
  },
  {
    day: 14, title: "Modak ki badi party", costars: ["Ganesha", "Spider-Man", "Mooshak"], skill: "C2", review: ["S2", "C3", "R2", "P1"],
    power: { name: "Golden Modak", desc: "Tumne Modak Mission poora kar liya!" },
    story: [
      { t: "Aaj Ganesha ji ka birthday hai! Mandir diyon se chamak raha hai, aur saare dost aa gaye hain.", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "excited" } },
      { t: "Spider-Man aakhri modak lekar jhoolta hua aaya. Mooshak table par naach raha hai!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "\"Khaane se pehle,\" Ganesha ji bole, \"mere Modak Helper ko ek aakhri mission karna hai.\"", s: F({ cast: ["ganesha"] }) },
      { t: "SAARI powers lagao: Super Aankhen, Exactly Power, Zyada-Kam aur Paanch wali Tray!", s: F({ cast: ["mooshak"], mood: "excited", big: "★★★" }) },
      { t: "Yeh kar lo, aur Ganesha ji ke paas tumhare liye ek sunehra surprise hai...", s: F({ cast: ["ganesha", "mooshak"] }) },
    ],
    learn: [
      { t: "Jaldi se apni powers yaad karo! Super aankhen: ek nazar mein pata.", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "Exactly Power: ek ek karke rakho, aur number par ruko.", demo: { type: "giveN", item: "modak", n: 5, pile: 8 } },
      { t: "Paanch wali tray: bhari tray hamesha paanch.", demo: { type: "frame5", n: 5 } },
    ],
    talk: "Medhu se poocho uski favourite power kaunsi thi, aur kyun.",
    gameName: "Party Challenge",
    game: {
      type: "mixed",
      parts: [
        { type: "flash", item: "modak", layout: "scatter", rounds: [4, 5] },
        { type: "giveN", item: "modak", rounds: [6] },
        { type: "compare", item: "modak", rounds: [[5, 7]] },
        { type: "flash", item: "modak", layout: "frame5", rounds: [5] },
      ],
    },
    physical: { title: "Helper Test phir se (Sync 1)", steps: ["Aaj ya kal 12-item Medhu Maths Check karo.", "Admin mein Checks ke andar scores daalo, label \"Day 14\"."] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 5 },
    teaser: "Agla arc: Hanuman ji aur Iron Man ki Lanka tak race!",
  },
];

export function questByDay(day: number) {
  return QUESTS.find((q) => q.day === day);
}
