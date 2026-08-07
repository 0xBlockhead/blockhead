import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	SidecarAccountAssetBalances,
	SidecarAccountBalanceInfo,
	SidecarAccountForeignAssetBalances,
	SidecarAccountStakingInfo,
	SidecarAhmInfo,
	SidecarAssetInfo,
	SidecarBlock,
	SidecarBlockExtrinsic,
	SidecarBlockHeader,
	SidecarExtrinsic,
	SidecarNodeNetwork,
	SidecarNodeVersion,
	SidecarOngoingReferenda,
	SidecarRuntimeMetadata,
	SidecarRuntimeSpec,
	SidecarStakingValidators,
	SidecarTransactionMaterial,
} from '$/sources/SubstrateSidecar/Rest/types.ts'
import bindings from '$/sources/SubstrateSidecar/bindings.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const defaultBinding = bindings[Source.SubstrateSidecar_Rest][0]

const bindingOrDefault = (
	binding?: SourceBinding
) => (
	binding ?? defaultBinding
)

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
	'logs?': 'unknown',
	'onInitialize?': {
		'events?': sidecarBlockEventWire.array(),
	},
	extrinsics: sidecarExtrinsicWire.array(),
	'onFinalize?': {
		'events?': sidecarBlockEventWire.array(),
	},
})

const sidecarBlockHeaderWire = arktype({
	number: unsignedDecimal,
	parentHash: 'string > 0',
	stateRoot: 'string > 0',
	extrinsicsRoot: 'string > 0',
	'digest?': 'unknown',
})

const sidecarBlockExtrinsicWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	extrinsics: sidecarExtrinsicWire,
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

const sidecarRuntimeSpecWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	specName: 'string > 0',
	'implName?': 'string > 0',
	authoringVersion: arktype('number.integer >= 0').or(unsignedDecimal),
	specVersion: arktype('number.integer >= 0').or(unsignedDecimal),
	'implVersion?': arktype('number.integer >= 0').or(unsignedDecimal),
	'transactionVersion?': arktype('number.integer >= 0').or(unsignedDecimal),
	'stateVersion?': arktype('number.integer >= 0').or(unsignedDecimal),
})

const sidecarNodeVersionWire = arktype({
	'clientVersion?': 'string > 0',
	'clientImplName?': 'string > 0',
	'chain?': 'string > 0',
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

// Live Asset Hub may return isFrozen as a runtime-capability string instead of boolean.
const sidecarAssetFrozenWire = arktype('boolean').or('string')

const sidecarAccountAssetBalancesWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	assets: arktype({
		assetId: arktype('string > 0').or('number.integer >= 0'),
		balance: unsignedDecimal,
		'isFrozen?': sidecarAssetFrozenWire,
		'isSufficient?': 'boolean',
	}).array(),
})

const sidecarAccountForeignAssetBalancesWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	foreignAssets: arktype({
		multiLocation: 'unknown',
		balance: unsignedDecimal,
		'isFrozen?': sidecarAssetFrozenWire,
		'isSufficient?': 'boolean',
	}).array(),
})

const sidecarAssetInfoWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	assetInfo: {
		owner: 'string > 0',
		issuer: 'string > 0',
		admin: 'string > 0',
		freezer: 'string > 0',
		supply: unsignedDecimal,
		deposit: unsignedDecimal,
		minBalance: unsignedDecimal,
		isSufficient: 'boolean',
		accounts: unsignedDecimal,
		sufficients: unsignedDecimal,
		approvals: unsignedDecimal,
		status: 'string > 0',
	},
	assetMetaData: {
		deposit: unsignedDecimal,
		name: 'string > 0',
		symbol: 'string > 0',
		decimals: arktype('number.integer >= 0').or(unsignedDecimal),
		isFrozen: 'boolean',
	},
})

const sidecarAhmInfoWire = arktype({
	relay: {
		startBlock: unsignedDecimal,
		endBlock: unsignedDecimal,
	},
	assetHub: {
		startBlock: unsignedDecimal,
		endBlock: unsignedDecimal,
	},
})

// Live public Sidecar returns nodeRoles as [{ full: null }] and peersInfo as either PeerInfo[] or an error string.
const sidecarNodeNetworkWire = arktype({
	'nodeRoles?': 'unknown',
	numPeers: unsignedDecimal,
	isSyncing: 'boolean',
	shouldHavePeers: 'boolean',
	'localPeerId?': 'string > 0',
	'localListenAddresses?': 'string[]',
	'peersInfo?': 'unknown',
})

const sidecarAccountStakingInfoWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	'rewardDestination?': 'string > 0',
	'controller?': 'string > 0',
	'numSlashingSpans?': arktype(unsignedDecimal).or('null'),
	'nominations?': 'unknown',
	'staking?': 'unknown',
})

const sidecarOngoingReferendumWire = arktype({
	id: arktype('string > 0').or('number.integer >= 0'),
	'submitted?': unsignedDecimal,
	'enactment?': arktype('string > 0').or({
		'at?': unsignedDecimal,
		'after?': unsignedDecimal,
	}),
	'deciding?': {
		'since?': unsignedDecimal,
		'confirming?': arktype(unsignedDecimal).or('null'),
	},
	'decisionDeposit?': {
		'who?': 'string > 0',
		'amount?': unsignedDecimal,
	},
})

const sidecarOngoingReferendaWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	referenda: sidecarOngoingReferendumWire.array(),
})

const sidecarTransactionMaterialWire = arktype({
	at: {
		hash: 'string > 0',
		height: unsignedDecimal,
	},
	genesisHash: 'string > 0',
	chainName: 'string > 0',
	specName: 'string > 0',
	specVersion: arktype('string > 0').or('number.integer >= 0'),
	txVersion: arktype('string > 0').or('number.integer >= 0'),
	'metadata?': 'string > 0',
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

const runtimeSpecNumber = (
	value: number | string
) => (
	typeof value === 'number' ?
		value
	:
		Number(value)
)

const optionalBooleanFlag = (
	value: boolean | string | undefined
) => (
	typeof value === 'boolean' ?
		value
	:
		undefined
)

const normalizeAccountAssetBalances = (
	response: ReturnType<typeof sidecarAccountAssetBalancesWire.assert>
): SidecarAccountAssetBalances => ({
	at: response.at,
	assets: response.assets.map((asset) => {
		const isFrozen = optionalBooleanFlag(asset.isFrozen)
		return {
			assetId: asset.assetId,
			balance: asset.balance,
			...(isFrozen != null && {
				isFrozen,
			}),
			...(asset.isSufficient != null && {
				isSufficient: asset.isSufficient,
			}),
		}
	}),
})

const normalizeAccountForeignAssetBalances = (
	response: ReturnType<typeof sidecarAccountForeignAssetBalancesWire.assert>
): SidecarAccountForeignAssetBalances => ({
	at: response.at,
	foreignAssets: response.foreignAssets.map((asset) => {
		const isFrozen = optionalBooleanFlag(asset.isFrozen)
		return {
			multiLocation: asset.multiLocation,
			balance: asset.balance,
			...(isFrozen != null && {
				isFrozen,
			}),
			...(asset.isSufficient != null && {
				isSufficient: asset.isSufficient,
			}),
		}
	}),
})

const decodeHexUtf8 = (
	value: string
) => {
	const hex = (
		value.startsWith('0x') || value.startsWith('0X') ?
			value.slice(2)
		:
			value
	)
	if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex))
		throw new Error(`${Source.SubstrateSidecar_Rest}: malformed asset metadata hex`)

	return new TextDecoder().decode(
		Uint8Array.from(
			Array.from(
				{
					length: hex.length / 2,
				},
				(_value, index) => (
					Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
				)
			)
		)
	)
}

const normalizeAssetInfo = (
	response: ReturnType<typeof sidecarAssetInfoWire.assert>
): SidecarAssetInfo => ({
	at: response.at,
	owner: response.assetInfo.owner,
	issuer: response.assetInfo.issuer,
	admin: response.assetInfo.admin,
	freezer: response.assetInfo.freezer,
	supply: response.assetInfo.supply,
	deposit: response.assetInfo.deposit,
	minBalance: response.assetInfo.minBalance,
	isSufficient: response.assetInfo.isSufficient,
	accounts: response.assetInfo.accounts,
	sufficients: response.assetInfo.sufficients,
	approvals: response.assetInfo.approvals,
	status: response.assetInfo.status,
	name: decodeHexUtf8(response.assetMetaData.name),
	symbol: decodeHexUtf8(response.assetMetaData.symbol),
	decimals: runtimeSpecNumber(response.assetMetaData.decimals),
	isFrozen: response.assetMetaData.isFrozen,
})

const accountQueryPath = (
	accountId: string,
	suffix: string,
	{
		at,
		assets,
	}: {
		at?: bigint | string
		assets?: (bigint | number | string)[]
	} = {}
) => {
	const params = new URLSearchParams()
	if (at != null)
		params.set('at', String(at))
	for (const assetId of assets ?? [])
		params.append('assets[]', String(assetId))
	const query = params.toString()
	return (
		`/accounts/${encodeURIComponent(accountId)}/${suffix}${
			query.length > 0 ?
				`?${query}`
			:
				''
		}`
	)
}

export const getBlock = async ({
	blockId,
	binding,
}: {
	blockId: bigint | string
	binding?: SourceBinding
}) => (
	assertEnvelope(
		'block',
		sidecarBlockWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks/${String(blockId)}`
		)
	) as SidecarBlock
)

export const getBlocks = async ({
	from,
	to,
	binding,
}: {
	from: bigint
	to: bigint
	binding?: SourceBinding
}) => {
	if (from < 0n || to < from)
		throw new Error(`${Source.SubstrateSidecar_Rest}: invalid block range`)

	return assertEnvelope(
		'blocks',
		sidecarBlockWire.array(),
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks?range=${from.toString()}-${to.toString()}`
		)
	) as SidecarBlock[]
}

export const getBlockHead = async ({
	finalized = true,
	binding,
}: {
	finalized?: boolean
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'block head',
		sidecarBlockWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks/head?finalized=${finalized ? 'true' : 'false'}`
		)
	) as SidecarBlock
)

export const getBlockHeader = async ({
	blockId,
	binding,
}: {
	blockId: bigint | string
	binding?: SourceBinding
}) => (
	assertEnvelope(
		'block header',
		sidecarBlockHeaderWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks/${String(blockId)}/header`
		)
	) as SidecarBlockHeader
)

export const getBlockHeadHeader = async ({
	finalized = true,
	binding,
}: {
	finalized?: boolean
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'block head header',
		sidecarBlockHeaderWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks/head/header?finalized=${finalized ? 'true' : 'false'}`
		)
	) as SidecarBlockHeader
)

export const getBlockExtrinsic = async ({
	blockId,
	extrinsicIndex,
	binding,
}: {
	blockId: bigint | string
	extrinsicIndex: number
	binding?: SourceBinding
}) => {
	if (!Number.isSafeInteger(extrinsicIndex) || extrinsicIndex < 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: extrinsic index must be a non-negative integer`)

	const response = assertEnvelope(
		'block extrinsic',
		sidecarBlockExtrinsicWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			`/blocks/${String(blockId)}/extrinsics/${extrinsicIndex}`
		)
	)
	return {
		at: response.at,
		extrinsic: response.extrinsics as SidecarExtrinsic,
	} satisfies SidecarBlockExtrinsic
}

export const getAccountBalanceInfo = async ({
	accountId,
	at,
	binding,
}: {
	accountId: string
	at?: bigint | string
	binding?: SourceBinding
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return assertEnvelope(
		'account balance info',
		sidecarAccountBalanceInfoWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			accountQueryPath(accountId, 'balance-info', {
				at,
			})
		)
	) as SidecarAccountBalanceInfo
}

export const getAccountAssetBalances = async ({
	accountId,
	at,
	assets,
	binding,
}: {
	accountId: string
	at?: bigint | string
	assets?: (bigint | number | string)[]
	binding?: SourceBinding
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return normalizeAccountAssetBalances(
		assertEnvelope(
			'account asset balances',
			sidecarAccountAssetBalancesWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				accountQueryPath(accountId, 'asset-balances', {
					at,
					assets,
				})
			)
		)
	)
}

export const getAccountForeignAssetBalances = async ({
	accountId,
	at,
	binding,
}: {
	accountId: string
	at?: bigint | string
	binding?: SourceBinding
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return normalizeAccountForeignAssetBalances(
		assertEnvelope(
			'account foreign asset balances',
			sidecarAccountForeignAssetBalancesWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				accountQueryPath(accountId, 'foreign-asset-balances', {
					at,
				})
			)
		)
	)
}

export const getAssetInfo = async ({
	assetId,
	at,
	binding,
}: {
	assetId: bigint | number | string
	at?: bigint | string
	binding?: SourceBinding
}) => {
	const params = new URLSearchParams()
	if (at != null)
		params.set('at', String(at))
	const query = params.toString()
	return normalizeAssetInfo(
		assertEnvelope(
			'asset info',
			sidecarAssetInfoWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				`/pallets/assets/${encodeURIComponent(String(assetId))}/asset-info${
					query.length > 0 ?
						`?${query}`
					:
						''
				}`
			)
		)
	)
}

export const getAhmInfo = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'asset hub migration info',
		sidecarAhmInfoWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/ahm-info'
		)
	) as SidecarAhmInfo
)

export const getRuntimeMetadata = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	runtimeMetadataPallets(
		assertEnvelope(
			'runtime metadata',
			sidecarRuntimeMetadataWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				'/runtime/metadata'
			)
		)
	)
)

export const getRuntimeSpec = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => {
	const response = assertEnvelope(
		'runtime spec',
		sidecarRuntimeSpecWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/runtime'
		)
	)
	return {
		at: response.at,
		specName: response.specName,
		...(response.implName != null && {
			implName: response.implName,
		}),
		authoringVersion: runtimeSpecNumber(response.authoringVersion),
		specVersion: runtimeSpecNumber(response.specVersion),
		...(response.implVersion != null && {
			implVersion: runtimeSpecNumber(response.implVersion),
		}),
		...(response.transactionVersion != null && {
			transactionVersion: runtimeSpecNumber(response.transactionVersion),
		}),
		...(response.stateVersion != null && {
			stateVersion: runtimeSpecNumber(response.stateVersion),
		}),
	} satisfies SidecarRuntimeSpec
}

export const getNodeVersion = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'node version',
		sidecarNodeVersionWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/node/version'
		)
	) as SidecarNodeVersion
)

export const getStakingValidators = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'staking validators',
		sidecarStakingValidatorsWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/pallets/staking/validators'
		)
	) as SidecarStakingValidators
)

export const getRcStakingValidators = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'relay staking validators',
		sidecarStakingValidatorsWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/rc/pallets/staking/validators'
		)
	) as SidecarStakingValidators
)

export const getNodeNetwork = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => (
	assertEnvelope(
		'node network',
		sidecarNodeNetworkWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/node/network'
		)
	) as SidecarNodeNetwork
)

export const getAccountStakingInfo = async ({
	accountId,
	at,
	binding,
}: {
	accountId: string
	at?: bigint | string
	binding?: SourceBinding
}) => {
	if (accountId.length === 0)
		throw new Error(`${Source.SubstrateSidecar_Rest}: account ID must not be empty`)

	return assertEnvelope(
		'account staking info',
		sidecarAccountStakingInfoWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			accountQueryPath(accountId, 'staking-info', {
				at,
			})
		)
	) as SidecarAccountStakingInfo
}

const normalizeOngoingReferenda = (
	response: ReturnType<typeof sidecarOngoingReferendaWire.assert>
): SidecarOngoingReferenda => ({
	at: response.at,
	referenda: response.referenda.map((referendum) => ({
		id: String(referendum.id),
		...(referendum.submitted != null && {
			submitted: referendum.submitted,
		}),
		...(referendum.enactment != null && {
			enactment: referendum.enactment,
		}),
		...(referendum.deciding != null && {
			deciding: referendum.deciding,
		}),
		...(referendum.decisionDeposit != null && {
			decisionDeposit: referendum.decisionDeposit,
		}),
	})),
})

export const getOngoingReferenda = async ({
	at,
	binding,
}: {
	at?: bigint | string
	binding?: SourceBinding
} = {}) => {
	const params = new URLSearchParams()
	if (at != null)
		params.set('at', String(at))
	const query = params.toString()
	return normalizeOngoingReferenda(
		assertEnvelope(
			'ongoing referenda',
			sidecarOngoingReferendaWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				`/pallets/on-going-referenda${
					query.length > 0 ?
						`?${query}`
					:
						''
				}`
			)
		)
	)
}

export const getRcOngoingReferenda = async ({
	at,
	binding,
}: {
	at?: bigint | string
	binding?: SourceBinding
} = {}) => {
	const params = new URLSearchParams()
	if (at != null)
		params.set('at', String(at))
	const query = params.toString()
	return normalizeOngoingReferenda(
		assertEnvelope(
			'relay ongoing referenda',
			sidecarOngoingReferendaWire,
			await getJson<unknown>(
				bindingOrDefault(binding),
				`/rc/pallets/on-going-referenda${
					query.length > 0 ?
						`?${query}`
					:
						''
				}`
			)
		)
	)
}

export const getTransactionMaterial = async ({
	binding,
}: {
	binding?: SourceBinding
} = {}) => {
	const response = assertEnvelope(
		'transaction material',
		sidecarTransactionMaterialWire,
		await getJson<unknown>(
			bindingOrDefault(binding),
			'/transaction/material'
		)
	)
	return {
		at: response.at,
		genesisHash: response.genesisHash,
		chainName: response.chainName,
		specName: response.specName,
		specVersion: String(response.specVersion),
		txVersion: String(response.txVersion),
		...(response.metadata != null && {
			metadata: response.metadata,
		}),
	} satisfies SidecarTransactionMaterial
}
