import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const farcasterGet = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/client.ts', () => ({
	farcasterGet,
}))

const {
	getAllChannels,
	getChannel,
	getChannelMember,
	getChannelMembersPage,
	getPrimaryAddress,
	getUserChannelFollowStatus,
	getUserThreadCastsByClientUrl,
	getUserThreadCasts,
} = await import(
	'$/sources/Farcaster/Rest/queries.ts'
)

describe('Farcaster channel request identity', () => {
	it('loads all channels once and rejects duplicate ids', async () => {
		farcasterGet.mockResolvedValueOnce({ result: { channels: [] } })

		await expect(getAllChannels()).resolves.toEqual([])
		expect(farcasterGet).toHaveBeenCalledOnce()
		expect(farcasterGet).toHaveBeenCalledWith(
			'client-api',
			'/v2/all-channels'
		)

		farcasterGet.mockResolvedValueOnce({
			result: {
				channels: [
					{ id: 'dev' },
					{ id: 'dev' },
				],
			},
		})

		await expect(getAllChannels()).rejects.toThrow('duplicate channel id')
	})

	it('normalizes the documented wire URL to the FIP-2 parent URL', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: {
				channel: {
					id: 'design',
					name: 'Design',
					url: 'https://farcaster.xyz/~/channel/design',
				},
			},
		})

		await expect(getChannel('design')).resolves.toEqual({
			id: 'design',
			name: 'Design',
			parentUrl: 'https://farcaster.xyz/~/channel/design',
		})
		expect(farcasterGet).toHaveBeenLastCalledWith(
			'client-api',
			'/v1/channel',
			{ channelId: 'design' }
		)
	})

	it('preserves an explicit not-following viewer result', async () => {
		farcasterGet.mockResolvedValueOnce({ result: { following: false } })

		await expect(getUserChannelFollowStatus({
			fid: 3,
			channelId: 'design',
		})).resolves.toEqual({ following: false })
		expect(farcasterGet).toHaveBeenLastCalledWith(
			'client-api',
			'/v1/user-channel',
			{
				fid: 3,
				channelId: 'design',
			}
		)
	})

	it('keeps anonymous membership pagination free of viewer identity', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: { members: [] },
			next: { cursor: 'next+/=' },
		})

		await getChannelMembersPage({
			channelId: 'design',
			cursor: 'opaque+/=',
			limit: 100,
		})

		expect(farcasterGet).toHaveBeenLastCalledWith(
			'client-api',
			'/fc/channel-members',
			{
				channelId: 'design',
				fid: undefined,
				cursor: 'opaque+/=',
				limit: 100,
			}
		)
	})

	it('uses the endpoint FID filter for exact membership and rejects another subject', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: {
				members: [{
					fid: 3,
					memberAt: 1_712_685_183,
				}],
			},
		})

		await expect(getChannelMember({
			channelId: 'design',
			fid: 3,
		})).resolves.toEqual({
			fid: 3,
			memberAt: 1_712_685_183,
		})
		expect(farcasterGet).toHaveBeenLastCalledWith(
			'client-api',
			'/fc/channel-members',
			{
				channelId: 'design',
				fid: 3,
				cursor: undefined,
				limit: undefined,
			}
		)

		farcasterGet.mockResolvedValueOnce({
			result: {
				members: [{
					fid: 4,
					memberAt: 1_712_685_183,
				}],
			},
		})
		await expect(getChannelMember({
			channelId: 'design',
			fid: 3,
		})).rejects.toThrow('channel member subject mismatch')
	})
})

describe('Farcaster public thread endpoint', () => {
	beforeEach(() => {
		farcasterGet.mockReset()
	})

	it('returns the endpoint-native ordered thread response', async () => {
		const response = {
			result: {
				casts: [
					{
						hash: '0xF0CA1',
						author: { fid: 1 },
					},
					{
						hash: '0xD1RECT',
						parentHash: 'f0ca1',
						parentAuthor: { fid: 1 },
						author: { fid: 2 },
					},
					{
						hash: '0xGRAND',
						parentHash: '0xD1RECT',
						author: { fid: 3 },
					},
					{
						hash: '0xANCESTOR',
						author: { fid: 4 },
					},
					{
						parentHash: '0xF0CA1',
						parentAuthor: { fid: 1 },
					},
					{
						hash: '0xFOREIGN',
						parentHash: '0xF0CA1',
						parentAuthor: { fid: 99 },
						author: { fid: 5 },
					},
				],
			},
		}
		farcasterGet.mockResolvedValueOnce(response)

		await expect(getUserThreadCasts({
			username: 'alice',
			castHashPrefix: '0xf0ca1',
		})).resolves.toEqual(response)
		expect(farcasterGet).toHaveBeenCalledWith(
			'web-api',
			'/~api/v2/user-thread-casts',
			{
				username: 'alice',
				castHashPrefix: '0xf0ca1',
				limit: 15,
			}
		)
	})

	it('derives the exact public thread operation from a canonical cast client URL', async () => {
		const response = {
			result: {
				casts: [{
					hash: '0xABCDEF1234567890123456789012345678901234',
					author: {
						fid: 1,
						username: 'alice',
					},
				}],
			},
		}
		farcasterGet.mockResolvedValueOnce(response)

		await expect(getUserThreadCastsByClientUrl(
			'https://FARCASTER.XYZ/Alice/0xABCDEF12'
		)).resolves.toEqual({
			username: 'alice',
			castHashPrefix: '0xabcdef12',
			response,
		})
		expect(farcasterGet).toHaveBeenLastCalledWith(
			'web-api',
			'/~api/v2/user-thread-casts',
			{
				username: 'alice',
				castHashPrefix: '0xabcdef12',
				limit: 15,
			}
		)
	})

	it.each([
		'https://farcaster.xyz/~/conversations/0xabcdef1234567890123456789012345678901234',
		'https://farcaster.xyz.evil.example/alice/0xabcdef12',
		'https://user@farcaster.xyz/alice/0xabcdef12',
		'https://farcaster.xyz/alice/0xabcdef12?other=true',
	])('rejects unsupported client URL %s before transport', async (clientUrl) => {
		await expect(getUserThreadCastsByClientUrl(clientUrl)).rejects.toThrow(
			'unsupported cast client URL'
		)
		expect(farcasterGet).not.toHaveBeenCalled()
	})

	it('rejects a primary address for a different account or protocol', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: {
				address: {
					fid: 99,
					protocol: 'ethereum',
					address: '0x0000000000000000000000000000000000000001',
				},
			},
		})

		await expect(getPrimaryAddress({
			fid: 42,
		})).rejects.toThrow('primary address subject mismatch')
	})
})

describe('Farcaster envelope validation and materialization', () => {
	beforeEach(() => {
		farcasterGet.mockReset()
	})

	it('fails closed on malformed channel response envelopes', async () => {
		farcasterGet.mockResolvedValueOnce({ result: null })
		await expect(getAllChannels()).rejects.toThrow('Farcaster_Rest: invalid channels response envelope')

		farcasterGet.mockResolvedValueOnce({ result: { channel: 'not an object' } })
		await expect(getChannel('design')).rejects.toThrow('Farcaster_Rest: invalid channel response envelope')
	})

	it('fails closed on malformed primary address and thread cast envelopes', async () => {
		farcasterGet.mockResolvedValueOnce({ result: { address: 123 } })
		await expect(getPrimaryAddress({ fid: 3 })).rejects.toThrow('Farcaster_Rest: invalid primary-address response envelope')

		farcasterGet.mockResolvedValueOnce({ result: { casts: 'not an array' } })
		await expect(getUserThreadCasts({
			username: 'alice',
			castHashPrefix: '0x1234',
		})).rejects.toThrow('Farcaster_Rest: invalid user-thread-casts response envelope')
	})

	it('fails closed on malformed membership and follow status envelopes', async () => {
		farcasterGet.mockResolvedValueOnce({ result: { members: {} } })
		await expect(getChannelMembersPage({
			channelId: 'design',
		})).rejects.toThrow('Farcaster_Rest: invalid channel-members response envelope')

		farcasterGet.mockResolvedValueOnce({ result: { following: 'yes' } })
		await expect(getUserChannelFollowStatus({
			fid: 3,
			channelId: 'design',
		})).rejects.toThrow('Farcaster_Rest: invalid channel-follow-status response envelope')
	})

	it('materializes an exact channel and thread envelope', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: {
				channel: {
					id: 'design',
					name: 'Design',
					url: 'https://farcaster.xyz/~/channel/design',
				},
			},
		})

		await expect(getChannel('design')).resolves.toEqual({
			id: 'design',
			name: 'Design',
			parentUrl: 'https://farcaster.xyz/~/channel/design',
		})
		expect(farcasterGet).toHaveBeenCalledWith(
			'client-api',
			'/v1/channel',
			{ channelId: 'design' }
		)

		const response = {
			result: {
				casts: [
					{ hash: '0xF0CA1', author: { fid: 1 } },
				],
			},
		}
		farcasterGet.mockResolvedValueOnce(response)

		await expect(getUserThreadCasts({
			username: 'alice',
			castHashPrefix: '0xf0ca1',
		})).resolves.toEqual(response)
	})
})
