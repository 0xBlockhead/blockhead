import {
	afterEach,
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const { getMeltQuoteBolt11, getMintInfo, getMintKeys, getMintKeysets, getMintKeysForKeyset, getMintQuoteBolt11 } = vi.hoisted(() => ({
	getMeltQuoteBolt11: vi.fn(),
	getMintInfo: vi.fn(),
	getMintKeys: vi.fn(),
	getMintKeysets: vi.fn(),
	getMintKeysForKeyset: vi.fn(),
	getMintQuoteBolt11: vi.fn(),
}))
vi.mock('$/sources/Cashu/Mint/Rest/queries.ts', () => ({
	getMeltQuoteBolt11,
	getMintInfo,
	getMintKeys,
	getMintKeysets,
	getMintKeysForKeyset,
	getMintQuoteBolt11,
}))
const { default: cashuMintResolvers } = await import('$/resolvers/CashuMint-Rest.ts')
const mintResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CashuMint
	&& '$$timestamps' in resolver.projections
	&& !('$$keysets' in resolver.projections)
))
const keysetResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CashuKeyset
	&& 'CashuMintKeysetId' in resolver.resolve
))
const mintQuoteResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadCashuMintQuote
	&& 'MintMethodQuoteId' in resolver.resolve
))
const meltQuoteResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadCashuMeltQuote
	&& 'MintMethodQuoteId' in resolver.resolve
))
const mintKeysetsResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CashuMint
	&& '$$keysets' in resolver.projections
))
if (
	mintResolver == null
	|| !('MintUrl' in mintResolver.resolve)
	|| keysetResolver == null
	|| !('CashuMintKeysetId' in keysetResolver.resolve)
	|| mintQuoteResolver == null
	|| !('MintMethodQuoteId' in mintQuoteResolver.resolve)
	|| meltQuoteResolver == null
	|| !('MintMethodQuoteId' in meltQuoteResolver.resolve)
	|| mintKeysetsResolver == null
	|| !('MintUrl' in mintKeysetsResolver.resolve)
)
	throw new Error('CashuMint_Rest spec missing read resolvers')

beforeEach(() => {
	getMeltQuoteBolt11.mockReset()
	getMintInfo.mockReset()
	getMintKeys.mockReset()
	getMintKeysets.mockReset()
	getMintKeysForKeyset.mockReset()
	getMintQuoteBolt11.mockReset()
})

afterEach(() => {
	vi.restoreAllMocks()
})

it('does not register direct Cashu timestamp replay resolvers', () => {
	expect(cashuMintResolvers.resolvers.some((resolver) => (
		resolver.entityType === EntityType.CashuMint_Timestamp
	))).toBe(false)
	expect(cashuMintResolvers.resolvers.some((resolver) => (
		resolver.entityType === EntityType.CashuKeyset_Timestamp
	))).toBe(false)
	expect(cashuMintResolvers.resolvers.some((resolver) => (
		resolver.entityType === EntityType.BlockheadCashuMintQuote_Timestamp
	))).toBe(false)
	expect(cashuMintResolvers.resolvers.some((resolver) => (
		resolver.entityType === EntityType.BlockheadCashuMeltQuote_Timestamp
	))).toBe(false)
})

it('projects the current NUT-06 and NUT-02 contracts from one parent read', async () => {
	const contact = [{
		method: 'email',
		info: 'mint@example.com',
	}]
	const methods = [{
		method: 'bolt11',
		unit: 'sat',
	}]
	const nuts = {
		4: { methods },
		5: { methods },
		7: { supported: true },
	}
	getMintInfo.mockResolvedValue({
		description_long: 'Long',
		icon_url: 'https://mint.example/icon.png',
		contact,
		urls: ['https://mint.example'],
		nuts,
	})
	getMintKeysets.mockResolvedValue({
		keysets: [{
			id: 'keyset',
			unit: 'sat',
			active: true,
			final_expiry: 1_896_187_313,
		}],
	})
	getMintKeysForKeyset.mockResolvedValue({
		keysets: [{
			id: 'keyset',
			unit: 'sat',
			active: true,
			keys: {
				1: '02abc',
			},
		}],
	})
	const mintSelector = { mintUrl: 'https://mint.example' }
	const mintSnapshot = await mintResolver.resolve.MintUrl.resolve(mintSelector, {})
	const mintObservation = mintSnapshot.$$timestamps[0]
	const mintFields = mintObservation[EntityMetaKey.Fields]

	expect(getMintInfo).toHaveBeenCalledTimes(1)
	expect(getMintInfo).toHaveBeenCalledWith('https://mint.example')
	expect(mintFields).toMatchObject({
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'descriptionLong')]: 'Long',
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'contactJson')]: JSON.stringify(contact),
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'urls')]: ['https://mint.example'],
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'nutsJson')]: JSON.stringify(nuts),
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'mintMethodsJson')]: JSON.stringify(methods),
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'meltMethodsJson')]: JSON.stringify(methods),
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'supportedNutNumbers')]: [
			4,
			5,
			7,
		],
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], '$icon')]: {
			[EntityMetaKey.Selector]: {
				url: 'https://mint.example/icon.png',
			},
		},
	})
	expect(mintObservation[EntityMetaKey.Selector]).toMatchObject({
		$mint: mintSelector,
		source: Source.CashuMint_Rest,
		timestampMs: expect.any(Number),
	})

	const keysetSnapshot = await keysetResolver.resolve.CashuMintKeysetId.resolve({
		$mint: mintSelector,
		keysetId: 'keyset',
	}, {})
	const keysetObservation = keysetSnapshot.$$timestamps[0]

	expect(getMintKeysets).toHaveBeenCalledTimes(1)
	expect(getMintKeysForKeyset).toHaveBeenCalledTimes(1)
	expect(keysetObservation[EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'inputFeePpk')]: 0,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'finalExpiryMs')]: 1_896_187_313_000,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysetsEndpoint')]: true,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysEndpoint')]: true,
	})
	expect(keysetObservation[EntityMetaKey.Selector]).toMatchObject({
		source: Source.CashuMint_Rest,
		timestampMs: expect.any(Number),
	})
})

it('materializes key rotation and key availability on the mint-owned keyset collection', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
	getMintKeysets.mockResolvedValue({
		keysets: [
			{
				id: 'active-keyset',
				unit: 'sat',
				active: true,
				input_fee_ppk: 100,
			},
			{
				id: 'retired-keyset',
				unit: 'sat',
				active: false,
				final_expiry: 1_800_000_000,
			},
		],
	})
	getMintKeys.mockResolvedValue({
		keysets: [{
			id: 'active-keyset',
			unit: 'sat',
			active: true,
			keys: {
				1: '02active',
			},
		}],
	})

	const rows = await mintKeysetsResolver.resolve.MintUrl.resolve(
		{ mintUrl: 'https://mint.example' },
		{ pagination: { limit: 10 } }
	)
	const activeFields = rows[0][EntityMetaKey.Fields]
	const retiredFields = rows[1][EntityMetaKey.Fields]
	const activeObservation = activeFields[
		entityFieldAddressKey(EntityType.CashuKeyset, [], '$$timestamps')
	][0]
	const retiredObservation = retiredFields[
		entityFieldAddressKey(EntityType.CashuKeyset, [], '$$timestamps')
	][0]

	expect(activeFields).toMatchObject({
		[entityFieldAddressKey(EntityType.CashuKeyset, [], 'unit')]: 'sat',
		[entityFieldAddressKey(EntityType.CashuKeyset, [], 'keysByAmountJson')]: JSON.stringify({ 1: '02active' }),
	})
	expect(activeObservation[EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'active')]: true,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'inputFeePpk')]: 100,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysetsEndpoint')]: true,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysEndpoint')]: true,
	})
	expect(retiredFields).not.toHaveProperty(
		entityFieldAddressKey(EntityType.CashuKeyset, [], 'keysByAmountJson')
	)
	expect(retiredObservation[EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'active')]: false,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'finalExpiryMs')]: 1_800_000_000_000,
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysEndpoint')]: false,
	})
})

it('projects an exact BOLT11 mint quote read without owning the mutation', async () => {
	getMintQuoteBolt11.mockResolvedValue({
		quote: 'mint-quote',
		request: 'lnbc-invoice',
		amount: 10,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 10,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		state: 'PAID',
		expiry: 1_700_000_100,
	})
	const mintQuoteSelector = {
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt11',
		quoteId: 'mint-quote',
	}

	await expect(mintQuoteResolver.resolve.MintMethodQuoteId.resolve(
		mintQuoteSelector,
		{}
	)).resolves.toEqual({
		request: 'lnbc-invoice',
		unit: 'sat',
		amount: 10n,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$mintQuote: mintQuoteSelector,
				timestampMs: 1_700_000_000_000,
				source: Source.CashuMint_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadCashuMintQuote_Timestamp, [], 'state')]: 'PAID',
				[entityFieldAddressKey(EntityType.BlockheadCashuMintQuote_Timestamp, [], 'expiryMs')]: 1_700_000_100_000,
			},
		}],
	})
	expect(getMintQuoteBolt11).toHaveBeenCalledTimes(1)
	expect(getMintQuoteBolt11).toHaveBeenCalledWith(
		'https://mint.example',
		'mint-quote'
	)
})

it('does not fabricate a mint quote observation when the wire omits state', async () => {
	getMintQuoteBolt11.mockResolvedValue({
		quote: 'mint-quote',
		request: 'lnbc-invoice',
		amount: 10,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		expiry: null,
	})
	const mintQuoteSelector = {
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt11',
		quoteId: 'mint-quote',
	}

	await expect(mintQuoteResolver.resolve.MintMethodQuoteId.resolve(
		mintQuoteSelector,
		{}
	)).resolves.toMatchObject({
		$$timestamps: [],
	})
	expect(getMintQuoteBolt11).toHaveBeenCalledTimes(1)
})

it('rejects unsafe Cashu timestamp conversions before creating an observation selector', async () => {
	getMintQuoteBolt11.mockResolvedValue({
		quote: 'mint-quote',
		request: 'lnbc-invoice',
		amount: 10,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 0,
		amount_issued: 0,
		updated_at: Number.MAX_SAFE_INTEGER,
		state: 'UNPAID',
		expiry: null,
	})

	await expect(mintQuoteResolver.resolve.MintMethodQuoteId.resolve({
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt11',
		quoteId: 'mint-quote',
	}, {})).rejects.toThrow('invalid mint quote updated_at')
})

it('projects an exact BOLT11 melt quote read without owning the mutation', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(100)
	getMeltQuoteBolt11.mockResolvedValue({
		quote: 'melt-quote',
		request: 'lnbc-invoice',
		amount: 10,
		unit: 'sat',
		method: 'bolt11',
		fee_reserve: 2,
		state: 'PAID',
		expiry: 1_700_000_000,
		payment_preimage: 'preimage',
	})
	const meltQuoteSelector = {
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt11',
		quoteId: 'melt-quote',
	}

	await expect(meltQuoteResolver.resolve.MintMethodQuoteId.resolve(
		meltQuoteSelector,
		{}
	)).resolves.toEqual({
		request: 'lnbc-invoice',
		amount: 10n,
		unit: 'sat',
		feeReserve: 2n,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$meltQuote: meltQuoteSelector,
				timestampMs: 100,
				source: Source.CashuMint_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadCashuMeltQuote_Timestamp, [], 'state')]: 'PAID',
				[entityFieldAddressKey(EntityType.BlockheadCashuMeltQuote_Timestamp, [], 'expiryMs')]: 1_700_000_000_000,
			},
		}],
	})
	expect(getMeltQuoteBolt11).toHaveBeenCalledTimes(1)
	expect(getMeltQuoteBolt11).toHaveBeenCalledWith(
		'https://mint.example',
		'melt-quote'
	)
})

it('rejects inapplicable Cashu melt observations before transport', async () => {
	await expect(mintQuoteResolver.resolve.MintMethodQuoteId.resolve({
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt12',
		quoteId: 'mint-quote',
	}, {})).rejects.toThrow('unsupported mint method bolt12')
	expect(getMintQuoteBolt11).not.toHaveBeenCalled()

	await expect(meltQuoteResolver.resolve.MintMethodQuoteId.resolve({
		$mint: { mintUrl: 'https://mint.example' },
		method: 'bolt12',
		quoteId: 'melt-quote',
	}, {})).rejects.toThrow('unsupported melt method bolt12')
	expect(getMeltQuoteBolt11).not.toHaveBeenCalled()
})
