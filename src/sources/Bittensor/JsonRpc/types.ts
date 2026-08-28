import { type as arktype } from 'arktype'

export const bittensorScaleBytesWire = arktype('(0 <= number.integer <= 255)[]')

export const bittensorNetuidWire = arktype('0 <= number.integer <= 65535')

export const bittensorUidWire = arktype('0 <= number.integer <= 65535')

export const bittensorBlockHashWire = arktype('/^0x[0-9a-fA-F]{64}$/')

export type BittensorScaleBytes = typeof bittensorScaleBytesWire.infer
