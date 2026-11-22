/* =========================================================
   Europe Villas & Apartments — data
   CONFIG       — общие настройки (количество сделок и т.д.)
   COUNTRIES    — страны, регионы, описания
   VILLAS       — объекты (сейчас генерируются автоматически
                  как демо; позже замените на реальные — см. README)
   ========================================================= */
(function () {
  const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

  window.CONFIG = {
    deals: 3500,          // количество успешных сделок (счётчик на главной)
    heroVideo: "assets/video/hero.mp4", // положите сюда своё видео
    heroImages: [
      U("1613490493576-7fde63acd811", 2000),
      U("1570077188670-e3a8d69ac5ff", 2000),
      U("1499793983690-e29da59ef1c2", 2000),
      U("1533105079780-92b9be482077", 2000)
    ]
  };

  /* ---------- Фото-заглушки (замените своими) ---------- */
  const IMG = {
    sea: ["1613490493576-7fde63acd811", "1613977257363-707ba9348227", "1602343168117-bb8ffe3e2e9f", "1566073771259-6a8506099945",
          "1571896349842-33c89424de2d", "1582268611958-ebfd161ef9cf", "1499793983690-e29da59ef1c2", "1520250497591-112f2f40a3f4",
          "1540541338287-41700207dee6", "1584132967334-10e028bd69f7", "1512917774080-9991f1c4c750"],
    house: ["1600596542815-ffad4c1539a9", "1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6", "1580587771525-78b9dba3b914",
            "1512917774080-9991f1c4c750", "1613490493576-7fde63acd811"],
    chalet: ["1449158743715-0a90ebb6d2d8", "1542718610-a1d656d1884c", "1518780664697-55e3ad937233", "1502784444187-359ac186c5bb"],
    city: ["1522708323590-d24dbb6b0267", "1502672260266-1c1ef2d93688", "1560448204-e02f11c3d0e2", "1493809842364-78817add7ffb"],
    interior: ["1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3", "1600210492486-724fe5c67fb0", "1505693416388-ac5ce068fe85",
               "1615874959474-d609969a20ed", "1618221195710-dd6b41faaea6", "1600121848594-d8644e57abab", "1616594039964-ae9021a400a0"]
  };

  /* ---------- Страны ----------
     kind региона: sea | alpine | lake | country | city | north */
  const C = (id, code, en, es, ru, base, count, img, regions, desc) =>
    ({ id, code, name: { en, es, ru }, base, count, img: U(img, 1600), regions: regions.map(([n, k]) => ({ name: n, kind: k })), desc });

  window.COUNTRIES = [
    C("spain", "ES", "Spain", "España", "Испания", 420, 16, "1583422409516-2895a77efded",
      [["Marbella", "sea"], ["Ibiza", "sea"], ["Mallorca", "sea"], ["Costa Brava", "sea"], ["Tenerife", "sea"], ["Costa Blanca", "sea"], ["Sotogrande", "sea"], ["Madrid", "city"]],
      { en: "Sun-drenched coastlines, Michelin dining and the glamour of Marbella and Ibiza — Spain is the heart of our collection.",
        es: "Costas bañadas por el sol, gastronomía Michelin y el glamour de Marbella e Ibiza: España es el corazón de nuestra colección.",
        ru: "Солнечные побережья, рестораны Michelin и гламур Марбельи и Ибицы — Испания является сердцем нашей коллекции." }),
    C("italy", "IT", "Italy", "Italia", "Италия", 480, 11, "1533105079780-92b9be482077",
      [["Amalfi Coast", "sea"], ["Tuscany", "country"], ["Sardinia", "sea"], ["Lake Como", "lake"], ["Sicily", "sea"], ["Puglia", "country"], ["Cortina d'Ampezzo", "alpine"]],
      { en: "Cliffside villas on the Amalfi Coast, Tuscan estates among vineyards and the serene elegance of Lake Como.",
        es: "Villas sobre los acantilados de Amalfi, fincas toscanas entre viñedos y la elegancia serena del Lago de Como.",
        ru: "Виллы на скалах Амальфи, тосканские поместья среди виноградников и спокойная элегантность озера Комо." }),
    C("france", "FR", "France", "Francia", "Франция", 550, 11, "1491166617655-0723a0999cfc",
      [["Côte d'Azur", "sea"], ["Saint-Tropez", "sea"], ["Provence", "country"], ["Corsica", "sea"], ["Courchevel", "alpine"], ["Paris", "city"]],
      { en: "From the Côte d'Azur to the lavender fields of Provence and the slopes of Courchevel — effortless French art de vivre.",
        es: "De la Costa Azul a los campos de lavanda de Provenza y las pistas de Courchevel: el art de vivre francés.",
        ru: "От Лазурного берега до лавандовых полей Прованса и склонов Куршевеля — французское искусство жить." }),
    C("greece", "GR", "Greece", "Grecia", "Греция", 450, 10, "1570077188670-e3a8d69ac5ff",
      [["Mykonos", "sea"], ["Santorini", "sea"], ["Crete", "sea"], ["Corfu", "sea"], ["Paros", "sea"], ["Halkidiki", "sea"]],
      { en: "Whitewashed Cycladic houses, infinity pools above the Aegean and sunsets that stop time.",
        es: "Casas cicládicas encaladas, piscinas infinitas sobre el Egeo y atardeceres que detienen el tiempo.",
        ru: "Белоснежные кикладские дома, бассейны-инфинити над Эгейским морем и закаты, останавливающие время." }),
    C("portugal", "PT", "Portugal", "Portugal", "Португалия", 320, 8, "1555881400-74d7acaacd8b",
      [["Algarve", "sea"], ["Cascais", "sea"], ["Comporta", "sea"], ["Madeira", "sea"], ["Lisbon", "city"]],
      { en: "Golden Algarve cliffs, Atlantic surf and the soulful charm of Lisbon and Madeira.",
        es: "Acantilados dorados del Algarve, olas del Atlántico y el encanto de Lisboa y Madeira.",
        ru: "Золотые скалы Алгарве, атлантические волны и душевное очарование Лиссабона и Мадейры." }),
    C("croatia", "HR", "Croatia", "Croacia", "Хорватия", 300, 7, "1499793983690-e29da59ef1c2",
      [["Dubrovnik", "sea"], ["Split", "sea"], ["Hvar", "sea"], ["Istria", "sea"]],
      { en: "Crystal Adriatic bays, medieval Dubrovnik and island-hopping between Hvar and Split.",
        es: "Calas cristalinas del Adriático, la medieval Dubrovnik y saltos entre las islas de Hvar y Split.",
        ru: "Кристальные бухты Адриатики, средневековый Дубровник и путешествия по островам Хвар и Сплит." }),
    C("switzerland", "CH", "Switzerland", "Suiza", "Швейцария", 700, 6, "1530122037265-a5f1f91d3b99",
      [["St. Moritz", "alpine"], ["Zermatt", "alpine"], ["Verbier", "alpine"], ["Gstaad", "alpine"], ["Lake Geneva", "lake"], ["Lake Lugano", "lake"]],
      { en: "Alpine chalets with fireplaces and spas in St. Moritz, Zermatt and Verbier, and villas on the shores of Swiss lakes.",
        es: "Chalets alpinos con chimenea y spa en St. Moritz, Zermatt y Verbier, y villas a orillas de los lagos suizos.",
        ru: "Альпийские шале с каминами и спа в Санкт-Морице, Церматте и Вербье, виллы на берегах швейцарских озёр." }),
    C("turkey", "TR", "Türkiye", "Turquía", "Турция", 220, 6, "1524231757912-21f4fe3a7200",
      [["Bodrum", "sea"], ["Kaş", "sea"], ["Fethiye", "sea"], ["Kalkan", "sea"], ["Istanbul", "city"]],
      { en: "Turquoise coast villas in Bodrum and Kalkan with unbeatable hospitality, and Bosphorus views in Istanbul.",
        es: "Villas en la costa turquesa de Bodrum y Kalkan con una hospitalidad insuperable, y vistas al Bósforo en Estambul.",
        ru: "Виллы на Бирюзовом побережье в Бодруме и Калкане с непревзойдённым гостеприимством и виды на Босфор в Стамбуле." }),
    C("montenegro", "ME", "Montenegro", "Montenegro", "Черногория", 250, 5, "1540541338287-41700207dee6",
      [["Budva", "sea"], ["Kotor Bay", "sea"], ["Tivat", "sea"], ["Sveti Stefan", "sea"]],
      { en: "Dramatic mountains meet the sea in the Bay of Kotor — Europe's best-kept secret.",
        es: "Montañas espectaculares que se funden con el mar en la Bahía de Kotor: el secreto mejor guardado de Europa.",
        ru: "Величественные горы встречаются с морем в Которском заливе — лучший секрет Европы." }),
    C("cyprus", "CY", "Cyprus", "Chipre", "Кипр", 280, 5, "1566073771259-6a8506099945",
      [["Limassol", "sea"], ["Paphos", "sea"], ["Ayia Napa", "sea"], ["Protaras", "sea"]],
      { en: "Year-round sunshine, ancient myths and modern seafront villas in Limassol and Paphos.",
        es: "Sol todo el año, mitos antiguos y villas modernas frente al mar en Limassol y Pafos.",
        ru: "Солнце круглый год, древние мифы и современные виллы у моря в Лимассоле и Пафосе." }),
    C("austria", "AT", "Austria", "Austria", "Австрия", 500, 5, "1516550893923-42d28e5677af",
      [["Kitzbühel", "alpine"], ["Lech am Arlberg", "alpine"], ["St. Anton", "alpine"], ["Zell am See", "lake"], ["Vienna", "city"]],
      { en: "Ski-in ski-out chalets in Kitzbühel and Lech, summer lakes of Zell am See and imperial Vienna.",
        es: "Chalets a pie de pista en Kitzbühel y Lech, los lagos de Zell am See y la Viena imperial.",
        ru: "Шале у склонов в Кицбюэле и Лехе, летние озёра Целль-ам-Зее и имперская Вена." }),
    C("malta", "MT", "Malta", "Malta", "Мальта", 260, 4, "1520250497591-112f2f40a3f4",
      [["Valletta", "city"], ["Sliema", "sea"], ["Gozo", "sea"]],
      { en: "Honey-coloured fortresses, hidden lagoons and laid-back Mediterranean island life.",
        es: "Fortalezas color miel, lagunas escondidas y la vida isleña del Mediterráneo.",
        ru: "Крепости медового цвета, скрытые лагуны и неспешная средиземноморская островная жизнь." }),
    C("monaco", "MC", "Monaco", "Mónaco", "Монако", 900, 4, "1512917774080-9991f1c4c750",
      [["Monte Carlo", "city"], ["Fontvieille", "sea"], ["Larvotto", "sea"]],
      { en: "Penthouses above the yachts of Port Hercule, the Grand Prix and the legendary casino of Monte Carlo.",
        es: "Áticos sobre los yates de Port Hercule, el Gran Premio y el legendario casino de Montecarlo.",
        ru: "Пентхаусы над яхтами Порт-Эркюль, Гран-при и легендарное казино Монте-Карло." }),
    C("albania", "AL", "Albania", "Albania", "Албания", 150, 4, "1571896349842-33c89424de2d",
      [["Ksamil", "sea"], ["Himara", "sea"], ["Saranda", "sea"], ["Dhërmi", "sea"]],
      { en: "Untouched Riviera beaches of Ksamil and Himara — the Maldives of Europe.",
        es: "Playas vírgenes de la Riviera de Ksamil y Himara: las Maldivas de Europa.",
        ru: "Нетронутые пляжи Ривьеры в Ксамиле и Химаре — европейские Мальдивы." }),
    C("uk", "GB", "United Kingdom", "Reino Unido", "Великобритания", 400, 4, "1513635269975-59663e0ac1ad",
      [["Cotswolds", "country"], ["Cornwall", "sea"], ["London", "city"], ["Scottish Highlands", "country"]],
      { en: "Country manors in the Cotswolds, Cornish sea houses, Scottish estates and London townhouses.",
        es: "Mansiones en los Cotswolds, casas junto al mar en Cornualles, fincas escocesas y casas señoriales en Londres.",
        ru: "Загородные поместья Котсуолда, морские дома Корнуолла, шотландские усадьбы и таунхаусы Лондона." }),
    C("slovenia", "SI", "Slovenia", "Eslovenia", "Словения", 200, 3, "1449158743715-0a90ebb6d2d8",
      [["Lake Bled", "lake"], ["Piran", "sea"], ["Kranjska Gora", "alpine"]],
      { en: "Fairytale Lake Bled, Alpine Kranjska Gora and the Venetian charm of Piran on the Adriatic.",
        es: "El lago de cuento de Bled, la alpina Kranjska Gora y el encanto veneciano de Piran en el Adriático.",
        ru: "Сказочное озеро Блед, альпийская Краньска-Гора и венецианское очарование Пирана на Адриатике." }),
    C("ireland", "IE", "Ireland", "Irlanda", "Ирландия", 300, 3, "1564013799919-ab600027ffc6",
      [["Kerry", "sea"], ["Wicklow", "country"], ["Cork", "sea"], ["Dublin", "city"]],
      { en: "Emerald landscapes, castles and the wild Atlantic coastline of Kerry and Cork.",
        es: "Paisajes esmeralda, castillos y la costa atlántica salvaje de Kerry y Cork.",
        ru: "Изумрудные пейзажи, замки и дикое атлантическое побережье Керри и Корка." }),
    C("germany", "DE", "Germany", "Alemania", "Германия", 320, 3, "1467269204594-9661b134dd2b",
      [["Bavaria", "alpine"], ["Sylt", "sea"], ["Lake Tegernsee", "lake"], ["Berlin", "city"]],
      { en: "Bavarian Alpine retreats, Lake Tegernsee and the chic dunes of the island of Sylt.",
        es: "Refugios alpinos en Baviera, el lago Tegernsee y las elegantes dunas de la isla de Sylt.",
        ru: "Альпийские резиденции Баварии, озеро Тегернзее и шикарные дюны острова Зильт." }),
    C("norway", "NO", "Norway", "Noruega", "Норвегия", 380, 3, "1513519245088-0e12902e5a38",
      [["Lofoten", "north"], ["Tromsø", "north"], ["Geirangerfjord", "north"], ["Oslo", "city"]],
      { en: "Glass cabins under the northern lights, majestic fjords and the islands of Lofoten.",
        es: "Cabañas de cristal bajo la aurora boreal, fiordos majestuosos y las islas Lofoten.",
        ru: "Стеклянные домики под северным сиянием, величественные фьорды и Лофотенские острова." }),
    C("sweden", "SE", "Sweden", "Suecia", "Швеция", 340, 2, "1509356843151-3e7d96241e11",
      [["Stockholm Archipelago", "north"], ["Åre", "alpine"], ["Stockholm", "city"]],
      { en: "Scandinavian design villas in the Stockholm archipelago and cosy chalets in Åre.",
        es: "Villas de diseño escandinavo en el archipiélago de Estocolmo y acogedores chalets en Åre.",
        ru: "Виллы в скандинавском стиле на архипелаге Стокгольма и уютные шале в Оре." })
  ];

  /* ---------- Генератор демо-объектов ---------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const r = rng(20261119);
  const rand = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const chance = p => r() < p;
  const pickN = (arr, n) => { const a = arr.slice(); const out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; };

  const NAMES = ["Azure", "Bellavista", "Solaris", "Aurora", "Serenity", "Marisol", "Oliva", "Lumière", "Del Mar", "Esmeralda", "Paloma",
    "Mirador", "Sole", "Blanca", "Horizon", "Coral", "Ambra", "Vento", "Luna", "Alba", "Sirena", "Perla", "Riviera", "Bianca",
    "Odyssey", "Atlas", "Eden", "Zafiro", "Belvedere", "Cielo", "Nova", "Aria", "Dorada", "Opal", "Halcyon", "Elysium", "Calypso", "Thalassa",
    "Valentina", "Isola", "Mistral", "Terra", "Palmera", "Sunset", "Ivory", "Vista Mar", "Monte", "Cypress", "Lavanda", "Ocean Pearl",
    "Saffron", "Olympia", "Majestic", "Aegean", "Infinity", "Orion", "Silverwood", "Edelweiss", "Alpenrose", "Nordlys", "Fjord", "Polaris",
    "Gardenia", "Magnolia", "Jasmine", "Amalfi Blue", "Golden Hour", "Seraphina", "La Reserva", "Casa Bella", "Tramonto", "Volare", "Marea",
    "Brisa", "Arena", "Sereno", "Velvet", "Obsidian", "Crystal", "Emerald Bay", "Grand Bleu", "Belle Époque", "Mon Repos", "Le Phare",
    "Cap Soleil", "Les Pins", "Kalimera", "Thera", "Kyma", "Galini", "Ammos", "Ventus", "Lux", "Aquamarine", "Porto Fino", "Sunrise",
    "White Pearl", "Stella Maris", "Maravilla", "Rocabella", "Altamira", "Panorama", "Tranquila", "Bonita", "Sol y Mar", "Primavera",
    "Belle Vue", "Sanctuary", "Haven", "Whitestone", "Highcliff", "Seabreeze", "Avalon", "Monarch", "Regent", "Aster", "Lyra", "Vega", "Sirius"];
  const usedNames = new Set();
  function uniqueName() { let n; do { n = pick(NAMES); } while (usedNames.has(n) && usedNames.size < NAMES.length); usedNames.add(n); return n; }

  const TYPE_BY_KIND = {
    sea: [["villa", .6], ["apartment", .2], ["penthouse", .2]],
    alpine: [["chalet", .8], ["apartment", .2]],
    lake: [["villa", .85], ["apartment", .15]],
    country: [["villa", .9], ["apartment", .1]],
    city: [["apartment", .5], ["penthouse", .5]],
    north: [["villa", .5], ["chalet", .5]]
  };
  function weighted(list) { let x = r(); for (const [v, w] of list) { if ((x -= w) <= 0) return v; } return list[0][0]; }
  const PREFIX = { villa: ["Villa", "Villa", "Villa", "Casa", "Maison", "Domaine"], apartment: ["Residence", "Suite", "Apartment"], penthouse: ["Penthouse", "Sky Penthouse"], chalet: ["Chalet", "Chalet", "Lodge"] };
  const BEDS = { villa: [3, 9], apartment: [1, 3], penthouse: [2, 5], chalet: [3, 8] };
  const MULT = { villa: 1, apartment: .75, penthouse: 1.15, chalet: 1.1 };

  function features(kind, type) {
    const f = new Set(["wifi"]);
    const big = type === "villa" || type === "chalet";
    if (kind === "sea") { if (chance(big ? .9 : .45)) f.add("pool"); if (chance(.85)) f.add("seaView"); if (chance(.3)) f.add("beachfront"); f.add("ac"); if (big && chance(.6)) f.add("bbq"); if (big && chance(.6)) f.add("garden"); }
    if (kind === "alpine") { if (chance(.9)) f.add("fireplace"); if (chance(.85)) f.add("sauna"); if (chance(.5)) f.add("spa"); if (chance(.55)) f.add("ski"); f.add("view"); }
    if (kind === "lake") { if (chance(.6)) f.add("pool"); f.add("view"); if (chance(.7)) f.add("garden"); f.add("ac"); if (chance(.4)) f.add("spa"); }
    if (kind === "country") { if (chance(.9)) f.add("pool"); f.add("garden"); if (chance(.75)) f.add("bbq"); if (chance(.6)) f.add("view"); f.add("ac"); if (chance(.3)) f.add("fireplace"); }
    if (kind === "city") { if (chance(.7)) f.add("view"); f.add("ac"); if (chance(.4)) f.add("gym"); if (chance(.25)) f.add("spa"); }
    if (kind === "north") { f.add("sauna"); f.add("fireplace"); f.add("view"); if (chance(.5)) f.add("spa"); if (chance(.4)) f.add("seaView"); }
    if (chance(kind === "city" ? .3 : .85)) f.add("parking");
    if (chance(.35)) f.add("chef");
    if (big && chance(.35)) f.add("gym");
    if (big && chance(.22)) f.add("cinema");
    return [...f];
  }
  function images(kind, type) {
    let ext;
    if (type === "chalet" || kind === "alpine") ext = IMG.chalet;
    else if (kind === "city") ext = IMG.city;
    else if (kind === "sea") ext = IMG.sea;
    else ext = IMG.house.concat(IMG.sea.slice(0, 4));
    return pickN(ext, 2).concat(pickN(IMG.interior, 3)).map(id => U(id, 1600));
  }

  const list = [];
  window.COUNTRIES.forEach(c => {
    for (let i = 0; i < c.count; i++) {
      const region = i === 0 ? c.regions[0] : (chance(.3) ? c.regions[0] : pick(c.regions));
      const type = weighted(TYPE_BY_KIND[region.kind]);
      const beds = rand(BEDS[type][0], BEDS[type][1]);
      const price = Math.max(180, Math.round(c.base * beds * MULT[type] * (0.8 + r() * 0.6) / 10) * 10);
      list.push({
        country: c.id, region: region.name, kind: region.kind, type,
        name: pick(PREFIX[type]) + " " + uniqueName(),
        beds, baths: Math.max(1, beds - rand(0, 1)), guests: beds * 2,
        area: beds * rand(55, 95) + rand(20, 80),
        price,
        rating: Math.round((4.6 + r() * 0.4) * 10) / 10,
        reviews: rand(8, 140),
        features: features(region.kind, type),
        images: images(region.kind, type),
        popular: r()
      });
    }
  });
  // перемешиваем и присваиваем ID
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  list.forEach((v, i) => v.id = 101 + i);

  /* ---------- РЕАЛЬНЫЕ ВИЛЛЫ (добавляйте новые сюда) ---------- */
  const R = (id, name, guests, price, file, extra = {}) => Object.assign({
    id, name, guests, price, real: true,
    country: "spain", region: "Marbella", kind: "resort", type: "villa",
    beds: Math.ceil(guests / 2), baths: Math.ceil(guests / 2),
    features: ["pool", "garden", "view", "wifi", "ac", "parking", "bbq", "chef"],
    images: ["assets/img/villas/" + file + ".webp"],
    popular: 2 + price / 10000
  }, extra);
  const REAL = [
    R(1, "Villa Eterna", 10, 643, "eterna"),
    R(2, "Villa Mila", 12, 1857, "mila"),
    R(3, "Villa Celeste", 16, 929, "celeste"),
    R(4, "Villa Enzo", 10, 2143, "enzo"),
    R(5, "Villa Salvia", 10, 830, "salvia", { features: ["pool", "garden", "fireplace", "wifi", "ac", "parking", "bbq", "chef"] }),
    R(6, "Villa Velara", 14, 2640, "velara", { features: ["pool", "view", "spa", "wifi", "ac", "parking", "chef", "gym"] }),
    R(7, "Villa Manati", 12, 2795, "manati", { features: ["pool", "spa", "garden", "view", "wifi", "ac", "parking", "chef"] })
  ];
  window.VILLAS = REAL.concat(list);
  window.COUNTRIES[0].img = "assets/img/villas/manati.webp"; // Испания — ваше фото

  /* ---------- Отзывы (ЗАМЕНИТЕ на реальные) ---------- */
  window.TESTIMONIALS = [
    { name: "Sophie & Mark", from: "London", villa: "Marbella",
      text: { en: "The villa was even better than the photos. Our concierge arranged everything — from the airport transfer to a chef for my husband's birthday. Truly five-star.",
              es: "La villa era incluso mejor que en las fotos. Nuestro concierge lo organizó todo, desde el traslado hasta un chef para el cumpleaños de mi marido. Cinco estrellas de verdad.",
              ru: "Вилла оказалась даже лучше, чем на фото. Консьерж организовал всё — от трансфера до шеф-повара на день рождения мужа. Настоящие пять звёзд." } },
    { name: "Carlos M.", from: "Madrid", villa: "Amalfi Coast",
      text: { en: "Booking took ten minutes on WhatsApp. The view from the terrace over the Amalfi Coast is something I will never forget.",
              es: "La reserva llevó diez minutos por WhatsApp. La vista desde la terraza sobre la Costa Amalfitana es algo que nunca olvidaré.",
              ru: "Бронирование заняло десять минут в WhatsApp. Вид с террасы на Амальфитанское побережье я не забуду никогда." } },
    { name: "Elena R.", from: "Milano", villa: "Mykonos",
      text: { en: "Perfect for our family of eight. Spotless house, private pool and a sunset every evening. We are already planning next summer.",
              es: "Perfecta para nuestra familia de ocho. Casa impecable, piscina privada y un atardecer cada noche. Ya estamos planeando el próximo verano.",
              ru: "Идеально для нашей семьи из восьми человек. Безупречный дом, свой бассейн и закат каждый вечер. Уже планируем следующее лето." } },
    { name: "Thomas B.", from: "Zürich", villa: "Courchevel",
      text: { en: "Ski-in chalet, sauna, fireplace and a team that answers at any hour. The most relaxed ski holiday we have ever had.",
              es: "Chalet a pie de pista, sauna, chimenea y un equipo que responde a cualquier hora. Las vacaciones de esquí más relajadas de nuestra vida.",
              ru: "Шале у склона, сауна, камин и команда, которая отвечает в любое время. Самый спокойный горнолыжный отдых в нашей жизни." } }
  ];
})();
