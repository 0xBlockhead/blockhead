import { type as arktype } from 'arktype'

/** Ethereum Signature Database `GET /signatures/` or `/event-signatures/` */
export const fourbyteSignaturesListWire = arktype({
	results: arktype({
		text_signature: 'string',
	}).array(),
})

export type FourbyteSignaturesList = typeof fourbyteSignaturesListWire.infer
