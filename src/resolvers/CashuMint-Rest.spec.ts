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
const mintTimestampResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CashuMint_Timestamp
	&& 'MintTimestampMsSource' in resolver.resolve
))
const keysetTimestampResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CashuKeyset_Timestamp
	&& 'KeysetTimestampMsSource' in resolver.resolve
))
const meltQuoteTimestampResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadCashuMeltQuote_Timestamp
	&& 'MeltQuoteTimestampMsSource' in resolver.resolve
))
const mintQuoteResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadCashuMintQuote
	&& 'MintMethodQuoteId' in resolver.resolve
))
const mintQuoteTimestampResolver = cashuMintResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadCashuMintQuote_Timestamp
	&& 'MintQuoteTimestampMsSource' in resolver.resolve
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
	mintTimestampResolver == null
	|| !('MintTimestampMsSource' in mintTimestampResolver.resolve)
	|| keysetTimestampResolver == null
	|| !('KeysetTimestampMsSource' in keysetTimestampResolver.resolve)
	|| meltQuoteTimestampResolver == null
	|| !('MeltQuoteTimestampMsSource' in meltQuoteTimestampResolver.resolve)
	|| mintQuoteResolver == null
	|| !('MintMethodQuoteId' in mintQuoteResolver.resolve)
	|| mintQuoteTimestampResolver == null
	|| !('MintQuoteTimestampMsSource' in mintQuoteTimestampResolver.resolve)
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

it('projects the current NUT-06 and NUT-02 contracts', async () => {
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
	expect(await mintTimestampResolver.resolve.MintTimestampMsSource.resolve({
		$mint: mintSelector,
		timestampMs: 10,
		source: Source.CashuMint_Rest,
	}, {})).toMatchObject({
		descriptionLong: 'Long',
		contactJson: JSON.stringify(contact),
		urls: ['https://mint.example'],
		nutsJson: JSON.stringify(nuts),
		mintMethodsJson: JSON.stringify(methods),
		meltMethodsJson: JSON.stringify(methods),
		supportedNutNumbers: [
			4,
			5,
			7,
		],
	})
	expect(await keysetTimestampResolver.resolve.KeysetTimestampMsSource.resolve({
		$keyset: {
			$mint: mintSelector,
			keysetId: 'keyset',
		},
		timestampMs: 10,
		source: Source.CashuMint_Rest,
	}, {})).toMatchObject({
		inputFeePpk: 0,
		finalExpiryMs: 1_896_187_313_000,
		listedByKeysetsEndpoint: true,
		listedByKeysEndpoint: true,
	})
	expect(mintTimestampResolver.projections.urls({})).toEqual([])
	expect(mintTimestampResolver.projections.supportedNutNumbers({})).toEqual([])
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
		}],
	})
	await expect(mintQuoteTimestampResolver.resolve.MintQuoteTimestampMsSource.resolve({
		$mintQuote: mintQuoteSelector,
		timestampMs: 1_700_000_000_000,
		source: Source.CashuMint_Rest,
	}, {})).resolves.toEqual({
		$mintQuote: {
			[EntityMetaKey.Selector]: mintQuoteSelector,
		},
		timestampMs: 1_700_000_000_000,
		source: Source.CashuMint_Rest,
		state: 'PAID',
		expiryMs: 1_700_000_100_000,
	})
	expect(getMintQuoteBolt11).toHaveBeenCalledTimes(2)
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
	await expect(mintQuoteTimestampResolver.resolve.MintQuoteTimestampMsSource.resolve({
		$mintQuote: mintQuoteSelector,
		timestampMs: 1_700_000_000_000,
		source: Source.CashuMint_Rest,
	}, {})).rejects.toThrow('mint quote state is absent')
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
		}],
	})
	await expect(meltQuoteTimestampResolver.resolve.MeltQuoteTimestampMsSource.resolve({
		$meltQuote: meltQuoteSelector,
		timestampMs: 100,
		source: Source.CashuMint_Rest,
	}, {})).resolves.toEqual({
		$meltQuote: {
			[EntityMetaKey.Selector]: meltQuoteSelector,
		},
		timestampMs: 100,
		source: Source.CashuMint_Rest,
		state: 'PAID',
		expiryMs: 1_700_000_000_000,
	})
	expect(getMeltQuoteBolt11).toHaveBeenCalledTimes(2)
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

	await expect(meltQuoteTimestampResolver.resolve.MeltQuoteTimestampMsSource.resolve({
		$meltQuote: {
			$mint: { mintUrl: 'https://mint.example' },
			method: 'bolt12',
			quoteId: 'melt-quote',
		},
		timestampMs: 100,
		source: Source.CashuMint_Rest,
	}, {})).rejects.toThrow('unsupported melt method bolt12')
	expect(getMeltQuoteBolt11).not.toHaveBeenCalled()

	await expect(meltQuoteTimestampResolver.resolve.MeltQuoteTimestampMsSource.resolve({
		$meltQuote: {
			$mint: { mintUrl: 'https://mint.example' },
			method: 'bolt11',
			quoteId: 'melt-quote',
		},
		timestampMs: 100,
		source: Source.Aave_Rest,
	}, {})).rejects.toThrow('unsupported source Aave_Rest')
	expect(getMeltQuoteBolt11).not.toHaveBeenCalled()
})
