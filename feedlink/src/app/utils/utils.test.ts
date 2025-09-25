import { capitalizeFirstLetter, isExpired, isExpiringSoon } from './utils'; 

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });


  it('should return an empty string for null input', () => {
    expect(capitalizeFirstLetter(null)).toBe('');
  });

  it('should return an empty string for an empty string input', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should handle strings that are already capitalized', () => {
    expect(capitalizeFirstLetter('World')).toBe('World');
  });

  it('should handle strings with multiple words', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
  });

  it('should handle strings with non-alphabetic first characters', () => {
    expect(capitalizeFirstLetter('123test')).toBe('123test');
  });
});

describe('isExpired', () => {
   const MOCK_DATE = '2025-09-25T12:00:00.000Z'; 
  

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(MOCK_DATE));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return true for an expired date', () => {
    const expiredDate = '2025-09-24T12:00:00.000Z'; 
    expect(isExpired(expiredDate)).toBe(true);
  });

  it('should return false for a future date', () => {
    const futureDate = '2025-09-26T12:00:00.000Z'; 
    expect(isExpired(futureDate)).toBe(false);
  });

  it('should return false for the current date (not yet expired)', () => {
    expect(isExpired(MOCK_DATE)).toBe(false);
  });

  it('should return false for null input', () => {
    expect(isExpired(null)).toBe(false);
  });

  it('should return false for an invalid date string', () => {
    expect(isExpired('invalid-date-string')).toBe(false);
  });
});

describe('isExpiringSoon', () => {
  const MOCK_DATE = '2025-09-25T12:00:00.000Z';

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(MOCK_DATE));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return true if expiring within the default 3 days', () => {
    const expiringDate = '2025-09-27T12:00:00.000Z'; 
    expect(isExpiringSoon(expiringDate)).toBe(true);
  });

  it('should return true if expiring on the last day of the default window', () => {
    const expiringDate = '2025-09-28T12:00:00.000Z'; 
    expect(isExpiringSoon(expiringDate)).toBe(true);
  });

  it('should return false if expiring outside the default 3 days', () => {
    const notExpiringSoonDate = '2025-09-29T12:00:00.000Z'; 
    expect(isExpiringSoon(notExpiringSoonDate)).toBe(false);
  });

  it('should return true if expiring today', () => {
    expect(isExpiringSoon(MOCK_DATE)).toBe(true);
  });

  it('should return false for an already expired date', () => {
    const expiredDate = '2025-09-24T12:00:00.000Z'; 
    expect(isExpiringSoon(expiredDate)).toBe(false);
  });

  it('should use a custom number of days for the "soon" threshold', () => {
    const expiringSoonCustom = '2025-09-26T12:00:00.000Z'; 
    expect(isExpiringSoon(expiringSoonCustom, 1)).toBe(true);
    expect(isExpiringSoon(expiringSoonCustom, 0)).toBe(false);
  });

  it('should return false for null input', () => {
    expect(isExpiringSoon(null)).toBe(false);
  });

  it('should return false for an invalid date string', () => {
    expect(isExpiringSoon('invalid-date-string')).toBe(false);
  });
});
