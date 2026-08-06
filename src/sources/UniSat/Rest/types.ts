/**
 * UniSat OpenAPI wire shapes (inscription + runes indexer).
 * @see https://docs.unisat.io/developer-support/open-api-documentation.md
 * @see https://github.com/unisat-wallet/unisat-dev-docs/blob/master/open-api/auto-generated/docs/inscription-indexer.md
 * @see https://github.com/unisat-wallet/unisat-dev-docs/blob/master/open-api/auto-generated/docs/runes-indexer.md
 */

export type UniSatEnvelope<_Data> = {
	code: 0 | -1
	msg: string
	data: _Data
}

export type UniSatInscriptionUtxo = {
	address?: string
	codeType?: number
	height?: number
	idx?: number
	isOpInRBF?: boolean
	satoshi?: number
	scriptPk?: string
	scriptType?: string
	txid: string
	vout: number
}

export type UniSatInscriptionInfo = {
	address?: string
	contentBody?: string
	contentLength?: number
	contentType?: string
	height?: number
	inSatoshi?: number
	outSatoshi?: number
	inscriptionId: string
	inscriptionIndex?: number
	inscriptionNumber?: number
	offset?: number
	timestamp?: number
	utxo?: UniSatInscriptionUtxo
}

export type UniSatRuneTerms = {
	amount?: string | null
	cap?: string | null
	heightStart?: number | null
	heightEnd?: number | null
	offsetStart?: number | null
	offsetEnd?: number | null
}

export type UniSatRuneInfo = {
	runeid: string
	rune?: string
	spacedRune?: string
	number?: number
	height?: number
	txidx?: number
	timestamp?: number
	divisibility?: number
	symbol?: string
	etching?: string
	premine?: string
	terms?: UniSatRuneTerms | null
	mints?: string
	burned?: string
	holders?: number
	transactions?: number
	supply?: string
	start?: number
	end?: number
	mintable?: boolean
	remaining?: string
}

export type UniSatRuneBalance = {
	amount: string
	runeid: string
	rune?: string
	spacedRune?: string
	symbol?: string
	divisibility?: number
}

export type UniSatPaged<_Item> = {
	total: number
	start: number
	detail: _Item[]
}

export type UniSatAddressInscriptionData = {
	inscriptionId: string
	inscriptionNumber?: number
	contentType?: string
	utxo?: UniSatInscriptionUtxo
}
