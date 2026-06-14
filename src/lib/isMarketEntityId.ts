import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'

const legShapeOk = (leg: unknown) => (
	leg != null
	&& typeof leg === 'object'
	&& 'kind' in leg
	&& (
		(leg as { kind: unknown }).kind === MarketAssetKind.Coin
		|| (leg as { kind: unknown }).kind === MarketAssetKind.CoinInstance
		|| (leg as { kind: unknown }).kind === MarketAssetKind.Currency
	)
)

/**
 * Runtime guard for `Market.id` objects (e.g. from field `Value` before collection merge completes).
 */
export const isMarketEntitySelector = (
	v: unknown,
): v is EntitySelector<typeof schema, EntityType.Market> => (
	v !== undefined
	&& typeof v === 'object'
	&& v !== null
	&& '$base' in v
	&& '$quote' in v
	&& '$marketVenue' in v
	&& 'marketKind' in v
	&& Object.values(MarketKind).includes((v as { marketKind: MarketKind }).marketKind)
	&& legShapeOk((v as { $base: unknown }).$base)
	&& legShapeOk((v as { $quote: unknown }).$quote)
)
