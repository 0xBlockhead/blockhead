import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	SidecarAccountAssetBalances,
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'
import bindings from '$/sources/SubstrateSidecar/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.SubstrateSidecar_Rest][0]

const unsignedDecimal = '/^(0|[1-9]\\d*)$/'

const sidecarBlockEventWire = arktype({
	method: arktype('string > 0').or({
		pallet: 'string > 0',
		method: 'string > 0',
	}),
	'data?': 'unknown',
	'phase?': 'unknown',
	'topics?': 'unknown',
})

const sidecarExtrinsicWire = arktype({
	method: {
		pallet: 'string > 0',
		method: 'string > 0',
	},
	'signature?': arktype({
		'signer?': arktype('string > 0').or({
			'id?': 'string > 0',
			'address?': 'string > 0',
		}),
	}).or('null'),
	'hash?': 'string > 0',
	'events?': sidecarBlockEventWire.array(),
	'success?': 'boolean',
})

const sidecarBlockWire = arktype({
	number: unsignedDecimal,
	hash: 'string > 0',
	parentHash: 'string > 0',
	stateRoot: 'string > 0',
	extrinsicsRoot: 'string > 0',
	'authorId?': 'string > 0',
	'onInitialize?': {
		'events?': sidecarBlockEventWire.array(),
	},
	extrinsics: sidecarExtrinsicWire.array(),
	'onFinalize?': {
		'events?': sidecarBlockEventWire.array(),
	},
})

const sidecarAccountBalanceInfoWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	nonce: unsignedDecimal,
	tokenSymbol: 'string > 0',
	free: unsignedDecimal,
	reserved: unsignedDecimal,
	'frozen?': arktype(unsignedDecimal).or('string'),
	'miscFrozen?': 'string',
	'feeFrozen?': 'string',
	'transferable?': unsignedDecimal,
	'locks?': 'unknown[]',
})

const sidecarRuntimePalletWire = arktype({
	name: 'string > 0',
	'index?': arktype('number.integer >= 0').or(unsignedDecimal),
})

const sidecarRuntimeMetadataWire = arktype({
	'magicNumber?': 'number.integer',
	metadata: {
		v14: {
			pallets: sidecarRuntimePalletWire.array(),
		},
	},
}).or({
	pallets: sidecarRuntimePalletWire.array(),
})

const sidecarStakingValidatorsWire = arktype({
	'at?': {
		'hash?': 'string > 0',
		'height?': unsignedDecimal,
	},
	'validators?': arktype({
		'accountId?': 'string > 0',
		'address?': 'string > 0',
		'stashId?': 'string > 0',
		'controllerId?': 'string > 0',
		'commission?': arktype('string').or('number'),
		'totalStake?': 'string',
	}).array(),
})

const sidecarAccountAssetBalancesWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	assets: arktype({
		assetId: arktype('string > 0').or('number.integer >= 0'),
		balance: unsignedDecimal,
		'isFrozen?': 'boolean',
		'isSufficient?': 'boolean',
	}).array(),
})

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.SubstrateSidecar_Rest}: invalid ${label} response envelope`)
	}
}

const runtimeMetadataPallets = (
	response: ReturnType<typeof sidecarRuntimeMetadataWire.assert>
): SidecarRuntimeMetadata => (
	'pallets' in response ?
		{
			pallets: response.pallets,
		}
	:
		{
			pallets: response.metadata.v14.pallets,
		}
)

export const getBlock = async ({
	blockId,
}: {
	blockId: bigint | string
}) => (
	assertEnvelope(
		'block',
		sidecarBlockWire,
		await getJson<unknown>(
			binding,
			`/blocks/${String(blockId)}`
		)
	) as SidecarBlock
)

export const getBlockHead = async ({
	finalized = true,
}: {
	finalized?: boolean
} = {}) => (
	assertEnvelope(
		'block head',
		sidecarBlockWire,
		await getJson<unknown>(
			binding,
			`/blocks/head?finalized=${finalized ? 'true' : 'false'}`
		)
	) as SidecarBlock
)

export const getAccountBalanceInfo = async ({
	accountId,
}: {
	accountId: string
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return assertEnvelope(
		'account balance info',
		sidecarAccountBalanceInfoWire,
		await getJson<unknown>(
			binding,
			`/accounts/${encodeURIComponent(accountId)}/balance-info`
		)
	) as SidecarAccountBalanceInfo
}

export const getAccountAssetBalances = async ({
	accountId,
}: {
	accountId: string
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return assertEnvelope(
		'account asset balances',
		sidecarAccountAssetBalancesWire,
		await getJson<unknown>(
			binding,
			`/accounts/${encodeURIComponent(accountId)}/asset-balances`
		)
	) as SidecarAccountAssetBalances
}

export const getRuntimeMetadata = async () => (
	runtimeMetadataPallets(
		assertEnvelope(
			'runtime metadata',
			sidecarRuntimeMetadataWire,
			await getJson<unknown>(
				binding,
				'/runtime/metadata'
			)
		)
	)
)

export const getStakingValidators = async () => (
	assertEnvelope(
		'staking validators',
		sidecarStakingValidatorsWire,
		await getJson<unknown>(
			binding,
			'/pallets/staking/validators'
		)
	) as SidecarStakingValidators
)
