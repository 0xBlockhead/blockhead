import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const { getTimestampFromSequence } = vi.hoisted(() => ({
	getTimestampFromSequence: vi.fn(),
}))

vi.mock('$/sources/StellarExpert/Rest/queries.ts', () => ({
	getTimestampFromSequence,
}))

const { default: stellarExpertResolvers } = await import('$/resolvers/StellarExpert.ts')
const resolver = stellarExpertResolvers.resolvers[0]
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const ledger = {
	$network: {
		$network: {
			slug: 'stellar',
		},
	},
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

		const snapshot = await resolver.resolve.NetworkSequence.resolve(ledger, context)

		expect(resolver.projections.closeTimeMs(snapshot)).toBe(1_661_781_078_000)
		expect(getTimestampFromSequence).toHaveBeenCalledWith({
			network: 'public',
			sequence: 42_431_435,
		})
	})

	it('rejects unsupported networks and non-representable sequences before I/O', async () => {
		await expect(resolver.resolve.NetworkSequence.resolve({
			...ledger,
			$network: {
				$network: {
					slug: 'stellar-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		await expect(resolver.resolve.NetworkSequence.resolve({
			...ledger,
			sequence: 0n,
		}, context)).rejects.toThrow('positive safe integer')
		await expect(resolver.resolve.NetworkSequence.resolve({
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
			resolver.resolve.NetworkSequence.resolve(ledger, context)
		).rejects.toThrow(message)
	})
})
