import { type as arktype } from 'arktype'

const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const txIdWire = arktype('/^[0-9a-f]{64}$/')
const blockHashWire = arktype('/^[0-9a-f]{64}$/')

export const esploraBlockWire = arktype({
	id: blockHashWire,
	height: unsignedSafe,
	'version?': 'number.integer',
	timestamp: unsignedSafe,
	tx_count: unsignedSafe,
	'size?': unsignedSafe,
	'weight?': unsignedSafe,
	'merkle_root?': 'string',
	'previousblockhash?': blockHashWire,
	'mediantime?': unsignedSafe,
	'nonce?': unsignedSafe,
	'bits?': unsignedSafe,
	'difficulty?': 'number',
})

const esploraOutputWire = arktype({
	scriptpubkey: 'string',
	'scriptpubkey_asm?': 'string',
	'scriptpubkey_type?': 'string',
	'scriptpubkey_address?': 'string',
	'value?': unsignedSafe,
	'valuecommitment?': 'string',
	'asset?': 'string',
	'assetcommitment?': 'string',
	'nonce?': 'string',
	'noncecommitment?': 'string',
	'surjection_proof?': 'string',
	'range_proof?': 'string',
})

const esploraInputWire = arktype({
	'txid?': txIdWire,
	'vout?': unsignedSafe,
	'prevout?': esploraOutputWire.or(arktype('null')),
	'scriptsig?': 'string',
	'scriptsig_asm?': 'string',
	'witness?': 'string[]',
	'is_coinbase?': 'boolean',
	'sequence?': unsignedSafe,
})

export const esploraTransactionWire = arktype({
	txid: txIdWire,
	'version?': 'number.integer',
	'locktime?': unsignedSafe,
	'size?': unsignedSafe,
	'weight?': unsignedSafe,
	'fee?': unsignedSafe,
	status: {
		confirmed: 'boolean',
		'block_height?': unsignedSafe,
		'block_hash?': blockHashWire,
		'block_time?': unsignedSafe,
	},
	vin: esploraInputWire.array(),
	vout: esploraOutputWire.array(),
})

export const esploraAssetStatsWire = arktype({
	tx_count: unsignedSafe,
	'issuance_count?': unsignedSafe,
	'issued_amount?': unsignedSafe,
	'burned_amount?': unsignedSafe,
	'has_blinded_issuances?': 'boolean',
	'reissuance_tokens?': unsignedSafe.or(arktype('null')),
	'burned_reissuance_tokens?': unsignedSafe,
	'peg_in_count?': unsignedSafe,
	'peg_in_amount?': unsignedSafe,
	'peg_out_count?': unsignedSafe,
	'peg_out_amount?': unsignedSafe,
	'burn_count?': unsignedSafe,
})

export const esploraAssetWire = arktype({
	asset_id: nonEmptyString,
	'name?': 'string',
	'ticker?': 'string',
	'precision?': unsignedSafe,
	'entity?': {
		domain: nonEmptyString,
	},
	'contract?': 'unknown',
	chain_stats: esploraAssetStatsWire,
	mempool_stats: esploraAssetStatsWire,
})

export const assertEsploraEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string,
	sourceLabel = 'Esplora_Rest'
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${sourceLabel}: invalid ${label} envelope`)
	}
}
