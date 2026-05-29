export interface CollageItem {
  id: string;
  type: 'orange_cup' | 'orange_fruit' | 'strawberry_cup' | 'strawberry_fruit' | 'chocolate_cup' | 'chocolate_extra';
  imageUrl: string;
  name: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  scale: number; // 0.2 to 3.0
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0.1 to 1.0
  zIndex: number;
}

export interface CollageAsset {
  type: CollageItem['type'];
  name: string;
  imageUrl: string;
  category: 'Orange' | 'Strawberry' | 'Chocolate';
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  flavorProfile: string;
  story: string;
  ingredients: string[];
  instructions: string[];
  strength: 'Gentle' | 'Balanced' | 'Bold';
  sweetness: number; // 1-5
  acidity: number; // 1-5
  richness: number; // 1-5
  imageUrl: string;
  accentColor: string; // Tailwind class
  glowColor: string; // Tailwind glow border color style
}

export interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    description: string;
    points: {
      orange: number;
      strawberry: number;
      chocolate: number;
    };
  }[];
}

export const ASSETS_DB: CollageAsset[] = [
  {
    type: 'orange_cup',
    name: 'Wealth Orange Chalice',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037140284-15cae61c-3317-4482-9c00-8f7965105e84.png',
    category: 'Orange'
  },
  {
    type: 'orange_fruit',
    name: 'Zesty Amber Citrus',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037146628-ed9818cf-d38d-4de9-a9f7-ab86f3340244.png',
    category: 'Orange'
  },
  {
    type: 'strawberry_cup',
    name: 'Wealth Velvet Berry elixir',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png',
    category: 'Strawberry'
  },
  {
    type: 'strawberry_fruit',
    name: 'Glazed Crimson Berry',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780038419280-0eb55ca0-85dc-4474-a4dd-9f30ac303f26.png',
    category: 'Strawberry'
  },
  {
    type: 'chocolate_cup',
    name: 'Bespoke Cocoa Mint Goblet',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037152057-c2077f10-55ce-4411-bc9d-d3dc93e68dab.png',
    category: 'Chocolate'
  },
  {
    type: 'chocolate_extra',
    name: 'Grand Reserve Truffle Shaker',
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037156895-a7ecabb9-3e9f-4fca-ae7a-23a43c7984ca.png',
    category: 'Chocolate'
  }
];
