import { type } from 'arktype'

export const EvmAbiParameter = type({
	'name?': 'string',
	type: 'string',
	'indexed?': 'boolean',
})

export const EvmAbiEntry = type({
	type: 'string',
	'name?': 'string',
	'inputs?': EvmAbiParameter.array(),
	'outputs?': EvmAbiParameter.array(),
	'stateMutability?': 'string',
	'anonymous?': 'boolean',
})

export const EvmAbi = EvmAbiEntry.array()

export type EvmAbiEntry = typeof EvmAbiEntry.infer
