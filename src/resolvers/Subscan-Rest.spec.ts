import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const { default: subscan } = await import('$/resolvers/Subscan-Rest.ts')

const referendumResolver = subscan.resolvers.find((
	resolver
): resolver is Extract<
	typeof subscan.resolvers[number],
	{ entityType: EntityType.PolkadotReferendum }
> => resolver.entityType === EntityType.PolkadotReferendum)

if (referendumResolver == null)
	throw new Error('Subscan referendum resolver is missing')

const referendumObservationResolver = subscan.resolvers.find((
	resolver
): resolver is Extract<
	typeof subscan.resolvers[number],
	{ entityType: EntityType.PolkadotReferendum_Timestamp }
> => resolver.entityType === EntityType.PolkadotReferendum_Timestamp)

if (referendumObservationResolver == null)
	throw new Error('Subscan referendum observation resolver is missing')

const extrinsicResolver = subscan.resolvers.find((
	resolver
): resolver is Extract<
	typeof subscan.resolvers[number],
	{ entityType: EntityType.PolkadotExtrinsic }
> => resolver.entityType === EntityType.PolkadotExtrinsic)

if (extrinsicResolver == null)
	throw new Error('Subscan extrinsic resolver is missing')

const blockResolver = subscan.resolvers.find((
	resolver
): resolver is Extract<
	typeof subscan.resolvers[number],
	{ entityType: EntityType.PolkadotBlock }
> => resolver.entityType === EntityType.PolkadotBlock)

if (blockResolver == null)
	throw new Error('Subscan block resolver is missing')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_SUBSCAN_API_KEY: 'subscan-key',
	},
}

const polkadotNetwork = {
	caip2: {
		namespace: 'polkadot',
		reference: '91b171bb158e2d3848fa23a9f1c25182',
	},
}

const referendumResponse = {
	code: 0,
	message: 'Success',
	generated_at: 1_753_000_000,
	data: {
		referendum_index: 123,
		origins: 'root',
		created_block: 20_000_000,
		latest_block_num: 20_000_100,
		latest_block_timestamp: 1_753_000_100,
		status: 'Deciding',
		ayes_amount: '123000000000',
		nays_amount: '45000000000',
		timeline: [
			{
				block: 20_000_000,
				status: 'Submitted',
				time: 1_753_000_000,
			},
		],
	},
}

describe('Subscan OpenGov referendum resolver', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(new Response(JSON.stringify(referendumResponse)))
	})

	it('maps detail, timeline observations, and vote totals from the registered Subscan binding', async () => {
		const selector = {
			$network: polkadotNetwork,
			referendumId: '123',
		}
		const referendum = await referendumResolver.resolve['NetworkReferendumId'].resolve(selector, context)

		expect(referendum).toMatchObject({
			track: 'root',
			submittedAtBlockNumber: 20_000_000n,
		})
		expect(referendumResolver.projections.$$timestamps(referendum)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$referendum: selector,
					timestampMs: 1_753_000_000_000,
					source: Source.Subscan_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockNumber')]: 20_000_000n,
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'status')]: 'Submitted',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$referendum: selector,
					timestampMs: 1_753_000_100_000,
					source: Source.Subscan_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockNumber')]: 20_000_100n,
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'status')]: 'Deciding',
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'ayeVotes')]: 123_000_000_000n,
					[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'nayVotes')]: 45_000_000_000n,
				},
			},
		])
		expect(corsFetch).toHaveBeenCalledWith(
			'https://polkadot.api.subscan.io/api/scan/referenda/referendum',
			expect.objectContaining({
				init: expect.objectContaining({
					body: JSON.stringify({ referendum_index: 123 }),
					headers: expect.objectContaining({
						'X-API-Key': 'subscan-key',
					}),
				}),
			})
		)
	})

	it('resolves an exact observation and rejects unsupported identities', async () => {
		const resolve = referendumObservationResolver.resolve['ReferendumTimestampMsSource'].resolve
		await expect(resolve({
			$referendum: {
				$network: polkadotNetwork,
				referendumId: '123',
			},
			timestampMs: 1_753_000_100_000,
			source: Source.Subscan_Rest,
		}, context)).resolves.toMatchObject({
			blockNumber: 20_000_100n,
			status: 'Deciding',
			ayeVotes: 123_000_000_000n,
			nayVotes: 45_000_000_000n,
		})

		await expect(resolve({
			$referendum: {
				$network: polkadotNetwork,
				referendumId: '0123',
			},
			timestampMs: 1_753_000_100_000,
			source: Source.Subscan_Rest,
		}, context)).rejects.toThrow('invalid referendum ID')
	})

	it('rejects detail responses for a different observation subject', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...referendumResponse,
			data: {
				...referendumResponse.data,
				referendum_index: 124,
			},
		})))

		await expect(referendumObservationResolver.resolve[
			'ReferendumTimestampMsSource'
		].resolve({
			$referendum: {
				$network: polkadotNetwork,
				referendumId: '123',
			},
			timestampMs: 1_753_000_100_000,
			source: Source.Subscan_Rest,
		}, context)).rejects.toThrow('does not match the observation subject')
	})
})

describe('Subscan extrinsic resolver', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	const selector = {
		$block: {
			$network: polkadotNetwork,
			blockNumber: 20_000_000n,
			hash: '0xBLOCK_HASH',
		},
		indexInBlock: 3,
	}
	const extrinsicResponse = {
		code: 0,
		message: 'Success',
		generated_at: 1_753_000_100,
		data: {
			account_id: '12dK7dBTwDJcb4VGBag9zRrwWBPq9VtfmDDbVQCM1jVweTVm',
			block_num: 20_000_000,
			call_module: 'balances',
			call_module_function: 'transfer_keep_alive',
			extrinsic_hash: '0xEXTRINSIC_HASH',
			extrinsic_index: '20000000-3',
			success: true,
		},
	}

	it('preserves exact block, index, signer, and call identities', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify(extrinsicResponse)))
		await expect(extrinsicResolver.resolve[
			'BlockIndexInBlock'
		].resolve(selector, context)).resolves.toMatchObject({
			hash: '0xEXTRINSIC_HASH',
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: polkadotNetwork,
					accountId: extrinsicResponse.data.account_id,
				},
			},
			callName: 'transfer_keep_alive',
			success: true,
		})
	})

	it('fails closed on foreign and malformed indexed identities', async () => {
		for (const data of [
			{
				...extrinsicResponse.data,
				extrinsic_index: '20000000-4',
			},
			{
				...extrinsicResponse.data,
				block_num: 20_000_001,
			},
			{
				...extrinsicResponse.data,
				account_id: '',
			},
		]) {
			corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
				...extrinsicResponse,
				data,
			})))
			await expect(extrinsicResolver.resolve[
				'BlockIndexInBlock'
			].resolve(selector, context)).rejects.toThrow()
		}
	})
})

describe('Subscan block resolver', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('projects paginated $$extrinsics with authoritative count', async () => {
		corsFetch.mockImplementation(async (url: string) => {
			if (url.endsWith('/api/scan/block'))
				return new Response(JSON.stringify({
					code: 0,
					message: 'Success',
					generated_at: 1_753_000_100,
					data: {
						block_num: 20_000_000,
						block_hash: '0xBLOCK_HASH',
						parent_hash: '0xPARENT_HASH',
						state_root: '0xSTATE',
						extrinsics_root: '0xEXTRINSICS',
					},
				}))
			if (url.endsWith('/api/scan/extrinsics'))
				return new Response(JSON.stringify({
					code: 0,
					message: 'Success',
					generated_at: 1_753_000_100,
					data: {
						count: 40,
						extrinsics: [{
							account_id: '12dK7dBTwDJcb4VGMb9zRrwWBPq9VtfmDDbVQCM1jVweTVm',
							block_num: 20_000_000,
							call_module: 'balances',
							call_module_function: 'transfer_keep_alive',
							extrinsic_hash: '0xEXTRINSIC_HASH',
							extrinsic_index: '20000000-3',
							success: true,
						}],
					},
				}))
			throw new Error(`unexpected Subscan URL ${url}`)
		})

		const selector = {
			$network: polkadotNetwork,
			blockNumber: 20_000_000n,
			hash: '0xBLOCK_HASH',
		}
		const pageContext = {
			...context,
			pagination: {
				limit: 10,
			},
		}
		const block = await blockResolver.resolve.NetworkBlockNumberHash.resolve(selector, pageContext)
		expect(blockResolver.projections.$$extrinsics.resolveCount?.(block, selector, pageContext)).toBe(40)
		expect(blockResolver.projections.$$extrinsics.select?.(block, selector, pageContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$block: selector,
				indexInBlock: 3,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: '0xEXTRINSIC_HASH',
				[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$signer')]: {
					[EntityMetaKey.Selector]: {
						$network: polkadotNetwork,
						accountId: '12dK7dBTwDJcb4VGMb9zRrwWBPq9VtfmDDbVQCM1jVweTVm',
					},
				},
				[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$pallet')]: {
					[EntityMetaKey.Selector]: {
						$network: polkadotNetwork,
						palletName: 'balances',
					},
				},
				[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'callName')]: 'transfer_keep_alive',
				[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'success')]: true,
			},
		}])
		expect(blockResolver.projections.$$extrinsics.continuation?.(block, selector, pageContext)).toEqual({
			operation: 'block-extrinsics',
			target: '20000000:0xBLOCK_HASH',
			terminal: false,
			token: '1',
		})
	})
})
