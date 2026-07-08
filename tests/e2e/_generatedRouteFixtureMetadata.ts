// Generated from APP.ts. Do not edit by hand.

export type E2eRouteProjectionCondition =
	| { readonly path: readonly (string | number)[], readonly is: string | number | boolean | null }
	| { readonly path: readonly (string | number)[], readonly isOneOf: readonly (string | number | boolean | null)[] }
	| { readonly path: readonly (string | number)[], readonly includes: string | number | boolean | null }
	| { readonly all: readonly E2eRouteProjectionCondition[] }

export type E2eRouteFixtureMetadata = {
	id?: string
	label?: string
	routeKind?: string
	fixture?: Readonly<Partial<Record<string, string>>>
	variants?: readonly Readonly<Partial<Record<string, string>>>[]
	requiredProjections?: readonly (readonly string[])[]
	requiredProjectionConditions?: readonly E2eRouteProjectionCondition[]
	boundaryLiveOptional?: true
}

export const e2eRouteFixtureMetadataByRouteId = {
	'/[test=test]': {},
	'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]': {},
	'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]': {},
	'/~/accounts/connections/connection/[walletId]': {},
	'/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]': {},
	'/~/agents/conversation/[conversationId]': {},
	'/~/agents/conversation/[conversationId]/turn/[turnId]': {},
	'/~/dashboard/[dashboardId]': {},
	'/~/manage/source/[sourceId]': {},
	'/~/multiplayer/contact/[contactId]': {},
	'/~/multiplayer/room/[roomId]': {},
	'/~/session/[sessionId]': {},
	'/account/[address=evmAddress]': {},
	'/activitypub/actor/[instanceOrigin]/[localAccountId]': {},
	'/activitypub/actor/[instanceOrigin]/[localAccountId]/notes': {},
	'/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/activitypub/note/[instanceOrigin]/[localStatusId]': {},
	'/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/activitypub/note/[instanceOrigin]/[localStatusId]/thread': {},
	'/atproto/actor/[did]': {},
	'/atproto/actor/[did]/observations': {},
	'/atproto/actor/[did]/observations/[timestampMs=nonNegativeInteger]': {},
	'/atproto/actor/[did]/posts': {},
	'/atproto/actor/handle/[handle]': {},
	'/atproto/post/[...uri]': {},
	'/atproto/post/[...uri]/observations': {},
	'/atproto/post/[...uri]/observations/[timestampMs=nonNegativeInteger]': {},
	'/atproto/post/[...uri]/thread': {},
	'/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug]/[toChainId=eip155ChainId]/[toCoinInstanceSlug]/[toolKey]': {},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]': {},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex=bridgeRouteStepIndex]': {},
	'/channel/[channelId]': {},
	'/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]': {},
	'/coin/[coinId]': {},
	'/coin/[coinId]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/currency/[iso4217=iso4217]': {},
	'/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]': {
		id: 'Currency_Timestamp.CurrencyTimestampMs',
		fixture: {
			timestampMs: '1735689600000',
		},
		variants: [
			{
				timestampMs: '1735689600000',
			},
		],
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/ens/name/[ensName]': {},
	'/ens/name/[ensName]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/ens/name/[ensName]/record/[recordId]': {},
	'/ens/name/[ensName]/record/[recordId]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/ens/name/[ensName]/records': {},
	'/ens/name/[ensName]/resolver': {},
	'/ens/name/[ensName]/resolves-to': {},
	'/ens/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/evm/calldata/[hex]': {},
	'/evm/error/[hex]': {},
	'/evm/error/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/evm/selector/[hex]': {},
	'/evm/selector/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/evm/topic/[hex]': {},
	'/evm/topic/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/farcaster/account/[accountId]': {},
	'/farcaster/c/[fname]/[hash]': {},
	'/farcaster/cast/[fid=farcasterFid]/[hash]': {},
	'/farcaster/cast/[fid=farcasterFid]/[hash]/embed/[indexInCast=nonNegativeInteger]': {},
	'/farcaster/cast/[fid=farcasterFid]/[hash]/observations/[timestampMs=nonNegativeInteger]': {},
	'/farcaster/channel/[channelId]': {},
	'/farcaster/channel/[channelId]/casts': {},
	'/farcaster/channel/[channelId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/farcaster/feed/channel/[channelId]': {},
	'/farcaster/feed/following/[userId=farcasterFid]': {},
	'/farcaster/feed/user/[userId=farcasterFid]': {},
	'/farcaster/user/[userId=farcasterFid]': {},
	'/farcaster/user/[userId=farcasterFid]/casts': {},
	'/farcaster/user/[userId=farcasterFid]/observations/[timestampMs=nonNegativeInteger]': {},
	'/farcaster/user/[userId=farcasterFid]/verified-address/[protocol]/[address]': {},
	'/ipfs/[namespace]/[target]': {},
	'/ipfs/[namespace]/[target]/path/[...contentPath]': {},
	'/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/lens/account/[address=evmAddress]': {},
	'/lens/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]': {},
	'/lens/account/[address=evmAddress]/posts': {},
	'/lens/post/[postId]': {},
	'/lens/post/[postId]/comments': {},
	'/lens/post/[postId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/market-venue/[marketVenueId=marketVenueId]': {},
	'/media/[url]': {},
	'/network-stack/[networkStackId]': {},
	'/network/[caip2=eip155NetworkCaip2]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/account/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/asset/[kind]/[assetKey]': {
		id: 'Network.Evm.AssetInstance',
		fixture: {
			kind: 'Native',
			assetKey: 'ETH',
		},
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/attestations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
			transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
			indexInTransaction: '0',
		},
		variants: [
			{
				caip2: 'eip155:1',
				transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
				indexInTransaction: '0',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/blobs': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/block-explorers': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/block/[blockNumber=evmBlockNumber]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/block/[blockNumber=evmBlockNumber]/transactions': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/blocks': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/bridges': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/bridges/[toCaip2=eip155NetworkCaip2]/[url]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/committees': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/consensus/[upgradeSlug]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
			upgradeSlug: 'bellatrix',
		},
		variants: [
			{
				caip2: 'eip155:1',
				upgradeSlug: 'bellatrix',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/contract/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/contract/[address=evmAddress]/verification': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		},
		variants: [
			{
				caip2: 'eip155:1',
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/contracts': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/epoch/[epoch=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/epochs': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-20-transfers': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/account-factories': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/account-factory/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/account-factory/[address=evmAddress]/observations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/bundler/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/bundler/[address=evmAddress]/observations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/bundlers': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/paymaster/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/paymaster/[address=evmAddress]/observations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/paymasters': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/smart-account/[address=evmAddress]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/smart-account/[address=evmAddress]/observations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/smart-accounts': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/erc-4337/user-operations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/execution/[upgradeSlug]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/faucets': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/fee-market': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/fee-market/block/[blockNumber=evmBlockNumber]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/finality': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/finality/[timestampMs=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/gas-estimates': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/gas-estimates/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mempool': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mempool/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/builder/[builderPubkey]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/builder/[builderPubkey]/timestamp/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/builders': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/payloads': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/relay/[host]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/relay/[host]/timestamp/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/mev/relays': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/native-assets': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/nft-transfers': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/observations': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/precompiles': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/rollup/[projectId]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/rollup/[projectId]/timestamp/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/rpc-urls': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slashings': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slot/[slot=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slot/[slot=nonNegativeInteger]/slashing/[kind]/[index=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
			slot: '9500000',
			kind: 'proposer',
			index: '0',
		},
		variants: [
			{
				caip2: 'eip155:1',
				slot: '9500000',
				kind: 'proposer',
				index: '0',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/slots': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/sync-committee/[period=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/sync-committees': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/transactions': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]/internal-transfer/[indexInTransaction=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/upgrade/[upgradeSlug]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/upgrades': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/user-operation/[userOperationHash=userOperationHash]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/validator/[validatorIndex=nonNegativeInteger]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/validator/[validatorIndex=nonNegativeInteger]/observations/[slot=nonNegativeInteger]/[source]': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/validators': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=eip155NetworkCaip2]/withdrawals': {
		id: 'Network.Evm',
		fixture: {
			caip2: 'eip155:1',
		},
		variants: [
			{
				caip2: 'eip155:1',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[caip2=networkCaip2]': {},
	'/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]': {},
	'/network/[caip2=networkCaip2]/cosmos': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/account/[address]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/account/[address]/observations': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/account/[address]/transactions': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]/transactions': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/denom/[denom]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/governance': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/module/[moduleName]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/observations': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/tx/[txHash]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages/[messageIndex=nonNegativeInteger]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/cosmos/validators': {
		id: 'Network.Cosmos',
		fixture: {
			caip2: 'cosmos:cosmoshub-4',
			address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
			height: '31000000',
			source: 'CosmosSdk_Rest',
		},
		variants: [
			{
				caip2: 'cosmos:cosmoshub-4',
				address: 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j',
				height: '31000000',
				source: 'CosmosSdk_Rest',
			},
		],
		requiredProjections: [
			[
				'Cosmos',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'CosmosSdk',
			},
		],
	},
	'/network/[caip2=networkCaip2]/observations': {},
	'/network/[caip2=networkCaip2]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/network/[networkSlug=eip155NetworkSlug]': {
		id: 'Network.EvmSlug',
		fixture: {
			networkSlug: 'ethereum',
		},
		variants: [
			{
				networkSlug: 'ethereum',
			},
		],
		requiredProjections: [
			[
				'Evm',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'Evm',
			},
		],
	},
	'/network/[networkSlug=networkSlug]': {},
	'/network/[networkSlug=networkSlug]/address/[address]': {},
	'/network/[networkSlug=networkSlug]/blocks': {},
	'/network/[networkSlug=networkSlug]/blocks/[height]': {},
	'/network/[networkSlug=networkSlug]/channels': {
		id: 'LightningNetwork.Channels',
		fixture: {
			networkSlug: 'lightning',
		},
		variants: [
			{
				networkSlug: 'lightning',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/channels/[channelId]': {
		id: 'LightningChannel.NetworkChannelId',
		fixture: {
			networkSlug: 'lightning',
			channelId: '852861482917888001',
		},
		variants: [
			{
				networkSlug: 'lightning',
				channelId: '852861482917888001',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/governance': {},
	'/network/[networkSlug=networkSlug]/invoices': {
		id: 'BlockheadLightningInvoice.Network',
		fixture: {
			networkSlug: 'lightning',
		},
		variants: [
			{
				networkSlug: 'lightning',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/invoices/[paymentHash]': {
		id: 'BlockheadLightningInvoice.NetworkPaymentHash',
		fixture: {
			networkSlug: 'lightning',
			paymentHash: 'e2e-probe-paymentHash',
		},
		variants: [
			{
				networkSlug: 'lightning',
				paymentHash: 'e2e-probe-paymentHash',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/nodes': {
		id: 'LightningNode.Network',
		fixture: {
			networkSlug: 'lightning',
		},
		variants: [
			{
				networkSlug: 'lightning',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/nodes/[pubkey]': {
		id: 'LightningNode.NetworkPublicKey',
		fixture: {
			networkSlug: 'lightning',
			pubkey: '02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		},
		variants: [
			{
				networkSlug: 'lightning',
				pubkey: '02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/payments': {
		id: 'BlockheadLightningPayment.Network',
		fixture: {
			networkSlug: 'lightning',
		},
		variants: [
			{
				networkSlug: 'lightning',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/payments/[paymentHash]': {
		id: 'BlockheadLightningPayment.NetworkPaymentHash',
		fixture: {
			networkSlug: 'lightning',
			paymentHash: 'e2e-probe-paymentHash',
		},
		variants: [
			{
				networkSlug: 'lightning',
				paymentHash: 'e2e-probe-paymentHash',
			},
		],
		requiredProjections: [
			[
				'Lightning',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'namespace',
				],
				is: 'Lightning',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot': {
		id: 'Network.Polkadot',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/account/[accountId]': {
		id: 'PolkadotAccount.NetworkAccountId',
		fixture: {
			networkSlug: 'polkadot',
			accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
		},
		variants: [
			{
				networkSlug: 'polkadot',
				accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/account/[accountId]/observation/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'PolkadotAccount_Timestamp.AccountTimestampMsSource',
		fixture: {
			networkSlug: 'polkadot',
			accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
			timestampMs: '0',
			source: 'SubstrateSidecar_Rest',
		},
		variants: [
			{
				networkSlug: 'polkadot',
				accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
				timestampMs: '0',
				source: 'SubstrateSidecar_Rest',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]': {
		id: 'PolkadotBlock.NetworkBlockNumberHash',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]': {
		id: 'PolkadotEvent.BlockIndexInBlock',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]': {
		id: 'PolkadotExtrinsic.BlockIndexInBlock',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/observation/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Polkadot',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]': {
		id: 'PolkadotPallet.NetworkPalletName',
		fixture: {
			networkSlug: 'polkadot',
		},
		variants: [
			{
				networkSlug: 'polkadot',
			},
		],
		requiredProjections: [
			[
				'Polkadot',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'PolkadotRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/account/[pubkey]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/accounts': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/block/[slot]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/blocks': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/observations': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network_Timestamp.SolanaNetworkTimestampMsSource',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/program/[programId]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/programs': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/token-account/[tokenAccountPubkey]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/token-accounts': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/token-mints': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/transactions': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/tx/[signature]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/validator/[votePubkey]': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/solana/validators': {
		id: 'Network.Solana',
		fixture: {
			networkSlug: 'solana',
		},
		variants: [
			{
				networkSlug: 'solana',
			},
		],
		requiredProjections: [
			[
				'Solana',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'executionModels',
				],
				includes: 'SolanaRuntime',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/transactions': {},
	'/network/[networkSlug=networkSlug]/transactions/[txId]': {},
	'/network/[networkSlug=networkSlug]/utxo': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/address/[address]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/address/[address]/observations': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/blocks': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/observations': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/shielded-pool/[pool]': {
		id: 'ZcashShieldedPool.NetworkPool',
		fixture: {
			networkSlug: 'zcash',
			pool: 'orchard',
		},
		variants: [
			{
				networkSlug: 'zcash',
				pool: 'sapling',
			},
			{
				networkSlug: 'zcash',
				pool: 'orchard',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'Zcash',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'executionModels',
				],
				includes: 'ZcashShielded',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/transactions': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/input/[inputIndex=nonNegativeInteger]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/inputs': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount': {
		id: 'Network.Utxo.CashTokens',
		fixture: {
			networkSlug: 'bitcoin-cash',
		},
		variants: [
			{
				networkSlug: 'bitcoin-cash',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'CashTokens',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'namespace',
				],
				is: 'BitcoinCash',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft': {
		id: 'Network.Utxo.CashTokens',
		fixture: {
			networkSlug: 'bitcoin-cash',
		},
		variants: [
			{
				networkSlug: 'bitcoin-cash',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'CashTokens',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'namespace',
				],
				is: 'BitcoinCash',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment': {
		id: 'Network.Utxo.CashTokens',
		fixture: {
			networkSlug: 'bitcoin-cash',
		},
		variants: [
			{
				networkSlug: 'bitcoin-cash',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'CashTokens',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'namespace',
				],
				is: 'BitcoinCash',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/outputs': {
		id: 'Network.Utxo',
		fixture: {
			networkSlug: 'bitcoin',
		},
		variants: [
			{
				networkSlug: 'bitcoin',
			},
			{
				networkSlug: 'bitcoin-cash',
			},
			{
				networkSlug: 'dogecoin',
			},
			{
				networkSlug: 'litecoin',
			},
		],
		requiredProjections: [
			[
				'Utxo',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]': {
		id: 'ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction',
		fixture: {
			networkSlug: 'zcash',
			txId: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
			pool: 'sapling',
			actionKind: 'spend',
			actionIndex: '0',
		},
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'Zcash',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'executionModels',
				],
				includes: 'ZcashShielded',
			},
		],
	},
	'/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-actions': {
		id: 'ZcashShieldedAction.Transaction',
		fixture: {
			networkSlug: 'zcash',
			txId: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
		},
		requiredProjections: [
			[
				'Utxo',
			],
			[
				'Zcash',
			],
		],
		requiredProjectionConditions: [
			{
				path: [
					'ledgerModels',
				],
				includes: 'Utxo',
			},
			{
				path: [
					'executionModels',
				],
				includes: 'ZcashShielded',
			},
		],
	},
	'/nostr/article/[pubkey]/[identifier]': {},
	'/nostr/note/[eventId]': {},
	'/nostr/note/[eventId]/reactions': {},
	'/nostr/note/[eventId]/replies': {},
	'/nostr/profile/[pubkey]': {},
	'/nostr/profile/[pubkey]/articles': {},
	'/nostr/profile/[pubkey]/notes': {},
	'/nostr/profile/[pubkey]/reposts': {},
	'/nostr/reaction/[eventId]': {
		fixture: {
			eventId: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/nostr/relay/[relayKey]': {},
	'/nostr/repost/[eventId]': {
		fixture: {
			eventId: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/pool/[chainId=eip155ChainId]/[poolId]': {},
	'/pool/[chainId=eip155ChainId]/[poolId]/block/[blockNumber=nonNegativeInteger]': {},
	'/pool/[chainId=eip155ChainId]/[poolId]/observations/[timestampMs=nonNegativeInteger]/[feedKey]': {},
	'/proposals/[specificationRealmSlug=specificationRealmSlug]': {},
	'/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]': {},
	'/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]': {},
	'/reddit/comment/[fullname]': {
		id: 'RedditComment.Fullname',
		fixture: {
			fullname: 't1_osbo75d',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/reddit/comment/[fullname]/observations': {
		id: 'RedditComment.Observations',
		fixture: {
			fullname: 't1_osbo75d',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/reddit/comment/[fullname]/observations/[timestampMs=nonNegativeInteger]/[source]': {
		id: 'RedditComment_Timestamp.CommentTimestampMsSource',
		fixture: {
			fullname: 't1_osbo75d',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/reddit/comment/[fullname]/replies': {
		id: 'RedditComment.Replies',
		fixture: {
			fullname: 't1_osbo75d',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/reddit/link/[fullname]': {},
	'/reddit/link/[fullname]/comments': {},
	'/reddit/link/[fullname]/observations': {},
	'/reddit/link/[fullname]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/reddit/r/[name]': {},
	'/reddit/r/[name]/links': {},
	'/reddit/r/[name]/observations': {},
	'/reddit/r/[name]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/rss/feed/[feedKey]': {},
	'/rss/feed/[feedKey]/items': {},
	'/rss/feed/[feedKey]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/rss/item/[feedKey]/[guid]': {},
	'/rss/item/[feedKey]/[guid]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]': {},
	'/swarm/[reference]': {},
	'/swarm/[reference]/path/[...contentPath]': {},
	'/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/url/[url]': {},
	'/url/[url]/observations/[timestampMs=nonNegativeInteger]/[source]': {},
	'/vault/[chainId=eip155ChainId]/[vaultId]': {},
	'/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]': {},
	'/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]': {},
	'/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey]': {},
	'/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price': {},
	'/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]': {},
	'/x/post/[postId]': {},
	'/x/post/[postId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/x/user/[userId]': {},
	'/x/user/[userId]/observations/[timestampMs=nonNegativeInteger]': {},
	'/xmtp/account/[address=evmAddress]': {},
	'/xmtp/conversation/[conversationId]': {
		id: 'XmtpConversation.Id',
		fixture: {
			conversationId: 'e2e-probe-conversation',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/youtube/channel/[channelId]': {
		id: 'YoutubeChannel.ChannelId',
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/youtube/channel/[channelId]/observations/[timestampMs]': {
		id: 'YoutubeChannel_Timestamp.YoutubeChannelTimestampMs',
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/youtube/channel/[channelId]/playlists': {
		id: 'YoutubeChannel.Playlists',
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/youtube/channel/[channelId]/videos': {
		id: 'YoutubeChannel.Videos',
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		requiredProjections: [],
		requiredProjectionConditions: [],
	},
	'/youtube/comment/[videoId]/[commentId]': {},
	'/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]': {},
	'/youtube/playlist/[playlistId]': {},
	'/youtube/playlist/[playlistId]/observations/[timestampMs]': {},
	'/youtube/playlist/[playlistId]/videos': {},
	'/youtube/video/[videoId]': {},
	'/youtube/video/[videoId]/comments': {},
	'/youtube/video/[videoId]/observations/[timestampMs]': {},
} as const satisfies Record<string, E2eRouteFixtureMetadata>
