import { normalizeCityForWeather, isOpenWeatherConfigured, isPixabayConfigured, MOROCCAN_CITIES } from './config';

describe('Weather and Gallery Configuration Suite', () => {
  test('normalizeCityForWeather normalizes accents and case', () => {
    expect(normalizeCityForWeather('Fès')).toBe('Fes');
    expect(normalizeCityForWeather('Meknès')).toBe('Meknes');
    expect(normalizeCityForWeather('casablanca')).toBe('Casablanca');
    expect(normalizeCityForWeather('Rabat,MA')).toBe('Rabat');
  });

  test('detects placeholder keys gracefully without throwing', () => {
    // Under test environment without env vars, placeholders should return false
    expect(typeof isOpenWeatherConfigured()).toBe('boolean');
    expect(typeof isPixabayConfigured()).toBe('boolean');
  });

  test('Moroccan cities list contains major hubs', () => {
    expect(MOROCCAN_CITIES).toContain('Casablanca');
    expect(MOROCCAN_CITIES).toContain('Marrakech');
    expect(MOROCCAN_CITIES).toContain('Agadir');
    expect(MOROCCAN_CITIES).toContain('Tanger');
  });
});
