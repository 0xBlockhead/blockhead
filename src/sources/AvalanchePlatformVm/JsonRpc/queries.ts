import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/AvalanchePlatformVm/bindings.ts'
import type {
	AvalanchePlatformVmBalance,
	AvalanchePlatformVmBlock,
	AvalanchePlatformVmBlockchains,
	AvalanchePlatformVmHeight,
	AvalanchePlatformVmStake,
	AvalanchePlatformVmSubnets,
	AvalanchePlatformVmTx,
	AvalanchePlatformVmTxStatus,
	AvalanchePlatformVmUtxoIndex,
	AvalanchePlatformVmUtxos,
	AvalanchePlatformVmValidators,
} from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.AvalanchePlatformVm_JsonRpc][0]

const outputOwnerWire = arktype({
	locktime: 'string',
	threshold: 'string',
	addresses: 'string[]',
})

const delegatorWire = arktype({
	txID: 'string',
	startTime: 'string',
	endTime: 'string',
	weight: 'string',
	nodeID: 'string',
	rewardOwner: outputOwnerWire,
	potentialReward: 'string',
})

const validatorWire = arktype({
	'txID?': 'string',
	startTime: 'string',
	'endTime?': 'string',
	nodeID: 'string',
	weight: 'string',
	'validationID?': 'string',
	'publicKey?': 'string',
	'validationRewardOwner?': outputOwnerWire,
	'delegationRewardOwner?': outputOwnerWire,
	'potentialReward?': 'string',
	'delegationFee?': 'string',
	'uptime?': 'string',
	'connected?': 'boolean',
	'delegatorCount?': 'string',
	'delegatorWeight?': 'string',
	'delegators?': delegatorWire.array(),
})

const heightWire = arktype({
	height: 'string',
})

const blockchainsWire = arktype({
	blockchains: arktype({
		id: 'string',
		name: 'string',
		subnetID: 'string',
		vmID: 'string',
	}).array(),
})

const subnetsWire = arktype({
	subnets: arktype({
		id: 'string',
		controlKeys: 'string[]',
		threshold: 'string',
	}).array(),
})

const validatorsWire = arktype({
	validators: validatorWire.array(),
})

const balanceWire = arktype({
	balance: 'string',
	unlocked: 'string',
	lockedStakeable: 'string',
	lockedNotStakeable: 'string',
	balances: 'Record<string, string>',
	unlockeds: 'Record<string, string>',
	lockedStakeables: 'Record<string, string>',
	lockedNotStakeables: 'Record<string, string>',
	utxoIDs: arktype({
		txID: 'string',
		outputIndex: 'number.integer',
	}).array(),
})

const stakeWire = arktype({
	staked: 'string',
	stakeds: 'Record<string, string>',
	stakedOutputs: 'string[]',
	encoding: 'string',
})

const utxoIndexWire = arktype({
	address: 'string',
	utxo: 'string',
})

const utxosWire = arktype({
	numFetched: 'string',
	utxos: 'string[]',
	endIndex: utxoIndexWire,
	encoding: 'string',
})

const txStatusWire = arktype({
	status: "'Committed' | 'Processing' | 'Dropped' | 'Unknown'",
	'reason?': 'string',
})

const jsonBlockWire = arktype({
	parentID: 'string',
	height: 'number.integer | string',
	id: 'string',
	'timestamp?': 'number | string',
	'txs?': 'unknown[]',
	'tx?': 'unknown',
})

const blockWire = arktype({
	block: arktype('string').or(jsonBlockWire),
	encoding: 'string',
})

const txWire = arktype({
	tx: arktype('string').or(arktype('Record<string, unknown>')),
	encoding: 'string',
})

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: invalid ${label} response envelope`)
	}
}

const request = async <_Result>(
	method: string,
	params?: Readonly<Record<string, unknown>>
) => (
	jsonRpc2<_Result>(binding, method, params)
)

export const getHeight = async () => (
	assertEnvelope(
		'height',
		heightWire,
		await request<unknown>('platform.getHeight')
	) as AvalanchePlatformVmHeight
)

export const getBlockchains = async () => (
	assertEnvelope(
		'blockchains',
		blockchainsWire,
		await request<unknown>('platform.getBlockchains')
	) as AvalanchePlatformVmBlockchains
)

export const getSubnets = async (
	params: {
		ids?: string[]
	} = {}
) => (
	assertEnvelope(
		'subnets',
		subnetsWire,
		await request<unknown>('platform.getSubnets', params)
	) as AvalanchePlatformVmSubnets
)

export const getCurrentValidators = async (
	params: {
		subnetID?: string
		nodeIDs?: string[]
	} = {}
) => (
	assertEnvelope(
		'validators',
		validatorsWire,
		await request<unknown>('platform.getCurrentValidators', params)
	) as AvalanchePlatformVmValidators
)

export const getPendingValidators = async (
	params: {
		subnetID?: string
		nodeIDs?: string[]
	} = {}
) => (
	assertEnvelope(
		'pending validators',
		validatorsWire,
		await request<unknown>('platform.getPendingValidators', params)
	) as AvalanchePlatformVmValidators
)

export const getBalance = async (
	addresses: string[]
) => (
	assertEnvelope(
		'balance',
		balanceWire,
		await request<unknown>('platform.getBalance', { addresses })
	) as AvalanchePlatformVmBalance
)

export const getStake = async (
	addresses: string[],
	validatorsOnly = false
) => (
	assertEnvelope(
		'stake',
		stakeWire,
		await request<unknown>('platform.getStake', {
			addresses,
			validatorsOnly,
		})
	) as AvalanchePlatformVmStake
)

export const getTxStatus = async (
	txID: string
) => {
	if (txID === '')
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: empty transaction id`)

	return assertEnvelope(
		'tx status',
		txStatusWire,
		await request<unknown>('platform.getTxStatus', { txID })
	) as AvalanchePlatformVmTxStatus
}

export const getTx = async (
	txID: string,
	encoding: 'hex' | 'json' = 'json'
) => {
	if (txID === '')
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: empty transaction id`)

	return assertEnvelope(
		'tx',
		txWire,
		await request<unknown>('platform.getTx', {
			txID,
			encoding,
		})
	) as AvalanchePlatformVmTx
}

export const getBlockByHeight = async (
	height: bigint,
	encoding: 'hex' | 'json' = 'json'
) => {
	if (height < 0n)
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: block height must be nonnegative`)
	const numericHeight = Number(height)
	if (!Number.isSafeInteger(numericHeight))
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: unsafe block height ${height}`)

	return assertEnvelope(
		'block by height',
		blockWire,
		await request<unknown>('platform.getBlockByHeight', {
			height: numericHeight,
			encoding,
		})
	) as AvalanchePlatformVmBlock
}

export const getBlock = async (
	blockID: string,
	encoding: 'hex' | 'json' = 'json'
) => {
	if (blockID === '')
		throw new Error(`${Source.AvalanchePlatformVm_JsonRpc}: empty block id`)

	return assertEnvelope(
		'block',
		blockWire,
		await request<unknown>('platform.getBlock', {
			blockID,
			encoding,
		})
	) as AvalanchePlatformVmBlock
}

export const getUtxos = async (
	addresses: string[],
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('AvalanchePlatformVm_JsonRpc: UTXO limit must be a nonnegative safe integer')

	const utxos = new Set<string>()
	const seenIndexes = new Set<string>()
	let startIndex: AvalanchePlatformVmUtxoIndex | undefined
	let encoding = 'hex'
	while (utxos.size < limit) {
		const pageLimit = Math.min(limit - utxos.size, 1024)
		const page = assertEnvelope(
			'utxos',
			utxosWire,
			await request<unknown>('platform.getUTXOs', {
				addresses,
				limit: pageLimit,
				...(startIndex != null && { startIndex }),
				encoding: 'hex',
			})
		) as AvalanchePlatformVmUtxos
		encoding = page.encoding
		const previousSize = utxos.size
		for (const utxo of page.utxos)
			if (utxos.size < limit)
				utxos.add(utxo)
		if (
			Number(page.numFetched) < pageLimit
			|| utxos.size === previousSize
		)
			break
		const indexKey = `${page.endIndex.address}:${page.endIndex.utxo}`
		if (seenIndexes.has(indexKey))
			break
		seenIndexes.add(indexKey)
		startIndex = page.endIndex
	}

	return {
		utxos: [...utxos],
		...(startIndex != null && { endIndex: startIndex }),
		encoding,
	}
}
