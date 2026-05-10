import { ValidationDomainError } from '../../../common/domainErrors';
import { CorePersonalValue } from '../CorePersonalValue';
import { allCorePersonalValues } from '../ValidCorePersonalValues';

describe('CorePersonalValue', () => {
  it('should create a valid CorePersonalValue', async () => {
    const value = allCorePersonalValues[0];

    const corePersonalValue = CorePersonalValue.create(value);

    expect(corePersonalValue).toBeInstanceOf(CorePersonalValue);
    expect(corePersonalValue.value).toBe(value);
  });

  it('should be all lowercase', async () => {
    const value = allCorePersonalValues[0].toUpperCase();

    const corePersonalValue = CorePersonalValue.create(value);

    expect(corePersonalValue.value).toBe(value.toLowerCase());
  });

  it('should not contain trailing whitespaces', async () => {
    const value = `   ${allCorePersonalValues[0]}   `;

    const corePersonalValue = CorePersonalValue.create(value);

    expect(corePersonalValue.value).toBe(value.trim().toLowerCase());
  });

  it('should create a value for each contemplated one in the application', async () => {
    allCorePersonalValues.forEach((value) => {
      const corePersonalValue = CorePersonalValue.create(value);

      expect(corePersonalValue).toBeInstanceOf(CorePersonalValue);
      expect(corePersonalValue.value).toBe(value.toLowerCase());
    });
  });

  describe('Errors', () => {
    it('should throw error for invalid value', async () => {
      const invalidValue = 'invalid-value';

      expect(() => CorePersonalValue.create(invalidValue)).toThrow(ValidationDomainError);
      expect(() => CorePersonalValue.create(invalidValue)).toThrow(
        /CorePersonalValue: invalid value/,
      );
    });

    it('should throw an error if the value is empty', async () => {
      const value = '';

      expect(() => CorePersonalValue.create(value)).toThrow(ValidationDomainError);
    });

    describe('It should contain only letters', () => {
      it('should throw an error if the value contains numbers', async () => {
        const value = 'value123';

        expect(() => CorePersonalValue.create(value)).toThrow(ValidationDomainError);
        expect(() => CorePersonalValue.create(value)).toThrow(/CorePersonalValue: invalid value/);
      });
    });
  });
});
