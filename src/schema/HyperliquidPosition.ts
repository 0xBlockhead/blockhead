// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidPosition,
	labels: { singular: 'hyperliquid position', plural: 'hyperliquid positions' },
})({
	$account: { entityType: EntityType.HyperliquidAccount, cardinality: EntityFieldCardinality.One },
	coin: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	size: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	entryPrice: { primitiveType: type('string'), cardinality: EntityFieldCardinality.ZeroOrOne },
	positionValue: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	unrealizedPnl: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	returnOnEquity: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	liquidationPrice: { primitiveType: type('string'), cardinality: EntityFieldCardinality.ZeroOrOne },
	marginUsed: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	maxLeverage: { primitiveType: type('number'), cardinality: EntityFieldCardinality.One },
	cumulativeFundingAllTime: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	cumulativeFundingSinceChange: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	cumulativeFundingSinceOpen: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	leverageRawUsd: { primitiveType: type('string'), cardinality: EntityFieldCardinality.One },
	leverageType: { primitiveType: type.enumerated('cross', 'isolated'), cardinality: EntityFieldCardinality.One },
	leverageValue: { primitiveType: type('number'), cardinality: EntityFieldCardinality.One },
})({ selectors: { AccountCoin: ['$account', 'coin'] } })
