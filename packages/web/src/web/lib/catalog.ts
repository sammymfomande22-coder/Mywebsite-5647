export type Product = {
  id: number;
  name: string;
  category: string;
  group: "Pet supplies" | "Pool supplies";
  price: number;
  original?: number;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  description: string;
};
export const products: Product[] = [
  {
    id: 101,
    name: "Everyday Rope Tug Toy",
    category: "Dog essentials",
    group: "Pet supplies",
    price: 12.99,
    image: "/images/rope.png",
    badge: "Best seller",
    rating: 4.9,
    reviews: 128,
    description:
      "A colorful cotton rope for fetch, tug, and supervised play. Choose a size suited to your dog and replace it if worn or damaged.",
  },
  {
    id: 102,
    name: "Deep Leaf Skimmer Net",
    category: "Pool equipment",
    group: "Pool supplies",
    price: 24.99,
    original: 31.99,
    image: "/images/skimmer.jpg",
    badge: "−22%",
    rating: 4.8,
    reviews: 96,
    description:
      "Make light work of leaves and floating debris with a deep mesh bag and easy-scoop edge. Skimmer head only; check pole compatibility before buying.",
  },
  {
    id: 103,
    name: "Stainless Steel Pet Bowl",
    category: "Dog essentials",
    group: "Pet supplies",
    price: 18.99,
    image: "/images/bowl.jpg",
    badge: "Best seller",
    rating: 4.9,
    reviews: 164,
    description:
      "A simple, durable stainless steel bowl for everyday food or water. Easy to wash, with a clean design that fits any feeding corner.",
  },
  {
    id: 104,
    name: "5-Way Pool Test Strips",
    category: "Pool care",
    group: "Pool supplies",
    price: 16.99,
    original: 21.99,
    image: "/images/test-strips.jpg",
    badge: "−23%",
    rating: 4.8,
    reviews: 82,
    description:
      "A handy starting point for routine pool-water checks. Follow the included instructions and consult a pool professional when results are outside recommended ranges.",
  },
  {
    id: 105,
    name: "Gentle Dog Shampoo",
    category: "Pet grooming",
    group: "Pet supplies",
    price: 14.99,
    image: "/images/shampoo.jpg",
    badge: "New",
    rating: 4.7,
    reviews: 63,
    description:
      "Keep bath day simple with a gentle wash formulated for dogs. Follow the label directions, avoid the eyes, and check suitability for your pet’s skin.",
  },
  {
    id: 106,
    name: "Floating Chlorine Dispenser",
    category: "Pool care",
    group: "Pool supplies",
    price: 12.99,
    original: 16.99,
    image: "/images/dispenser.jpg",
    badge: "−24%",
    rating: 4.8,
    reviews: 74,
    description:
      "An adjustable floating dispenser for compatible pool tablets. Tablets sold separately. Follow the chemical label and store all pool chemicals away from children and pets.",
  },
  {
    id: 107,
    name: "Feather Teaser Cat Wand",
    category: "Cat essentials",
    group: "Pet supplies",
    price: 9.99,
    image: "/images/cat-wand.png",
    badge: "New",
    rating: 4.9,
    reviews: 51,
    description:
      "Bring out their playful side with an interactive feather wand. For supervised play only; put away out of reach after playtime.",
  },
  {
    id: 108,
    name: "18-Inch Curved Pool Brush",
    category: "Pool equipment",
    group: "Pool supplies",
    price: 22.99,
    image: "/images/pool-brush.jpg",
    badge: "Best seller",
    rating: 4.8,
    reviews: 89,
    description:
      "Keep pool walls and steps in your regular cleaning routine. Brush head only; check surface suitability and pole compatibility before use.",
  },
];
export const categories = [
  {
    name: "Dog essentials",
    image: "/images/pet-pool-hero.jpg",
    count: "Toys, bowls & more",
    service: false,
  },
  {
    name: "Cat essentials",
    image: "/images/cat.jpg",
    count: "Playful little favorites",
    service: false,
  },
  {
    name: "Pet grooming",
    image: "/images/shampoo.jpg",
    count: "Fresh coats, happy pets",
    service: false,
  },
  {
    name: "Pool care",
    image: "/images/pool-water.jpg",
    count: "Water-care essentials",
    service: false,
  },
  {
    name: "Pool equipment",
    image: "/images/skimmer.jpg",
    count: "Tools for a clearer pool",
    service: false,
  },
  {
    name: "Pool cleaning",
    image: "/images/pool-service.jpg",
    count: "Let us do the work",
    service: true,
  },
];
export const money = (value: number) => "$" + value.toFixed(2);
