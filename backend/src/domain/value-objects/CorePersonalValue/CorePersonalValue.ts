import { ValidationDomainError } from '../../common/domainErrors';
import { Text } from '../Text/Text';
import { ValueObject } from '../ValueObject';
import { allCorePersonalValues } from './ValidCorePersonalValues';

type CorePersonalValueProps = {
  value: string;
};

export class CorePersonalValue extends ValueObject<CorePersonalValueProps> {
  private readonly _value: string;

  private constructor(props: CorePersonalValueProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string) {
    const textValue = Text.create(value, { canBeEmpty: false });

    const processedValue = textValue.value.toLowerCase().trim();

    if (!allCorePersonalValues.includes(processedValue)) {
      throw new ValidationDomainError(
        `CorePersonalValue: invalid value. Allowed values are: ${allCorePersonalValues.join(', ')}`,
      );
    }

    return new CorePersonalValue({ value: processedValue });
  }

  get value(): string {
    return this._value;
  }
}
