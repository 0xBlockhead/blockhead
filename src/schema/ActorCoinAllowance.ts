import { type } from 'arktype'
import Actor from '$/schema/Actor.ts'
import ActorCoin from '$/schema/ActorCoin.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.ActorCoinAllowance,

	label: 'Coin Allowance',

	id: type({
		$actorCoin: ActorCoin.id,
		$spender: Actor.id,
		'interopAddress?': 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export const toActorCoinAllowanceEntityId = (
	chainId: number,
	address: `0x${string}`,
	tokenContract: `0x${string}`,
	spenderAddress: `0x${string}`,
): EntityId<EntityType.ActorCoinAllowance> => ({
	$actorCoin: {
		$actor: { $network: { chainId }, address },
		$coinInstance: {
			$network: { chainId },
			type: CoinInstanceType.Erc20Token,
			$contract: { $network: { chainId }, address: tokenContract },
		},
	},
	$spender: { $network: { chainId }, address: spenderAddress },
})
