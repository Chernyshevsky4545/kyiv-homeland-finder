// Kyiv Metro stations with coordinates
export interface MetroStation {
  name: string;
  lat: number;
  lng: number;
  line: 'red' | 'blue' | 'green';
}

export const metroStations: MetroStation[] = [
  // Red line (M1 - Sviatoshynsko-Brovarska)
  { name: 'Академмістечко', lat: 50.4647, lng: 30.3554, line: 'red' },
  { name: 'Житомирська', lat: 50.4561, lng: 30.3654, line: 'red' },
  { name: 'Святошин', lat: 50.4579, lng: 30.3900, line: 'red' },
  { name: 'Нивки', lat: 50.4589, lng: 30.4040, line: 'red' },
  { name: 'Берестейська', lat: 50.4585, lng: 30.4210, line: 'red' },
  { name: 'Шулявська', lat: 50.4547, lng: 30.4395, line: 'red' },
  { name: 'Політехнічний інститут', lat: 50.4508, lng: 30.4505, line: 'red' },
  { name: 'Вокзальна', lat: 50.4415, lng: 30.4492, line: 'red' },
  { name: 'Університет', lat: 50.4436, lng: 30.5060, line: 'red' },
  { name: 'Театральна', lat: 50.4445, lng: 30.5185, line: 'red' },
  { name: 'Хрещатик', lat: 50.4474, lng: 30.5228, line: 'red' },
  { name: 'Арсенальна', lat: 50.4425, lng: 30.5462, line: 'red' },
  { name: 'Дніпро', lat: 50.4413, lng: 30.5588, line: 'red' },
  { name: 'Гідропарк', lat: 50.4415, lng: 30.5770, line: 'red' },
  { name: 'Лівобережна', lat: 50.4510, lng: 30.5980, line: 'red' },
  { name: 'Дарниця', lat: 50.4555, lng: 30.6130, line: 'red' },
  { name: 'Чернігівська', lat: 50.4600, lng: 30.6320, line: 'red' },
  { name: 'Лісова', lat: 50.4645, lng: 30.6452, line: 'red' },
  // Blue line (M2 - Kurenivsko-Chervonoarmiyska)
  { name: 'Героїв Дніпра', lat: 50.5225, lng: 30.4988, line: 'blue' },
  { name: 'Мінська', lat: 50.5130, lng: 30.4985, line: 'blue' },
  { name: 'Оболонь', lat: 50.5014, lng: 30.4980, line: 'blue' },
  { name: 'Почайна', lat: 50.4870, lng: 30.4975, line: 'blue' },
  { name: 'Тараса Шевченка', lat: 50.4735, lng: 30.5050, line: 'blue' },
  { name: 'Контрактова площа', lat: 50.4650, lng: 30.5115, line: 'blue' },
  { name: 'Поштова площа', lat: 50.4580, lng: 30.5230, line: 'blue' },
  { name: 'Майдан Незалежності', lat: 50.4500, lng: 30.5240, line: 'blue' },
  { name: 'Площа Українських Героїв', lat: 50.4410, lng: 30.5240, line: 'blue' },
  { name: 'Олімпійська', lat: 50.4320, lng: 30.5160, line: 'blue' },
  { name: 'Палац "Україна"', lat: 50.4215, lng: 30.5210, line: 'blue' },
  { name: 'Либідська', lat: 50.4210, lng: 30.5270, line: 'blue' },
  { name: 'Деміївська', lat: 50.4105, lng: 30.5170, line: 'blue' },
  { name: 'Голосіївська', lat: 50.3975, lng: 30.5100, line: 'blue' },
  { name: 'Васильківська', lat: 50.3930, lng: 30.4880, line: 'blue' },
  { name: 'Виставковий центр', lat: 50.3825, lng: 30.4770, line: 'blue' },
  { name: 'Іподром', lat: 50.3720, lng: 30.4660, line: 'blue' },
  { name: 'Теремки', lat: 50.3620, lng: 30.4560, line: 'blue' },
  // Green line (M3 - Syretsko-Pecherska)
  { name: 'Сирець', lat: 50.4760, lng: 30.4315, line: 'green' },
  { name: 'Дорогожичі', lat: 50.4710, lng: 30.4480, line: 'green' },
  { name: 'Лук\'янівська', lat: 50.4600, lng: 30.4820, line: 'green' },
  { name: 'Золоті ворота', lat: 50.4487, lng: 30.5130, line: 'green' },
  { name: 'Палац спорту', lat: 50.4380, lng: 30.5210, line: 'green' },
  { name: 'Кловська', lat: 50.4340, lng: 30.5340, line: 'green' },
  { name: 'Печерська', lat: 50.4270, lng: 30.5410, line: 'green' },
  { name: 'Звіринецька', lat: 50.4175, lng: 30.5505, line: 'green' },
  { name: 'Видубичі', lat: 50.4050, lng: 30.5630, line: 'green' },
  { name: 'Славутич', lat: 50.3940, lng: 30.6020, line: 'green' },
  { name: 'Осокорки', lat: 50.3960, lng: 30.6170, line: 'green' },
  { name: 'Позняки', lat: 50.3980, lng: 30.6350, line: 'green' },
  { name: 'Харківська', lat: 50.4010, lng: 30.6530, line: 'green' },
  { name: 'Вирлиця', lat: 50.4060, lng: 30.6640, line: 'green' },
  { name: 'Бориспільська', lat: 50.4040, lng: 30.6800, line: 'green' },
  { name: 'Червоний хутір', lat: 50.4090, lng: 30.6960, line: 'green' },
];

/** Haversine distance in meters */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestMetroDistance(lat: number, lng: number): { station: MetroStation; distance: number } {
  let best = { station: metroStations[0], distance: Infinity };
  for (const s of metroStations) {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < best.distance) best = { station: s, distance: d };
  }
  return best;
}

/** Threshold in meters to consider "near metro" */
export const NEAR_METRO_THRESHOLD = 1000;
