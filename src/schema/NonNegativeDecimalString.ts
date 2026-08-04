import { DecimalString } from '$/schema/DecimalString.ts'


export const NonNegativeDecimalString = DecimalString.narrow((value) => !value.startsWith('-'))
