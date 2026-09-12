import fs from "fs/promises";
import path from "path";

const dbPath = path.join(import.meta.dirname, "data.json");

const productNames = [
  "Wireless Bluetooth Headphones",
  "Mechanical Keyboard RGB",
  "Ultra-Wide Curved Monitor",
  "Ergonomic Office Chair",
  "USB-C Docking Station",
  "Portable SSD 1TB",
  "Webcam 4K HDR",
  "Noise Cancelling Earbuds",
  "Smart LED Desk Lamp",
  "Laptop Stand Aluminum",
  "Wireless Charging Pad",
  "Gaming Mouse Pro",
  "Mechanical Pencil Set",
  "Insulated Water Bottle",
  "Minimalist Wallet Leather",
  "Phone Gimbal Stabilizer",
  "Ring Light 18 inch",
  "Blue Light Glasses",
  "Cable Management Kit",
  "Standing Desk Converter",
];

const descriptions = [
  "Premium quality with excellent build materials and modern design.",
  "Ergonomic and comfortable for long hours of use.",
  "Fast performance with sleek aesthetics.",
  "Durable construction with a minimalist look.",
  "Perfect for home office and remote work setups.",
  "Highly rated by thousands of satisfied customers.",
  "Compact and portable, easy to carry anywhere.",
  "Latest technology with backward compatibility.",
  "Award-winning design with attention to detail.",
  "Affordable price without compromising quality.",
];

function randomPrice() {
  return parseFloat((Math.random() * 200 + 10).toFixed(2));
}

function randomImage() {
  const id = Math.floor(Math.random() * 1000) + 200;
  return `https://picsum.photos/seed/${id}/300/300`;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getId() {
  return String(Math.floor(Math.random() * 10000000));
}

async function seed() {
  const data = await fs.readFile(dbPath, { encoding: "utf-8" });
  const json = JSON.parse(data);

  const existingCount = json.products.length;
  const shuffled = [...productNames].sort(() => Math.random() - 0.5);
  const toAdd = shuffled.slice(0, 10);

  for (const name of toAdd) {
    json.products.push({
      id: getId(),
      name: name,
      description: pickRandom(descriptions),
      price: randomPrice(),
      image: randomImage(),
    });
  }

  await fs.writeFile(dbPath, JSON.stringify(json, null, 2));
  console.log(`Seeded ${toAdd.length} products. Total: ${existingCount + toAdd.length}`);
}

seed();
