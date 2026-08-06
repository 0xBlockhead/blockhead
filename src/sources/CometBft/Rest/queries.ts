import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.CometBft_Rest][0]

const unsignedIntegerString = '/^(0|[1-9][0-9]*)$/'

const cometBftBlockWire = arktype({
	result: {
		block_id: {
			hash: 'string > 0',
		},
		block: {
			header: {
				height: unsignedIntegerString,
				time: 'string > 0',
				proposer_address: 'string > 0',
				'chain_id?': 'string',
			},
			data: {
				'txs?': 'string[]',
			},
		},
	},
})

const cometBftTxWire = arktype({
	result: {
		hash: 'string > 0',
		height: unsignedIntegerString,
		index: 'number.integer >= 0',
		tx_result: {
			code: 'number.integer >= 0',
			'codespace?': 'string',
			gas_wanted: unsignedIntegerString,
			gas_used: unsignedIntegerString,
			'log?': 'string',
			'events?': arktype({
				type: 'string > 0',
			}).array(),
		},
	},
})

const cometBftStatusWire = arktype({
	result: {
		node_info: {
			network: 'string > 0',
			'version?': 'string',
			'moniker?': 'string',
		},
		sync_info: {
			latest_block_hash: 'string > 0',
			latest_block_height: unsignedIntegerString,
			latest_block_time: 'string > 0',
			catching_up: 'boolean',
		},
	},
})

const cometBftBlockchainWire = arktype({
	result: {
		last_height: unsignedIntegerString,
		block_metas: arktype({
			block_id: {
				hash: 'string > 0',
			},
			header: {
				height: unsignedIntegerString,
				time: 'string > 0',
				proposer_address: 'string > 0',
				'chain_id?': 'string',
			},
			num_txs: unsignedIntegerString,
		}).array(),
	},
})

const assertHeight = (height: bigint) => {
	if (height < 0n)
		throw new Error(`${Source.CometBft_Rest}: invalid block height ${height}`)
}

const assertTxHash = (txHash: string) => {
	if (txHash.length === 0)
		throw new Error(`${Source.CometBft_Rest}: transaction hash is empty`)
}

const assertBlockHash = (hash: string) => {
	if (hash.length === 0)
		throw new Error(`${Source.CometBft_Rest}: block hash is empty`)
}

const assertHeightWindow = (
	minHeight: bigint,
	maxHeight: bigint
) => {
	assertHeight(minHeight)
	assertHeight(maxHeight)
	if (minHeight > maxHeight)
		throw new Error(`${Source.CometBft_Rest}: invalid height window ${minHeight}..${maxHeight}`)
	if (maxHeight - minHeight > 100n)
		throw new Error(`${Source.CometBft_Rest}: height window exceeds 100 blocks`)
}

export const getBlock = ({
	height,
}: {
	height: bigint
}) => {
	assertHeight(height)
	return getJson(
		binding,
		`/block?height=${height.toString()}`
	).then((response) => (
		cometBftBlockWire.assert(response)
	))
}

export const getBlockByHash = ({
	hash,
}: {
	hash: string
}) => {
	assertBlockHash(hash)
	return getJson(
		binding,
		`/block_by_hash?hash=0x${hash.replace(/^0x/i, '')}`
	).then((response) => (
		cometBftBlockWire.assert(response)
	))
}

export const getTx = ({
	txHash,
}: {
	txHash: string
}) => {
	assertTxHash(txHash)
	return getJson(
		binding,
		`/tx?hash=0x${txHash.replace(/^0x/i, '')}`
	).then((response) => (
		cometBftTxWire.assert(response)
	))
}

export const getStatus = () => (
	getJson(
		binding,
		'/status'
	).then((response) => (
		cometBftStatusWire.assert(response)
	))
)

export const getBlockchain = ({
	minHeight,
	maxHeight,
}: {
	minHeight: bigint
	maxHeight: bigint
}) => {
	assertHeightWindow(minHeight, maxHeight)
	return getJson(
		binding,
		`/blockchain?minHeight=${minHeight.toString()}&maxHeight=${maxHeight.toString()}`
	).then((response) => (
		cometBftBlockchainWire.assert(response)
	))
}
