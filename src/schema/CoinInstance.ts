import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'
import Network from '$/schema/Network.ts'

export enum CoinInstanceType {
	NativeCurrency = 'NativeCurrency',
	Erc20Token = 'Erc20Token',
}

export default {
	entityType: EntityType.CoinInstance,

	label: 'Coin Instance',

	id: type.or(
		type({
			$network: Network.id,
			type: type.unit(CoinInstanceType.NativeCurrency),
		}),
		type({
			$network: Network.id,
			type: type.unit(CoinInstanceType.Erc20Token),
			$contract: EvmContract.id,
		}),
	),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
