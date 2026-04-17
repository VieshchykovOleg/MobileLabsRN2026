// Генератор тестових даних для новин
export const generateNewsItem = (id) => ({
  id: String(id),
  title: `Новина №${id}: ${TITLES[id % TITLES.length]}`,
  description: DESCRIPTIONS[id % DESCRIPTIONS.length],
  date: generateDate(id),
  image: `https://picsum.photos/seed/${id}/400/200`,
  category: CATEGORIES[id % CATEGORIES.length],
  author: AUTHORS[id % AUTHORS.length],
});

export const generateNews = (start = 1, count = 15) => {
  return Array.from({ length: count }, (_, i) => generateNewsItem(start + i));
};

const generateDate = (id) => {
  const base = new Date(2026, 1, 28);
  base.setDate(base.getDate() - id);
  return base.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const TITLES = [
  'Наукова конференція студентів',
  'Олімпіада з програмування',
  'День відкритих дверей',
  'Міжнародне співробітництво',
  'Нові навчальні програми',
  'Спортивні змагання університету',
  'Відкрита лекція провідного фахівця',
  'Студентські наукові проєкти',
  'Грантова програма для студентів',
  'Практика на провідних підприємствах',
];

const DESCRIPTIONS = [
  'У Житомирській політехніці відбулась масштабна подія, яка зібрала студентів з усіх факультетів. Захід пройшов на найвищому рівні та отримав схвальні відгуки від усіх учасників.',
  'Студенти університету здобули призові місця у змаганнях всеукраїнського рівня. Результати перевершили всі очікування та відкрили нові горизонти для подальшого розвитку.',
  'Університет розпочинає новий етап розвитку із впровадженням сучасних технологій у навчальний процес. Це дозволить студентам отримувати знання на рівні кращих закладів Європи.',
  'Міжнародна делегація відвідала університет з метою налагодження наукового співробітництва. Підписані угоди відкривають нові можливості для студентів та викладачів.',
  'Кафедра комп\'ютерних наук оголошує набір на нові спеціалізовані курси з актуальних напрямів ІТ-індустрії. Курси доступні для студентів усіх спеціальностей.',
];

const CATEGORIES = ['Наука', 'Спорт', 'Освіта', 'Культура', 'Міжнародне'];

const AUTHORS = [
  'Прес-служба університету',
  'Відділ науки',
  'Студентська рада',
  'Деканат ФІТ',
];

export const CONTACTS_DATA = [
  {
    title: 'Керівництво',
    data: [
      { id: 'c1', name: 'Василенко Олег Петрович', role: 'Директор', phone: '+380412 55-10-01', email: 'director@university.edu.ua' },
      { id: 'c2', name: 'Марченко Світлана Василівна', role: 'Заступник з навчальної роботи', phone: '+380412 55-10-02', email: 'deputy.edu@university.edu.ua' },
      { id: 'c3', name: 'Гринченко Андрій Миколайович', role: 'Заступник з наукової роботи', phone: '+380412 55-10-03', email: 'deputy.sci@university.edu.ua' },
    ],
  },
  {
    title: 'Факультет технологій',
    data: [
      { id: 'c4', name: 'Савченко Віктор Іванович', role: 'Декан факультету', phone: '+380412 55-11-01', email: 'dean.tech@university.edu.ua' },
      { id: 'c5', name: 'Кравченко Олена Сергіївна', role: 'Заступник декана', phone: '+380412 55-11-02', email: 'dean.tech.dep@university.edu.ua' },
      { id: 'c6', name: 'Литвиненко Максим Олегович', role: 'Завідувач кафедри', phone: '+380412 55-11-03', email: 'head.dept@university.edu.ua' },
    ],
  },
  {
    title: 'Студентська рада',
    data: [
      { id: 'c7', name: 'Ткаченко Богдан Русланович', role: 'Голова студради', phone: '+380412 55-12-01', email: 'studcouncil@university.edu.ua' },
      { id: 'c8', name: 'Захаренко Юлія Олександрівна', role: 'Заступник голови', phone: '+380412 55-12-02', email: 'studcouncil.dep@university.edu.ua' },
    ],
  },
  {
    title: 'Адміністрація',
    data: [
      { id: 'c9', name: 'Мороз Наталія Іванівна', role: 'Завідувач бібліотеки', phone: '+380412 55-13-01', email: 'library@university.edu.ua' },
      { id: 'c10', name: 'Власенко Дмитро Павлович', role: 'Начальник відділу IT', phone: '+380412 55-13-02', email: 'it@university.edu.ua' },
      { id: 'c11', name: 'Семененко Ірина Вікторівна', role: 'Міжнародні відносини', phone: '+380412 55-13-03', email: 'international@university.edu.ua' },
    ],
  },
];