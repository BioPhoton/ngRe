import * as faker from 'faker';

export function getRandomAttendees(num, range?) {
  return Array.from({length: num})
    .map((_, index) => (
      {
        id: faker.random.number(range || num),
        cid: faker.random.number(5),
        name: faker.name.findName(),
        specialMember: Math.random() < 0.5
      })
    );
}

export function getRandomCity(num, range?) {
  return Array.from({length: num})
    .map((_, index) => (
      {
        id: faker.random.number(range || num),
        name: faker.address.city()
      })
    );
}
