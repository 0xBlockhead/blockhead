import { type as arktype } from 'arktype'

export const bittensorScaleBytesWire = arktype('(number.integer >= 0 <= 255)[]')

export const bittensorNetuidWire = arktype('number.integer >= 0 <= 65535')

export const bittensorUidWire = arktype('number.integer >= 0 <= 65535')

export const bittensorBlockHashWire = arktype('/^0x[0-9a-fA-F]{64}$/')

export type BittensorScaleBytes = typeof bittensorScaleBytesWire.infer
