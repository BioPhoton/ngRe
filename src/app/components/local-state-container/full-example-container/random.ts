import * as faker from 'faker';

export function getRandomAttendees(num) {
  return Array.from({length: num})
    .map((_, index) => (
      {
        id: faker.random.number(num),
        cid: faker.random.number(5),
        name: faker.name.findName(),
        specialMember: Math.random() < 0.5
      })
    );
}

export function getRandomCity(num) {
  return Array.from({length: num})
    .map((_, index) => (
      {
        id: faker.random.number(num),
        name: faker.address.city()
      })
    );
}
