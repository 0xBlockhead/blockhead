import { expect, it, vi } from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const { getMintInfo, getMintKeysets, getMintKeysForKeyset } = vi.hoisted(() => ({
	getMintInfo: vi.fn(),
	getMintKeysets: vi.fn(),
	getMintKeysForKeyset: vi.fn(),
}))
vi.mock('$/sources/Cashu/Mint/Rest/queries.ts', () => ({
	getMintInfo,
	getMintKeysets,
	getMintKeysForKeyset,
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
if (
	mintTimestampResolver == null
	|| !('MintTimestampMsSource' in mintTimestampResolver.resolve)
	|| keysetTimestampResolver == null
	|| !('KeysetTimestampMsSource' in keysetTimestampResolver.resolve)
)
	throw new Error('CashuMint_Rest spec missing timestamp resolvers')

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
