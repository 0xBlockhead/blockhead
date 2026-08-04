import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAllAssets,
	getAssetRating,
	getSequenceFromTimestamp,
	getTimestampFromSequence,
} = vi.hoisted(() => ({
	getAllAssets: vi.fn(),
	getAssetRating: vi.fn(),
	getSequenceFromTimestamp: vi.fn(),
	getTimestampFromSequence: vi.fn(),
}))

vi.mock('$/sources/StellarExpert/Rest/queries.ts', () => ({
	getAllAssets,
	getAssetRating,
	getSequenceFromTimestamp,
	getTimestampFromSequence,
}))

const { default: stellarExpertResolvers } = await import('$/resolvers/StellarExpert.ts')
const [
	ledgerResolver,
	networkTimestampResolver,
	assetResolver,
	networkAssetsResolver,
] = stellarExpertResolvers.resolvers
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const stellarNetwork = {
	$network: {
		slug: 'stellar',
	},
}
const ledger = {
	$network: stellarNetwork,
	sequence: 42_431_435n,
}

describe('StellarExpert ledger resolver', () => {
	beforeEach(() => {
		getTimestampFromSequence.mockReset()
	})

	it('resolves the exact public-ledger close time in milliseconds', async () => {
		getTimestampFromSequence.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_078,
			date: '2022-08-29T13:51:18.000Z',
		})

		const snapshot = await ledgerResolver.resolve.NetworkSequence.resolve(ledger, context)

		expect(ledgerResolver.projections.closeTimeMs(snapshot)).toBe(1_661_781_078_000)
		expect(getTimestampFromSequence).toHaveBeenCalledWith({
			network: 'public',
			sequence: 42_431_435,
		})
	})

	it('rejects unsupported networks and non-representable sequences before I/O', async () => {
		await expect(ledgerResolver.resolve.NetworkSequence.resolve({
			...ledger,
			$network: {
				$network: {
					slug: 'stellar-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		await expect(ledgerResolver.resolve.NetworkSequence.resolve({
			...ledger,
			sequence: 0n,
		}, context)).rejects.toThrow('positive safe integer')
		await expect(ledgerResolver.resolve.NetworkSequence.resolve({
			...ledger,
			sequence: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
		}, context)).rejects.toThrow('positive safe integer')
		expect(getTimestampFromSequence).not.toHaveBeenCalled()
	})

	it.each([
		[
			'missing sequence',
			{
				timestamp: 1_661_781_078,
				date: '2022-08-29T13:51:18.000Z',
			},
			'response ledger sequence does not match request',
		],
		[
			'mismatched sequence',
			{
				sequence: 42_431_436,
				timestamp: 1_661_781_078,
				date: '2022-08-29T13:51:18.000Z',
			},
			'response ledger sequence does not match request',
		],
		[
			'fractional timestamp',
			{
				sequence: 42_431_435,
				timestamp: 1_661_781_078.5,
				date: '2022-08-29T13:51:18.500Z',
			},
			'invalid ledger timestamp',
		],
		[
			'unsafe timestamp',
			{
				sequence: 42_431_435,
				timestamp: Number.MAX_SAFE_INTEGER,
				date: '2022-08-29T13:51:18.000Z',
			},
			'invalid ledger timestamp',
		],
		[
			'mismatched date',
			{
				sequence: 42_431_435,
				timestamp: 1_661_781_078,
				date: '2022-08-29T13:51:19.000Z',
			},
			'ledger date does not match timestamp',
		],
	] as const)('rejects a %s response', async (_name, response, message) => {
		getTimestampFromSequence.mockResolvedValue(response)

		await expect(
			ledgerResolver.resolve.NetworkSequence.resolve(ledger, context)
		).rejects.toThrow(message)
	})
})

describe('StellarExpert network observation resolver', () => {
	beforeEach(() => {
		getSequenceFromTimestamp.mockReset()
	})

	it('maps sequence-from-timestamp into latestLedger without soft-empty HTTP', async () => {
		getSequenceFromTimestamp.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_078,
			date: '2022-08-29T13:51:18.000Z',
		})

		const snapshot = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: stellarNetwork,
			timestampMs: 1_661_781_078_500,
			source: Source.StellarExpert,
		}, context)

		expect(networkTimestampResolver.projections.latestLedger(snapshot)).toBe(42_431_435n)
		expect(getSequenceFromTimestamp).toHaveBeenCalledWith({
			network: 'public',
			timestamp: 1_661_781_078,
		})
	})

	it('rejects future-closing ledgers and wrong observation sources before trusting HTTP', async () => {
		getSequenceFromTimestamp.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_079,
			date: '2022-08-29T13:51:19.000Z',
		})

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: stellarNetwork,
			timestampMs: 1_661_781_078_000,
			source: Source.StellarHorizon_Rest,
		}, context)).rejects.toThrow('unsupported observation source')
		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: stellarNetwork,
			timestampMs: 1_661_781_078_000,
			source: Source.StellarExpert,
		}, context)).rejects.toThrow('closes after the observation timestamp')
	})

	it('propagates sequence-from-timestamp HTTP failures', async () => {
		getSequenceFromTimestamp.mockRejectedValue(new Error('HTTP 404: Not Found'))

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: stellarNetwork,
			timestampMs: 0,
			source: Source.StellarExpert,
		}, context)).rejects.toThrow('HTTP 404')
	})
})

describe('StellarExpert asset resolvers', () => {
	beforeEach(() => {
		getAssetRating.mockReset()
		getAllAssets.mockReset()
	})

	it('resolves issued and native asset identity after a hard-fail rating lookup', async () => {
		getAssetRating.mockResolvedValue({
			asset: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
			rating: {
				average: 8.1,
			},
		})

		const issued = await assetResolver.resolve.NetworkAssetKey.resolve({
			$network: stellarNetwork,
			assetKey: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
		}, context)

		expect(assetResolver.projections.assetKind(issued)).toBe('credit_alphanum4')
		expect(assetResolver.projections.assetCode(issued)).toBe('USDC')
		expect(assetResolver.projections.issuer(issued)).toBe('GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')
		expect(assetResolver.projections.$issuerAccount(issued, {
			$network: stellarNetwork,
			assetKey: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
		})).toEqual({
			[EntityMetaKey.Selector]: {
				$network: stellarNetwork,
				accountId: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
			},
		})

		getAssetRating.mockResolvedValue({
			asset: 'XLM',
			rating: {
				average: 10,
			},
		})
		const native = await assetResolver.resolve.NetworkAssetKey.resolve({
			$network: stellarNetwork,
			assetKey: 'XLM',
		}, context)
		expect(assetResolver.projections.assetKind(native)).toBe('native')
		expect(assetResolver.projections.issuer(native)).toBeUndefined()
		expect(assetResolver.projections.$issuerAccount(native, {
			$network: stellarNetwork,
			assetKey: 'XLM',
		})).toBeUndefined()
	})

	it('rejects malformed keys and missing rating payloads without inventing empty assets', async () => {
		await expect(assetResolver.resolve.NetworkAssetKey.resolve({
			$network: stellarNetwork,
			assetKey: 'not-an-asset',
		}, context)).rejects.toThrow('malformed asset key')
		expect(getAssetRating).not.toHaveBeenCalled()

		getAssetRating.mockResolvedValue({
			asset: 'XLM',
		})
		await expect(assetResolver.resolve.NetworkAssetKey.resolve({
			$network: stellarNetwork,
			assetKey: 'XLM',
		}, context)).rejects.toThrow('missing rating')
	})

	it('propagates asset rating HTTP failures', async () => {
		getAssetRating.mockRejectedValue(new Error('HTTP 404: Not Found'))

		await expect(assetResolver.resolve.NetworkAssetKey.resolve({
			$network: stellarNetwork,
			assetKey: 'XLM',
		}, context)).rejects.toThrow('HTTP 404')
	})

	it('materializes a rated network asset page with continuation', async () => {
		getAllAssets.mockResolvedValue({
			_embedded: {
				records: [
					{
						asset: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
						paging_token: 1,
					},
					{
						asset: 'yXLM-GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55-1',
						paging_token: 2,
					},
				],
			},
		})

		const snapshot = await networkAssetsResolver.resolve.Network.resolve(stellarNetwork, context)
		const assets = networkAssetsResolver.projections.$$assets.select(snapshot, stellarNetwork)

		expect(getAllAssets).toHaveBeenCalledWith({
			network: 'public',
			sort: 'rating',
			order: 'desc',
			limit: 2,
		})
		expect(assets).toHaveLength(2)
		expect(assets[0][EntityMetaKey.Selector]).toEqual({
			$network: stellarNetwork,
			assetKey: 'USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
		})
		expect(networkAssetsResolver.projections.$$assets.continuation(snapshot, stellarNetwork)).toEqual({
			operation: 'network-assets',
			target: 'stellar',
			terminal: false,
			token: '2',
		})
	})

	it('rejects asset pages that omit records instead of soft-emptying', async () => {
		getAllAssets.mockResolvedValue({})

		const snapshot = await networkAssetsResolver.resolve.Network.resolve(stellarNetwork, context)
		expect(() => networkAssetsResolver.projections.$$assets.select(snapshot, stellarNetwork)).toThrow('missing records')
	})
})
