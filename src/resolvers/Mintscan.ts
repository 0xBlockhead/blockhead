import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.cosmos.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === networkBySlug.cosmos.caip2.reference
		)
	)
		return

	throw new Error('Mintscan: unsupported network')
}

const cosmosNetworkReferenceApplicability = [
	{
		$network: {
			caip2: networkBySlug.cosmos.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.cosmos.slug,
		},
	},
] as const

const cosmosAccountTimestampApplicability = [
	{
		$account: cosmosNetworkReferenceApplicability[0],
		source: Source.Mintscan,
	},
	{
		$account: cosmosNetworkReferenceApplicability[1],
		source: Source.Mintscan,
	},
] as const

const accountBaseFields = (account: {
	address?: string
	account_number?: string
	sequence?: string
	base_account?: {
		address?: string
		account_number?: string
		sequence?: string
	}
	base_vesting_account?: {
		base_account?: {
			address?: string
			account_number?: string
			sequence?: string
		}
	}
}) => (
	account.base_account
	?? account.base_vesting_account?.base_account
	?? account
)

const assertAccountNumber = (accountNumber: string | undefined) => {
	if (
		accountNumber != null
		&& !/^(0|[1-9]\d*)$/.test(accountNumber)
	)
		throw new Error('Mintscan: invalid account number')
}

const assertAccountSequence = (sequence: string | undefined) => {
	if (
		sequence != null
		&& !/^(0|[1-9]\d*)$/.test(sequence)
	)
		throw new Error('Mintscan: invalid account sequence')
}

const cosmosAccountTimestampFields = (
	accountSelector: EntitySelector<typeof schema, EntityType.CosmosAccount>,
	account: Parameters<typeof accountBaseFields>[0] | undefined,
	timestampMs: number
) => {
	const baseAccount = account == null ? undefined : accountBaseFields(account)
	if (baseAccount == null)
		throw new Error('Mintscan: account response is missing')
	if (baseAccount.address !== accountSelector.address)
		throw new Error('Mintscan: account response does not match the subject')

	assertAccountNumber(baseAccount.account_number)
	assertAccountSequence(baseAccount.sequence)

	return {
		$account: {
			[EntityMetaKey.Selector]: accountSelector,
		},
		timestampMs,
		source: Source.Mintscan,
		...(baseAccount.account_number != null && {
			accountNumber: BigInt(baseAccount.account_number),
		}),
		...(baseAccount.sequence != null && {
			sequence: BigInt(baseAccount.sequence),
		}),
	}
}

export default {
	source: Source.Mintscan,

	resolvers: [
		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: [
						...cosmosNetworkReferenceApplicability,
					],
					resolve: async (accountSelector, context) => {
						assertCosmosHub(accountSelector.$network)

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/Mintscan/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
								address: accountSelector.address,
							}),
							getLatestBlock(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
						])

						const timestampMs = Date.parse(latestBlock.block.header.time)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Mintscan: latest block has an invalid timestamp')

						const timestamp = cosmosAccountTimestampFields(
							accountSelector,
							account,
							timestampMs
						)
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: accountSelector,
									timestampMs: timestamp.timestampMs,
									source: timestamp.source,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: timestamp.$account,
									...(timestamp.accountNumber != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: timestamp.accountNumber,
									}),
									...(timestamp.sequence != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: timestamp.sequence,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CosmosAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					appliesTo: [
						...cosmosAccountTimestampApplicability,
					],
					resolve: async ({
						$account,
						timestampMs,
						source,
					}, context) => {
						assertCosmosHub($account.$network)
						if (source !== Source.Mintscan)
							throw new Error(`Mintscan: unsupported account timestamp source ${source}`)

						const { getAccount } = await import('$/sources/Mintscan/Rest/queries.ts')
						const { account } = await getAccount(context.publicEnv, {
							network: networkBySlug.cosmos.slug,
							address: $account.address,
						})
						return cosmosAccountTimestampFields(
							$account,
							account,
							timestampMs
						)
					},
				},
			},
		})({
			$account: (account) => account.$account,
			timestampMs: (account) => account.timestampMs,
			source: (account) => account.source,
			accountNumber: (account) => account.accountNumber,
			sequence: (account) => account.sequence,
		}),

		defineResolver({
			entityType: EntityType.CosmosBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: [
						...cosmosNetworkReferenceApplicability,
					],
					resolve: async ({
						$network,
						height,
					}, context) => {
						assertCosmosHub($network)

						const { getBlock } = await import('$/sources/Mintscan/Rest/queries.ts')
						const wireBlock = await getBlock(context.publicEnv, {
							network: networkBySlug.cosmos.slug,
							height,
						})
						if (BigInt(wireBlock.block.header.height) !== height)
							throw new Error('Mintscan: block response does not match the subject height')

						const timestampMs = Date.parse(wireBlock.block.header.time)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Mintscan: block has an invalid timestamp')

						return {
							hash: wireBlock.block_id.hash,
							proposerConsensusAddress: wireBlock.block.header.proposer_address,
							timestampMs,
							transactionCount: wireBlock.block.data.txs?.length ?? 0,
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			proposerConsensusAddress: (block) => block.proposerConsensusAddress,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
		}),
	],
} satisfies RegisteredSourceResolverModule
