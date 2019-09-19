export function isZoneLess(c): boolean {
  return c.constructor.name === 'NoopNgZone';
}
