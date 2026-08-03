import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hyperliquidEvmResolvers } from '$/resolvers/HyperliquidEvm.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { hyperliquidJsonRpcEndpoints } from '$/sources/Hyperliquid/JsonRpc/queries.ts'
import { hyperliquidRestEndpoints } from '$/sources/Hyperliquid/Rest/queries.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid Info: unsupported network')
}

const assertHyperliquidAddress = (address: string) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address))
		throw new Error(`Hyperliquid Info: invalid account address ${address}`)
}

const assertSafeWireInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Hyperliquid Info: invalid ${label} ${String(value)}`)

	return BigInt(value)
}

const resolveHyperliquidNetworkMetadata = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const {
		getMeta,
		getSpotMeta,
		getValidatorSummaries,
	} = await import('$/sources/Hyperliquid/Rest/queries.ts')
	const [
		perpMeta,
		spotMeta,
		validators,
	] = await Promise.all([
		getMeta(),
		getSpotMeta(),
		getValidatorSummaries(),
	])
	return {
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.now(),
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'perpMarketCount')]: perpMeta.universe.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotAssetCount')]: spotMeta.tokens.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotPairCount')]: spotMeta.universe.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'validatorCount')]: validators.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'activeValidatorCount')]: validators.filter((validator) => validator.isActive).length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'jailedValidatorCount')]: validators.filter((validator) => validator.isJailed).length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'totalStake')]: validators.reduce(
					(totalStake, validator) => totalStake + BigInt(validator.stake),
					0n
				),
			},
		}],
		$$validators: validators
			.slice(0, limit)
			.map((validator) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					validator: validator.validator,
				},
			})),
		$$perpMarkets: perpMeta.universe
			.slice(0, limit)
			.map((market) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					coin: market.name,
				},
			})),
		$$spotAssets: spotMeta.tokens
			.slice(0, limit)
			.map((token) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					assetId: token.index,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'name')]: token.name,
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'szDecimals')]: token.szDecimals,
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'weiDecimals')]: token.weiDecimals,
					...(token.tokenId != null && {
						[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'tokenId')]: token.tokenId,
					}),
				},
			})),
	}
}

export default {
	source: Source.Hyperliquid,

	resolvers: [
		...hyperliquidEvmResolvers,

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertHyperliquidMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: hyperliquidJsonRpcEndpoints,
							restEndpoints: hyperliquidRestEndpoints,
						}
					},
				}
			},
		})({
			$network: (snapshot) => snapshot.$network,
			rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
			restEndpoints: (snapshot) => snapshot.restEndpoints,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const { getUserVaultEquities } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const equities = await getUserVaultEquities({
							user: account.address,
						})
						const vaultAddresses = new Set<string>()
						for (const equity of equities) {
							assertHyperliquidAddress(equity.vaultAddress)
							if (vaultAddresses.has(equity.vaultAddress.toLowerCase()))
								throw new Error(`Hyperliquid Info: duplicate vault equity ${equity.vaultAddress}`)

							vaultAddresses.add(equity.vaultAddress.toLowerCase())
						}

						return {
							equities: equities.slice(0, resolverContextRowLimit(context)),
							timestampMs: Date.now(),
						}
					},
				},
			},
		})({
			$$vaultEquities: (snapshot, account) => snapshot.equities.map((equity) => ({
				[EntityMetaKey.Selector]: {
					$account: account,
					$vault: {
						$network: account.$network,
						vaultAddress: equity.vaultAddress,
					},
					timestampMs: snapshot.timestampMs,
					source: Source.Hyperliquid,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'equity')]: equity.equity,
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertHyperliquidMainnet(network)
						return {
							Hyperliquid: {
								rpcEndpoints: hyperliquidJsonRpcEndpoints,
								restEndpoints: hyperliquidRestEndpoints,
							},
						}
					},
				}
			},
		})({
			Hyperliquid: {
				rpcEndpoints: (snapshot) => snapshot.Hyperliquid.rpcEndpoints,
				restEndpoints: (snapshot) => snapshot.Hyperliquid.restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: {
				NetworkCoin: {
					resolve: async (entitySelector) => {
						const { $network } = entitySelector
						assertHyperliquidMainnet($network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$perpMarket: entitySelector,
									timestampMs: Date.now(),
									source: Source.Hyperliquid,
								},
							},
						]
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidPerpMarket_Timestamp,
			resolve: {
				PerpMarketTimestampMsSource: {
					resolve: async ({ $perpMarket }) => {
						assertHyperliquidMainnet($perpMarket.$network)
						const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const perpMarket = (await getMeta()).universe
							.find((market) => market.name === $perpMarket.coin)
						if (perpMarket == null)
							throw new Error(`Hyperliquid Info: perp market not found for ${$perpMarket.coin}`)
						return {
							maxLeverage: perpMarket.maxLeverage,
							...(perpMarket.onlyIsolated != null && {
								onlyIsolated: perpMarket.onlyIsolated,
							}),
						}
					},
				}
			},
		})({
			maxLeverage: (snapshot) => snapshot.maxLeverage,
			onlyIsolated: (snapshot) => snapshot.onlyIsolated,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: {
				NetworkAssetId: {
					resolve: async ({ $network, assetId }) => {
						assertHyperliquidMainnet($network)
						const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const spotToken = (await getSpotMeta()).tokens
							.find((token) => token.index === assetId)
						if (spotToken == null)
							throw new Error(`Hyperliquid Info: spot asset not found for ${String(assetId)}`)
						return {
							name: spotToken.name,
							szDecimals: spotToken.szDecimals,
							weiDecimals: spotToken.weiDecimals,
							...(spotToken.tokenId != null && {
								tokenId: spotToken.tokenId,
							}),
						}
					},
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			szDecimals: (snapshot) => snapshot.szDecimals,
			weiDecimals: (snapshot) => snapshot.weiDecimals,
			tokenId: (snapshot) => snapshot.tokenId,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertHyperliquidMainnet($network)
						assertHyperliquidAddress(address)
						const {
							getClearinghouseState,
							getSpotClearinghouseState,
							getUserRole,
						} = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const [
							userRoleWire,
							clearinghouseState,
							spotClearinghouseState,
						] = await Promise.all([
							getUserRole({
								user: address,
							}),
							getClearinghouseState({
								user: address,
							}),
							getSpotClearinghouseState({
								user: address,
							}),
						])
						if (!Number.isSafeInteger(clearinghouseState.time) || clearinghouseState.time < 0)
							throw new Error(`Hyperliquid Info: invalid account state time ${String(clearinghouseState.time)}`)

						if (userRoleWire.role === 'agent')
							assertHyperliquidAddress(userRoleWire.data.user)

						if (userRoleWire.role === 'subAccount')
							assertHyperliquidAddress(userRoleWire.data.master)

						return {
							accountRole: userRoleWire.role,
							...(userRoleWire.role === 'agent' && {
								$masterAccount: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: userRoleWire.data.user,
									},
								},
							}),
							...(userRoleWire.role === 'subAccount' && {
								$masterAccount: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: userRoleWire.data.master,
									},
								},
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: {
										$network,
										address,
									},
									timestampMs: clearinghouseState.time,
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'accountValue')]: clearinghouseState.marginSummary.accountValue,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalNtlPos')]: clearinghouseState.marginSummary.totalNtlPos,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalRawUsd')]: clearinghouseState.marginSummary.totalRawUsd,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalMarginUsed')]: clearinghouseState.marginSummary.totalMarginUsed,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'withdrawable')]: clearinghouseState.withdrawable,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'crossMaintenanceMarginUsed')]: clearinghouseState.crossMaintenanceMarginUsed,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'assetPositions')]: clearinghouseState.assetPositions,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'spotBalances')]: spotClearinghouseState.balances,
								},
							}],
						}
					},
				}
			},
		})({
			accountRole: (snapshot) => snapshot.accountRole,
			$masterAccount: (snapshot) => snapshot.$masterAccount,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const limit = resolverContextRowLimit(context)
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Hyperliquid Info: invalid order continuation')

						const { getHistoricalOrders } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const orders = (await getHistoricalOrders({
							user: account.address,
						})).toSorted((left, right) => (
							right.statusTimestamp - left.statusTimestamp
							|| right.order.timestamp - left.order.timestamp
							|| right.order.oid - left.order.oid
						))
						const orderIds = new Set<number>()
						for (const historicalOrder of orders) {
							assertSafeWireInteger(historicalOrder.order.oid, 'order id')
							assertSafeWireInteger(historicalOrder.order.timestamp, 'order timestamp')
							assertSafeWireInteger(historicalOrder.statusTimestamp, 'order status timestamp')
							if (orderIds.has(historicalOrder.order.oid))
								throw new Error(`Hyperliquid Info: duplicate historical order ${String(historicalOrder.order.oid)}`)

							orderIds.add(historicalOrder.order.oid)
						}

						return {
							limit,
							offset,
							orders: orders.slice(offset, offset + limit),
							terminal: offset + limit >= orders.length,
						}
					},
				},
			},
		})({
			$$orders: {
				select: (page, account) => page.orders.map(({ order, status, statusTimestamp }) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						oid: assertSafeWireInteger(order.oid, 'order id'),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'coin')]: order.coin,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'side')]: order.side,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'orderType')]: order.orderType,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'limitPrice')]: order.limitPx,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'originalSize')]: order.origSz,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'triggerCondition')]: order.triggerCondition,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'triggerPrice')]: order.triggerPx,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'reduceOnly')]: order.reduceOnly,
						...(order.tif != null && {
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'tif')]: order.tif,
						}),
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'isTrigger')]: order.isTrigger,
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'isPositionTpsl')]: order.isPositionTpsl,
						...(order.cloid != null && {
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'cloid')]: order.cloid,
						}),
						[entityFieldAddressKey(EntityType.HyperliquidOrder, [], '$$timestamps')]: [{
							[EntityMetaKey.Selector]: {
								$order: {
									$account: account,
									oid: assertSafeWireInteger(order.oid, 'order id'),
								},
								timestampMs: statusTimestamp,
								source: Source.Hyperliquid,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: status,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: statusTimestamp,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: order.sz,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: order.children,
							},
						}],
					},
				})),
				continuation: (page, account) => (
					page.terminal ?
						{
							operation: 'historical-orders',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'historical-orders',
							target: account.address,
							terminal: false,
							token: String(page.offset + page.limit),
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const limit = resolverContextRowLimit(context)
						const [
							cursorTime,
							cursorTid,
						] = context.providerContinuationToken == null ?
							[0, -1]
						:
							context.providerContinuationToken.split(':').map(Number)
						if (
							!Number.isSafeInteger(cursorTime)
							|| cursorTime < 0
							|| !Number.isSafeInteger(cursorTid)
							|| cursorTid < -1
						)
							throw new Error('Hyperliquid Info: invalid fill continuation')

						const { getUserFillsByTime } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const response = await getUserFillsByTime({
							user: account.address,
							startTime: cursorTime,
						})
						const fillIds = new Set<number>()
						for (const fill of response) {
							assertSafeWireInteger(fill.tid, 'fill trade id')
							assertSafeWireInteger(fill.oid, 'fill order id')
							assertSafeWireInteger(fill.time, 'fill timestamp')
							if (fillIds.has(fill.tid))
								throw new Error(`Hyperliquid Info: duplicate fill trade id ${String(fill.tid)}`)

							fillIds.add(fill.tid)
						}

						const fills = response
							.filter((fill) => (
								fill.time > cursorTime
								|| (fill.time === cursorTime && fill.tid > cursorTid)
							))
							.toSorted((left, right) => left.time - right.time || left.tid - right.tid)
						return {
							fills: fills.slice(0, limit),
							terminal: response.length < 2_000 && fills.length <= limit,
						}
					},
				},
			},
		})({
			$$fills: {
				select: (page, account) => page.fills.map((fill) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						tid: assertSafeWireInteger(fill.tid, 'fill trade id'),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'oid')]: assertSafeWireInteger(fill.oid, 'fill order id'),
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'coin')]: fill.coin,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'side')]: fill.side,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'direction')]: fill.dir,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'price')]: fill.px,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'size')]: fill.sz,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'startPosition')]: fill.startPosition,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'closedPnl')]: fill.closedPnl,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'fee')]: fill.fee,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'feeToken')]: fill.feeToken,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'timeMs')]: fill.time,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'hash')]: fill.hash,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'crossed')]: fill.crossed,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], '$order')]: {
							[EntityMetaKey.Selector]: {
								$account: account,
								oid: assertSafeWireInteger(fill.oid, 'fill order id'),
							},
						},
						...(fill.hash !== `0x${'0'.repeat(64)}` && {
							[entityFieldAddressKey(EntityType.HyperliquidFill, [], '$transaction')]: {
								[EntityMetaKey.Selector]: {
									$network: account.$network,
									txHash: fill.hash,
								},
							},
						}),
					},
				})),
				continuation: (page, account) => {
					const lastFill = page.fills.at(-1)
					return (
						page.terminal || lastFill == null ?
							{
								operation: 'user-fills-by-time',
								target: account.address,
								terminal: true,
							}
						:
							{
								operation: 'user-fills-by-time',
								target: account.address,
								terminal: false,
								token: `${String(lastFill.time)}:${String(lastFill.tid)}`,
							}
					)
				},
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidValidator,
			resolve: {
				NetworkValidator: {
					resolve: async (entitySelector) => {
						const { $network } = entitySelector
						assertHyperliquidMainnet($network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$validator: entitySelector,
									timestampMs: Date.now(),
									source: Source.Hyperliquid,
								},
							},
						]
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidValidator_Timestamp,
			resolve: {
				ValidatorTimestampMsSource: {
					resolve: async ({ $validator }) => {
						assertHyperliquidMainnet($validator.$network)
						const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const validator = (await getValidatorSummaries())
							.find((summary) => summary.validator.toLowerCase() === $validator.validator.toLowerCase())
						if (validator == null) throw new Error(`Hyperliquid Info: validator not found for ${$validator.validator}`)
						return {
							name: validator.name,
							signerAddress: validator.signer,
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: $validator.$network,
									address: validator.signer,
								},
							},
							commission: validator.commission,
							recentBlockCount: validator.nRecentBlocks,
							stake: BigInt(validator.stake),
							isActive: validator.isActive,
							isJailed: validator.isJailed,
						}
					},
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			signerAddress: (snapshot) => snapshot.signerAddress,
			$signer: (snapshot) => snapshot.$signer,
			commission: (snapshot) => snapshot.commission,
			recentBlockCount: (snapshot) => snapshot.recentBlockCount,
			stake: (snapshot) => snapshot.stake,
			isActive: (snapshot) => snapshot.isActive,
			isJailed: (snapshot) => snapshot.isJailed,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: ({ $network }, context) => resolveHyperliquidNetworkMetadata(
						$network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$validators: (snapshot) => snapshot.$$validators,
			$$perpMarkets: (snapshot) => snapshot.$$perpMarkets,
			$$spotAssets: (snapshot) => snapshot.$$spotAssets,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: (network, context) => resolveHyperliquidNetworkMetadata(
						network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			Hyperliquid: {
				$$timestamps: (snapshot) => snapshot.$$timestamps,
				$$validators: (snapshot) => snapshot.$$validators,
				$$perpMarkets: (snapshot) => snapshot.$$perpMarkets,
				$$spotAssets: (snapshot) => snapshot.$$spotAssets,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
