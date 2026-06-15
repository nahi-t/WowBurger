export const SEED_CATEGORIES = [
  {
    name: 'Craft Burgers',
    slug: 'burgers',
    description: '100% grass-fed Angus beef and premium house ingredients on toasted brioche.',
    iconName: 'Flame',
    displayOrder: 0,
  },
  {
    name: 'Sensational Sides',
    slug: 'sides',
    description: 'Crispy, hand-cut, and flavored to crunchy perfection.',
    iconName: 'Sparkles',
    displayOrder: 1,
  },
  {
    name: 'Handcrafted Shakes & Elixirs',
    slug: 'drinks',
    description: 'Slow-churned premium ice cream shakes and artisanal natural-fizz sodas.',
    iconName: 'GlassWater',
    displayOrder: 2,
  },
  {
    name: 'Dreamy Desserts',
    slug: 'desserts',
    description: 'Freshly baked indulgences to sweeten your Wow dining experience.',
    iconName: 'Cookie',
    displayOrder: 3,
  },
];

export const SEED_MENU_ITEMS = [
  {
    name: 'The Volcanic Volcano Burger',
    slug: 'b1',
    categorySlug: 'burgers',
    price: 'Br 480',
    shortDescription: 'Our award-winning signature burger.',
    description: 'Our award-winning signature burger. Double fire-grilled highland Angus beef topped with crispy jalapeno crisps, molten smoked pepper jack, and our trademark volcanic lava sauce.',
    ingredients: ['Highland Beef', 'Brioche Bun', 'Smoked Pepper Jack', 'Crispy Jalapeno', 'Lava Glaze', 'Vine-ripe Tomatoes', 'Wild Arugula'],
    detailedIngredients: [
      { name: '100% Highland Beef (2x Double)', source: 'Regenerative Grass-Fed Cattle, Arsi Highlands', icon: 'Patty' },
      { name: 'Artisanal Golden Brioche Bun', source: 'Baked Fresh Daily in Addis Ababa, Glazed with Shola Butter', icon: 'Bun' },
      { name: 'Aged Smoked Pepper Jack', source: 'Local Dairy Farms, Debre Birhan', icon: 'Cheese' },
      { name: 'Hand-Cut Jalapeno Crisps', source: 'Locally grown jalapenos, Awasa greenhouse farms', icon: 'Flame' },
      { name: 'Secret Wow Volcanic Lava Sauce', source: 'Chipotle and pepper spice blend, Merkato Market', icon: 'Sauce' },
      { name: 'Organic Vine-Ripe Tomato', source: 'Mojo agricultural state cooperative', icon: 'Leaf' },
      { name: 'Wild Peppery Arugula', source: 'Hydroponic Greens from Abyssinia Orchards', icon: 'Leaf' }
    ],
    calories: 820,
    dietaryTags: ['Spicy', 'Signature'],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 342,
    nutrition: {
      protein: '48g',
      carbs: '38g',
      fat: '41g',
      sodium: '1150mg',
    },
    customizableOptions: [
      { name: 'Meat Cooking', options: ['Medium Juicy (Chef Default)', 'Medium Well', 'Well Done'] },
      { name: 'Spiciness', options: ['Extremely Volcanic', 'Standard Heat (Default)', 'Subtle Warmth'] }
    ]
  },
  {
    name: 'Truffle Umami Royale',
    slug: 'b2',
    categorySlug: 'burgers',
    price: 'Br 510',
    shortDescription: 'A decadent combination of mushrooms and truffle garlic aioli.',
    description: 'A decadent combination of pan-seared wild forest shiitake & porcini mushrooms, melted aged Swiss, and a rich, velvety black truffle garlic aioli.',
    ingredients: ['Highland Beef', 'Wild Mushrooms', 'Swiss Cheese', 'Truffle Aioli', 'Caramelized Onions'],
    detailedIngredients: [
      { name: 'Premium Highland Beef Patty', source: 'Dry-aged 14 days, juicy & flame-kissed from Arsi', icon: 'Patty' },
      { name: 'Charcoal Black Brioche Bun', source: 'Natural activated coconut charcoal brioche baked locally', icon: 'Bun' },
      { name: 'Wild Shiitake & Porcini Mix', source: 'Hand-foraged in pristine Wondo Genet forests', icon: 'Mushroom' },
      { name: 'Melted Swiss Emmental', source: 'Authentic imported slow-stretched cheese', icon: 'Cheese' },
      { name: 'Smoked Black Truffle Aioli', source: 'Infused with real summer truffles and native spices', icon: 'Sauce' },
      { name: 'Organic Caramelized Onions', source: 'Slow-simmered for 8 hours, Adama organic red onions', icon: 'Onion' }
    ],
    calories: 780,
    dietaryTags: ['Signature'],
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 198,
    nutrition: {
      protein: '42g',
      carbs: '34g',
      fat: '38g',
      sodium: '980mg',
    },
    customizableOptions: [
      { name: 'Mushroom extra', options: ['Standard Wild Portion', 'Double Mushrooms', 'No Mushroom'] }
    ]
  },
  {
    name: 'The Greenery Garden Patty',
    slug: 'b3',
    categorySlug: 'burgers',
    price: 'Br 410',
    shortDescription: 'A custom, nutrient-packed sweet potato and brown rice house patty.',
    description: 'A custom, nutrient-packed sweet potato and brown rice house patty, bursting with roasted peppers, fresh smashed avocado spread, organic sprouts, and vegan lemon herb tahini.',
    ingredients: ['Sweet Potato Patty', 'Avocado Spread', 'Sprout Greens', 'Lemon Tahini', 'Pretzel Bun'],
    detailedIngredients: [
      { name: 'Artisanal Sweet Potato & Brown Rice Patty', source: 'Chef’s house recipe crafted with toasted quinoa', icon: 'Patty' },
      { name: 'Toasted Vegan Pretzel Bun', source: 'Baked with organic non-GMO flours and sea salt', icon: 'Bun' },
      { name: 'Freshly Smashed Hass Avocado', source: 'Fair-trade Organic avocados from Sidama region forest gardens', icon: 'Avocado' },
      { name: 'Crisp Alfalfa & Broccoli Sprouts', source: 'Grown hydroponically, delivered fresh from Bishoftu', icon: 'Leaf' },
      { name: 'Stone-Ground Lemon Herb Tahini', source: 'Premium sesame paste seasoned with organic fresh dill', icon: 'Sauce' }
    ],
    calories: 540,
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 145,
    nutrition: {
      protein: '19g',
      carbs: '58g',
      fat: '22g',
      sodium: '640mg',
    }
  },
  {
    name: 'Crispy Pecan Honey Poultry',
    slug: 'b4',
    categorySlug: 'burgers',
    price: 'Br 440',
    shortDescription: 'Crispy buttermilk-fried organic chicken breast.',
    description: 'Crispy buttermilk-fried organic chicken breast coated in toasted pecan breading, drizzled with sweet habanero hot honey, creamy slaw, and house-pickled dill spears.',
    ingredients: ['Buttermilk Chicken', 'Pecan Crust', 'Hot Honey', 'Slaw Salad', 'Brioche Bun'],
    detailedIngredients: [
      { name: 'Buttermilk-Brined Chicken Breast', source: 'Organic free-range poultry, Abyssinia poultry cooperative', icon: 'Drumstick' },
      { name: 'Pecan & Cornflake Hand-Breading', source: 'Toasted local pecans and crispy Abyssinia grains', icon: 'Grain' },
      { name: 'Smoked Jalapeno slathered Slaw', source: 'Finely shaved red cabbage & carrot toss from Bishoftu farms', icon: 'Bowl' },
      { name: 'Gourmet Habanero Hot Honey Drizzle', source: 'Pure forest honey from Bale Mountains infused with homegrown pods', icon: 'Sauce' },
      { name: 'Lactic-Fermented Dill Pickles', source: 'Salty brine spears with whole garlic and wild dill', icon: 'Pickle' }
    ],
    calories: 730,
    dietaryTags: ['Spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
    rating: 4.85,
    reviewsCount: 220,
    nutrition: {
      protein: '38g',
      carbs: '49g',
      fat: '29g',
      sodium: '1120mg',
    }
  },
  {
    name: 'Rosemary Sea Salt Frites',
    slug: 's1',
    categorySlug: 'sides',
    price: 'Br 180',
    shortDescription: 'Gourmet hand-cut Russet potato wedges.',
    description: 'Gourmet hand-cut Russet potato wedges, blanched and fried twice. Seasoned with hand-rubbed organic rosemary, coarse sea salt, and served with custom garlic dip.',
    ingredients: ['Gamo Potatoes', 'Rosemary', 'Sea Salt', 'Garlic Aoili Dip'],
    detailedIngredients: [
      { name: 'Gamo Highlands Potatoes', source: 'Sourced from organic high-altitude family farms in Chencha', icon: 'Potato' },
      { name: 'Fresh Organic Rose Rosemary', source: 'Muddled in mortar to release natural aromatic oils, Entoto hills', icon: 'Leaf' },
      { name: 'Natural Lake Chitu Sea Salt', source: 'Hand-harvested from Rift Valley saline reserves', icon: 'Salt' },
      { name: 'Gourmet Roasted Garlic Aioli Sauce', source: 'Creamy emulsified egg-yolk and cold-pressed oil base', icon: 'Sauce' }
    ],
    calories: 380,
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 421,
    nutrition: {
      protein: '5g',
      carbs: '44g',
      fat: '14g',
      sodium: '410mg',
    }
  },
  {
    name: 'Cheesy Melt Volcanic Wedges',
    slug: 's2',
    categorySlug: 'sides',
    price: 'Br 240',
    shortDescription: 'Crispy wedges loaded with rich house-crafted cheddar cheese sauce.',
    description: 'Crispy wedges loaded with rich house-crafted cheddar cheese sauce, crumbled plant-based smokey bacon, scallions, and a swirl of jalapeño cream.',
    ingredients: ['Fries Wedges', 'Cheddar Beer Sauce', 'Smokey Bacon Bits', 'Scallions', 'Jalapeño Cream'],
    detailedIngredients: [
      { name: 'Double-Fried Sliced Potato Wedges', source: 'Local Chencha red potato skins-on', icon: 'Potato' },
      { name: 'Wow Craft Cheddar Sauce', source: 'Melted aged yellow cheddar, smooth butter reduction', icon: 'Sauce' },
      { name: 'House Plant-Based Smokey Bacon', source: 'Malty coconut-maple bark roasted crispy', icon: 'Leaf' },
      { name: 'Spring Fresh Baby Scallions', source: 'Finely sliced green hollow shafts, Debre Zeit', icon: 'Leaf' }
    ],
    calories: 590,
    dietaryTags: ['Vegetarian', 'Spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800',
    rating: 4.75,
    reviewsCount: 168,
    nutrition: {
      protein: '11g',
      carbs: '52g',
      fat: '28g',
      sodium: '890mg',
    }
  },
  {
    name: 'Pistachio Crumble Dream Shake',
    slug: 'd1',
    categorySlug: 'drinks',
    price: 'Br 220',
    shortDescription: 'Slow-churned premium pistachio gelato.',
    description: 'Slow-churned premium pistachio gelato blended with double rich local dairy milk, topped with a mountain of cloud-like vanilla whipped cream and crushed roasted slivered pistachios.',
    ingredients: ['Pistachio Gelato', 'Rich Dairy Cream', 'Vanilla Whipped Cream', 'Crushed Pistachios'],
    detailedIngredients: [
      { name: 'Premium Ground Pistachio Paste', source: 'Grown and prepared in regional farm estates', icon: 'Nut' },
      { name: 'Premium Soft-Churned Custard Base', source: 'Shola dairy grass-fed cream whipped under high density', icon: 'Glass' },
      { name: 'Bourbon Vanilla Whipping Foam', source: 'Rich heavy whipping cream infused with regional vanilla pods', icon: 'Star' },
      { name: 'Roasted Salted Pistachio Slivers', source: 'Toasted in-house under birch wood flame', icon: 'Nut' }
    ],
    calories: 610,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    rating: 4.95,
    reviewsCount: 289,
    nutrition: {
      protein: '14g',
      carbs: '65g',
      fat: '24g',
      sodium: '190mg',
    }
  },
  {
    name: 'Artisanal Ginger Brew Fizz',
    slug: 'd2',
    categorySlug: 'drinks',
    price: 'Br 145',
    shortDescription: 'A crisp, bubbly natural ginger-infused brew.',
    description: 'A crisp, bubbly natural ginger-infused brew, sweetened with single-origin honey and squeezed whole limes. Crafted and fermented locally for 48 hours.',
    ingredients: ['Fermented Ginger Root', 'Honey Nectar', 'Harar Limes', 'Seltzer'],
    detailedIngredients: [
      { name: 'Cold-Pressed Wild Ginger Root', source: 'Grown organic in mountainous warm clay soils of Bench Maji', icon: 'Ginger' },
      { name: 'Unrefined Ethiopian Honey Nectar', source: 'Wildflower honey from Tigray forest cooperatives', icon: 'Flower' },
      { name: 'Muddled Squeezed Limes', source: 'Harar mountain variety, highly aromatic, hand-crushed', icon: 'Slice' }
    ],
    calories: 120,
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 94,
    nutrition: {
      protein: '0g',
      carbs: '30g',
      fat: '0g',
      sodium: '15mg',
    }
  },
  {
    name: 'S’mores Flame Chocolate Lava Cookie',
    slug: 'de1',
    categorySlug: 'desserts',
    price: 'Br 250',
    shortDescription: 'An oversized, warm skillet chocolate chunk cookie.',
    description: 'An oversized, warm skillet chocolate chunk cookie with a gooedy dark chocolate fudge filling, crowned with a giant torch-toasted marshmallow and graham cracker dusting.',
    ingredients: ['Cookie Skillet', 'Fudge Filling', 'Campfire Marshmallow', 'Graham Dust'],
    detailedIngredients: [
      { name: 'Gourmet Brown-Butter Cookie Batter', source: 'Leavened in-house with premium direct-trade cocoa chips', icon: 'Cookie' },
      { name: '70% Dark Molten Fudge Core', source: 'Silky center pocket that bursts open warm', icon: 'Flame' },
      { name: 'Gigantic Flame-Torched Marshmallow', source: 'Cane sugar sweet puff roasted under torch until blistered', icon: 'Cloud' },
      { name: 'House-Baked Graham Cracker crumbs', source: 'Crisp honey-wheat cracker crumble using Local Wheat', icon: 'Grain' }
    ],
    calories: 690,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=800',
    rating: 4.92,
    reviewsCount: 204,
    nutrition: {
      protein: '8g',
      carbs: '82g',
      fat: '31g',
      sodium: '360mg',
    }
  }
];
