export const products = [
  {
    id: 1,
    name: "AIR MOTION X",
    category: "Performance Sneakers",
    price: 18500,
    oldPrice: 22000,
    description:
      "A bold everyday sneaker engineered for comfort, movement and street culture.",
    color: "Black / Orange",
    sizes: [39, 40, 41, 42, 43, 44],
    model: null,
    accent: "#F97316",
    tag: "BEST SELLER",
  },
  {
    id: 2,
    name: "STREET RUNNER",
    category: "Urban Collection",
    price: 16500,
    oldPrice: 19500,
    description:
      "Modern streetwear design with a lightweight feel and confident silhouette.",
    color: "White / Orange",
    sizes: [39, 40, 41, 42, 43],
    model: null,
    accent: "#F97316",
    tag: "NEW ARRIVAL",
  },
  {
    id: 3,
    name: "SHADOW PRO",
    category: "Premium Collection",
    price: 21500,
    oldPrice: null,
    description:
      "A premium dark silhouette made for people who prefer a distinctive look.",
    color: "Black / Grey",
    sizes: [40, 41, 42, 43, 44],
    model: null,
    accent: "#F97316",
    tag: "PREMIUM",
  },
  {
    id: 4,
    name: "VELOCITY 09",
    category: "Sport Collection",
    price: 19500,
    oldPrice: 23000,
    description:
      "Sport-inspired energy meets everyday versatility in one statement sneaker.",
    color: "Orange / White",
    sizes: [39, 40, 41, 42, 43, 44],
    model: null,
    accent: "#F97316",
    tag: "LIMITED EDITION",
  },
];

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
