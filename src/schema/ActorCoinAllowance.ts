import { type } from 'arktype'
import Actor from '$/schema/Actor.ts'
import ActorCoin from '$/schema/ActorCoin.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

// On-chain ERC-20 allowance (owner × token contract × spender). Voltaire reads allowance via eth_call when the composite id is known; discovery/list fields are not indexed yet.

export default {
	entityType: EntityType.ActorCoinAllowance,

	label: 'Coin Allowance',
	labelPlural: 'Coin Allowances',

	id: type({
		$actorCoin: ActorCoin.id,
		$spender: Actor.id,
		'interopAddress?': 'string',
	}),

	fields: [
		{
			name: 'allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'lastChecked',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$spenderContract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export const toActorCoinAllowanceEntityId = (
	chainId: number,
	address: `0x${string}`,
	tokenContract: `0x${string}`,
	spenderAddress: `0x${string}`,
): EntityId<typeof schema, EntityType.ActorCoinAllowance> => ({
	$actorCoin: {
			$actor: { address },
			$coinInstance: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
				type: CoinInstanceType.Erc20Token,
				$contract: { $network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } }, address: tokenContract },
			},
		},
	$spender: { address: spenderAddress },
})
