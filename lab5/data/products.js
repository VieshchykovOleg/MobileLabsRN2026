// Масив тестових даних для каталогу товарів
export const products = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 54999,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80',
    description:
      'Флагманський смартфон Apple з процесором A17 Pro, титановим корпусом та системою камер Pro з 48 МП сенсором. Підтримує USB-C та функцію Action Button.',
    category: 'Смартфони',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 49999,
    image: 'https://images.unsplash.com/photo-1706474197697-a4cc1b8c6e3e?w=400&q=80',
    description:
      'Топовий Android-смартфон з вбудованим стилусом S Pen, 200 МП камерою та 12 ГБ оперативної пам\'яті. Ідеальний для продуктивності та творчості.',
    category: 'Смартфони',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3',
    price: 89999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    description:
      'Потужний ноутбук з чипом Apple M3, Liquid Retina XDR дисплеєм та до 22 годин автономної роботи. Ідеальний для розробників та дизайнерів.',
    category: 'Ноутбуки',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    description:
      'Бездротові навушники з провідним шумозаглушенням, до 30 годин роботи від акумулятора та преміальною якістю звуку Hi-Res Audio.',
    category: 'Аудіо',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '5',
    name: 'iPad Air M2',
    price: 32999,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    description:
      'Тонкий та легкий планшет з чипом M2, підтримкою Apple Pencil Pro та Magic Keyboard. Ідеальний баланс потужності та мобільності.',
    category: 'Планшети',
    rating: 4.8,
    inStock: false,
  },
  {
    id: '6',
    name: 'Dell XPS 15',
    price: 67999,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
    description:
      'Преміальний ноутбук з OLED дисплеєм 4K, процесором Intel Core i9 та відеокартою NVIDIA RTX 4060. Чудовий вибір для геймерів та творчих професіоналів.',
    category: 'Ноутбуки',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '7',
    name: 'Apple Watch Ultra 2',
    price: 29999,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
    description:
      'Найбільш просунутий смарт-годинник Apple з корпусом з титану, до 60 годин автономної роботи та GPS подвійної частоти. Створений для екстремальних умов.',
    category: 'Смарт-годинники',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '8',
    name: 'LG OLED C4 55"',
    price: 44999,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80',
    description:
      'Преміальний OLED телевізор з роздільною здатністю 4K, частотою оновлення 120 Гц та підтримкою Dolby Vision та Dolby Atmos. Ідеальний для домашнього кінотеатру.',
    category: 'Телевізори',
    rating: 4.8,
    inStock: true,
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
