import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	isJsonNumber,
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'

export default {
	source: Source.XrplClio_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network) => {
						if (
							!(
								'slug' in network
								&& network.slug === networkBySlug.xrpl.slug
							)
							&& !(
								'caip2' in network
								&& network.caip2.namespace === networkBySlug.xrpl.caip2.namespace
								&& network.caip2.reference === networkBySlug.xrpl.caip2.reference
							)
						)
							throw new Error('XrplClio_JsonRpc: unsupported network')

						const { getClosedLedger } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const ledger = await getClosedLedger()
						if (
							!isJsonObject(ledger)
							|| !isJsonNumber(ledger.ledger_index)
							|| !Number.isSafeInteger(ledger.ledger_index)
							|| ledger.ledger_index < 0
							|| !isJsonString(ledger.ledger_hash)
							|| ledger.ledger_hash.length === 0
						)
							throw new Error('XrplClio_JsonRpc: malformed closed ledger')

						return [{
							[EntityMetaKey.Selector]: {
								$network: network,
								ledgerIndex: BigInt(ledger.ledger_index),
							},
						}]
					},
				},
			},
			resolveLive: {
				ledgerStream: {
					facetPath: [
						'Xrpl',
					],
					publishes: {
						'$$ledgers': true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						if (
							!(
								'slug' in parentEntitySelector
								&& parentEntitySelector.slug === networkBySlug.xrpl.slug
							)
							&& !(
								'caip2' in parentEntitySelector
								&& parentEntitySelector.caip2.namespace === networkBySlug.xrpl.caip2.namespace
								&& parentEntitySelector.caip2.reference === networkBySlug.xrpl.caip2.reference
							)
						)
							throw new Error('XrplClio_JsonRpc: unsupported network')

						const { streamLedger } = await import('$/sources/XrplClio/JsonRpc/queries.ts')

						for await (const message of streamLedger(signal)) {
							if (signal.aborted)
								return
							if (
								!isJsonNumber(message.ledger_index)
								|| !Number.isSafeInteger(message.ledger_index)
								|| message.ledger_index < 0
							)
								throw new Error('XrplClio_JsonRpc: malformed ledgerClosed ledger_index')
							if (!isJsonString(message.ledger_hash) || message.ledger_hash.length === 0)
								throw new Error('XrplClio_JsonRpc: malformed ledgerClosed ledger_hash')

							fields.$$ledgers.replaceRows([{
								source: Source.XrplClio_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector,
										ledgerIndex: BigInt(message.ledger_index),
									},
								}],
							}])
						}
					},
				},
			},
		})({
			Xrpl: {
				$$ledgers: (ledgers) => ledgers,
			},
		}),
	],
}
