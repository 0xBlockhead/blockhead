export type OpenchainSignatureEntryWire = {
	name: string
	filtered?: boolean
	hasVerifiedContract?: boolean
}

export type OpenchainLookupResultWire = {
	function?: Record<string, OpenchainSignatureEntryWire[] | null>
	event?: Record<string, OpenchainSignatureEntryWire[]>
}

export type OpenchainLookupResponseWire = {
	ok?: boolean
	result?: OpenchainLookupResultWire
}

export const looksLikeSolidityErrorName = (text: string) => (
	text.startsWith('Error(') ||
	text.startsWith('Panic(') ||
	/^[A-Z][a-zA-Z0-9_]*\(/.test(text)
)
