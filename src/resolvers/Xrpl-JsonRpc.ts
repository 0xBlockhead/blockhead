import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const xrplRippledBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Xrpl_Rippled)

if (xrplRippledBinding == null)
	throw new Error('Xrpl_Rippled: source binding is missing')

export default {
	source: Source.Xrpl_Rippled,

	resolvers: [
		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					if (network.slug !== 'xrpl')
						throw new Error('Xrpl_Rippled: unsupported network')

					const { getValidatedLedger } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
					const ledger = await getValidatedLedger(xrplRippledBinding)
					if (!ledger.validated)
						throw new Error('Xrpl_Rippled: ledger is not validated')
					if (!Number.isSafeInteger(ledger.ledger_index) || ledger.ledger_index < 0)
						throw new Error('Xrpl_Rippled: malformed validated ledger index')
					if (ledger.ledger_hash.length === 0)
						throw new Error('Xrpl_Rippled: malformed validated ledger hash')

					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								ledgerIndex: BigInt(ledger.ledger_index),
							},
						},
					]
				},
			},
		})({
			Xrpl: {
				$$ledgers: (ledgers) => ledgers,
			},
		}),
	],
}
