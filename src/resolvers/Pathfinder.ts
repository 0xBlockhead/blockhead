import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	BlockId,
	Event,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>
type StarknetContractIdentity = EntitySelector<typeof schema, EntityType.StarknetContract>

const starknetNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.starknet.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.starknet.slug,
		},
	},
] as const

const starknetContractApplicability = [
	{
		$network: starknetNetworkApplicability[0],
	},
	{
		$network: starknetNetworkApplicability[1],
	},
] as const

const assertStarknetMainnet = (network: NetworkIdentity) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.starknet.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference
		)
	)
		return

	throw new Error('Pathfinder: unsupported network')
}

const validatedFelt = (
	value: string,
	fieldName: string
) => {
	if (!/^0x[\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Pathfinder: malformed ${fieldName}`)

	return value
}

const validatedBlockNumber = (
	value: number,
	fieldName: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Pathfinder: malformed ${fieldName}`)

	return value
}

const resolveAccountState = async (
	contract: StarknetContractIdentity,
	blockNumber: number
) => {
	assertStarknetMainnet(contract.$network.$network)
	const address = validatedFelt(contract.address, 'contract address')
	const blockId = {
		block_number: validatedBlockNumber(blockNumber, 'block number'),
	} satisfies BlockId
	const { default: {
		getClassHashAt,
		getNonce,
	} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
	const [nonce, classHash] = await Promise.all([
		getNonce(blockId, address),
		getClassHashAt(blockId, address),
	])

	return {
		nonce: validatedFelt(nonce, 'account nonce'),
		classHash: validatedFelt(classHash, 'class hash'),
		found: true,
	}
}

const eventFields = (
	event: Event,
	contract: StarknetContractIdentity
) => {
	if (
		BigInt(validatedFelt(event.from_address, 'event contract address'))
		!== BigInt(validatedFelt(contract.address, 'contract address'))
	)
		throw new Error('Pathfinder: event response does not match the contract')
	validatedBlockNumber(event.transaction_index, 'event transaction index')
	validatedBlockNumber(event.event_index, 'event index')
	if (event.block_number != null)
		validatedBlockNumber(event.block_number, 'event block number')
	if (event.block_hash != null)
		validatedFelt(event.block_hash, 'event block hash')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network: contract.$network,
				transactionHash: validatedFelt(event.transaction_hash, 'event transaction hash'),
			},
			eventIndex: event.event_index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
				[EntityMetaKey.Selector]: contract,
			},
			[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: event.keys.map((key) => (
				validatedFelt(key, 'event key')
			)),
			[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: event.data.map((value) => (
				validatedFelt(value, 'event data')
			)),
		},
	}
}

const eventContinuation = (
	continuationToken: string | undefined,
	contract: StarknetContractIdentity
): ProviderContinuation => {
	if (continuationToken == null)
		return {
			operation: 'contract-events',
			target: contract.address,
			terminal: true,
		}
	if (continuationToken.length === 0)
		throw new Error('Pathfinder: malformed event continuation token')

	return {
		operation: 'contract-events',
		target: contract.address,
		terminal: false,
		token: continuationToken,
	}
}

export default {
	source: Source.Pathfinder,

	resolvers: [
		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract) => {
						assertStarknetMainnet(contract.$network.$network)
						validatedFelt(contract.address, 'contract address')
						const { default: { getBlockHashAndNumber } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const head = await getBlockHashAndNumber()
						validatedFelt(head.block_hash, 'block hash')
						const blockNumber = validatedBlockNumber(head.block_number, 'block number')

						return {
							blockNumber,
							state: await resolveAccountState(contract, blockNumber),
						}
					},
				},
			},
		})({
			$$accountStates: (snapshot, contract) => [{
				[EntityMetaKey.Selector]: {
					$contract: contract,
					blockNumber: BigInt(snapshot.blockNumber),
					source: Source.Pathfinder,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: snapshot.state.nonce,
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: snapshot.state.classHash,
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: snapshot.state.found,
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.StarknetAccount_Timestamp,
			resolve: {
				ContractBlockNumberSource: {
					appliesTo: [
						{
							$contract: starknetContractApplicability[0],
							source: Source.Pathfinder,
						},
						{
							$contract: starknetContractApplicability[1],
							source: Source.Pathfinder,
						},
					],
					resolve: async ({
						$contract,
						blockNumber,
						source,
					}) => {
						if (source !== Source.Pathfinder)
							throw new Error('Pathfinder: account observation source does not match')
						if (blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Pathfinder: account observation block number is too large')

						return resolveAccountState($contract, Number(blockNumber))
					},
				},
			},
		})({
			nonce: (state) => state.nonce,
			classHash: (state) => state.classHash,
			found: (state) => state.found,
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract, context) => {
						assertStarknetMainnet(contract.$network.$network)
						const address = validatedFelt(contract.address, 'contract address')
						const { default: { getEvents } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')

						return getEvents({
							address,
							chunk_size: resolverContextRowLimit(context),
							...(context.providerContinuationToken != null && {
								continuation_token: context.providerContinuationToken,
							}),
						})
					},
				},
			},
		})({
			$$events: {
				select: (chunk, contract) => chunk.events.map((event) => eventFields(event, contract)),
				continuation: (chunk, contract) => eventContinuation(
					chunk.continuation_token,
					contract
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
