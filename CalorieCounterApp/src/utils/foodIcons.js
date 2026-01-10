export const getFoodIcon = (foodName) => {
  if (!foodName) return "🍽️";

  const lowerName = foodName.toLowerCase();

  const iconMap = {
    // Fruits
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    grape: "🍇",
    strawberry: "🍓",
    melon: "🍈",
    cherry: "🍒",
    peach: "🍑",
    mango: "🥭",
    pineapple: "🍍",
    coconut: "🥥",
    kiwi: "🥝",
    avocado: "🥑",

    // Vegetables
    carrot: "🥕",
    corn: "🌽",
    potato: "🥔",
    broccoli: "🥦",
    cucumber: "🥒",
    mushroom: "🍄",
    onion: "🧅",
    salad: "🥗",
    vegetable: "🥗",
    tomato: "🍅",
    eggplant: "🍆",

    // Fast Food / Meals
    pizza: "🍕",
    burger: "🍔",
    sandwich: "🥪",
    fries: "🍟",
    hotdog: "🌭",
    taco: "🌮",
    burrito: "burrito",
    pasta: "🍝",
    rice: "🍚",
    noodle: "🍜",
    sushi: "🍣",
    bread: "🍞",
    steak: "🥩",
    chicken: "🍗",
    meat: "🍖",
    egg: "🥚",

    // Drinks
    water: "💧",
    coffee: "☕",
    tea: "🍵",
    milk: "🥛",
    juice: "🧃",
    soda: "🥤",
    beer: "🍺",
    wine: "🍷",

    // Snacks/Sweets
    chocolate: "🍫",
    cookie: "🍪",
    cake: "🍰",
    donut: "🍩",
    icecream: "🍦",
    popcorn: "🍿",
    chips: "🥔", // close enough

    // Defaults
    breakfast: "🥞",
    lunch: "🍱",
    dinner: "🍲",
    snack: "🥨",
  };

  // Check for direct match or partial match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }

  return "🍽️"; // Default Plate
};
