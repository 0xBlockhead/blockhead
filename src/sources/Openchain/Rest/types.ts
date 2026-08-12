import { type as arktype } from 'arktype'

export const openchainSignatureEntryWire = arktype({
	name: 'string',
	'filtered?': 'boolean',
	'hasVerifiedContract?': 'boolean',
})

export type OpenchainSignatureEntry = typeof openchainSignatureEntryWire.infer

export const openchainSignatureEntriesWire = openchainSignatureEntryWire.array()

export const openchainLookupResponseWire = arktype({
	ok: 'boolean',
	'result?': {
		'function?': 'Record<string, unknown>',
		'event?': 'Record<string, unknown>',
	},
})

export type OpenchainLookupResponse = typeof openchainLookupResponseWire.infer
