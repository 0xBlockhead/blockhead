import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/BeaconchaIn/bindings.ts'
import { bindingByChainId } from '$/sources/BeaconchaIn/Rest/constants.ts'
import {
	getEpoch,
	getEpochSlots,
	getSlot,
	getSlotAttestations,
	getSlotAttesterSlashings,
	getSlotProposerSlashings,
	getSlotWithdrawals,
	getValidator,
} from '$/sources/BeaconchaIn/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const ethereumBinding = bindings[Source.BeaconchaIn_Rest].find((binding) => (
	binding.target.key === '1'
))

if (ethereumBinding == null)
	throw new Error('BeaconchaIn REST binding missing for chain 1')

if (bindingByChainId['1'] !== ethereumBinding)
	throw new Error('BeaconchaIn constants bindingByChainId drifted from bindings')

const publicEnv = {
	PUBLIC_BEACONCHAIN_API_KEY: 'test-api-key',
}

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), { status })
)

const epochWire = {
	epoch: 300000,
	ts: '2023-01-01T00:00:00Z',
	finalized: true,
	validatorscount: 500000,
	averagevalidatorbalance: 32000000000,
	totalvalidatorbalance: 16000000000000000,
	globalparticipationrate: 0.99,
	eligibleether: 15000000000000000,
	votedether: 14850000000000000,
	blockscount: 32,
	proposedblocks: 31,
	missedblocks: 1,
	orphanedblocks: 0,
	scheduledblocks: 0,
	attestationscount: 4000,
	attesterslashingscount: 0,
	proposerslashingscount: 0,
	depositscount: 0,
	withdrawalcount: 16,
	voluntaryexitscount: 0,
	rewards_exported: true,
}

const slotWire = {
	slot: 9600000,
	epoch: 300000,
	blockroot: '0x' + '11'.repeat(32),
	parentroot: '0x' + '22'.repeat(32),
	stateroot: '0x' + '33'.repeat(32),
	signature: '0x' + '44'.repeat(96),
	proposer: 42,
	status: '1',
}

const validatorWire = {
	validator_index: 1,
	pubkey: '0x' + 'aa'.repeat(48),
	balance: 32000000000,
	effective_balance: 32000000000,
	status: 'active_online',
	slashed: false,
}

describe('BeaconchaIn REST queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes epoch through the HttpProxy binding with V1 apikey auth', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			status: 'OK',
			data: epochWire,
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getEpoch(publicEnv, {
			chainId: 1,
			epoch: 300000,
		})).resolves.toEqual(epochWire)

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/^\/api-proxy\/.+\/0\/https%3A%2F%2Fbeaconcha\.in%2Fapi%2Fv1%2Fepoch%2F300000$/),
			expect.objectContaining({
				headers: expect.objectContaining({
					apikey: 'test-api-key',
				}),
			})
		)
	})

	it('hard-fails missing epoch data instead of soft-empty', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			status: 'OK',
			data: null,
		})))
		vi.stubGlobal('window', {})

		await expect(getEpoch(publicEnv, {
			chainId: 1,
			epoch: 'latest',
		})).rejects.toThrow('returned no data')
	})

	it('hard-fails non-OK wire status even when HTTP is 200', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			status: 'ERROR: rate limited',
			data: null,
		})))
		vi.stubGlobal('window', {})

		await expect(getSlot(publicEnv, {
			chainId: 1,
			slot: 'head',
		})).rejects.toThrow('failed (status ERROR: rate limited)')
	})

	it('hard-fails HTTP errors for slot and validator', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({ status: 'ERROR: boom', data: null }, 500))
			.mockResolvedValueOnce(jsonResponse({ status: 'ERROR: boom', data: null }, 404)))
		vi.stubGlobal('window', {})

		await expect(getSlot(publicEnv, {
			chainId: 1,
			slot: 1,
		})).rejects.toThrow('500')

		await expect(getValidator(publicEnv, {
			chainId: 1,
			indexOrPubkey: 1,
		})).rejects.toThrow('404')
	})

	it('returns successful empty epoch slot lists as []', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			status: 'OK',
			data: [],
		})))
		vi.stubGlobal('window', {})

		await expect(getEpochSlots(publicEnv, {
			chainId: 1,
			epoch: 300000,
		})).resolves.toEqual([])
	})

	it('loads epoch slots and validator payloads', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: [slotWire],
			}))
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: validatorWire,
			})))
		vi.stubGlobal('window', {})

		await expect(getEpochSlots(publicEnv, {
			chainId: 1,
			epoch: 300000,
		})).resolves.toEqual([slotWire])

		await expect(getValidator(publicEnv, {
			chainId: 1,
			indexOrPubkey: 1,
		})).resolves.toEqual(validatorWire)
	})

	it('rejects unbound chains', async () => {
		await expect(getEpoch(publicEnv, {
			chainId: 999,
			epoch: 1,
		})).rejects.toThrow('no binding for chain 999')
	})

	it('loads slot duty lists and hard-fails null duty payloads', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: [{
					aggregationbits: '0xff',
					block_index: 0,
					committeeindex: 1,
					slot: 9599999,
					block_slot: 9600000,
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: [{
					address: '0x' + 'bb'.repeat(20),
					amount: 1,
					block_slot: 9600000,
					validatorindex: 7,
					withdrawalindex: 99,
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				status: 'OK',
				data: null,
			}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getSlotAttestations(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).resolves.toEqual([{
			aggregationbits: '0xff',
			block_index: 0,
			committeeindex: 1,
			slot: 9599999,
			block_slot: 9600000,
		}])
		await expect(getSlotWithdrawals(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).resolves.toHaveLength(1)
		await expect(getSlotAttesterSlashings(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).resolves.toEqual([])
		await expect(getSlotProposerSlashings(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).resolves.toEqual([])
		await expect(getSlotWithdrawals(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).rejects.toThrow('returned no data')
	})

	it('hard-fails non-list duty payloads', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			status: 'OK',
			data: {
				aggregationbits: '0xff',
			},
		})))
		vi.stubGlobal('window', {})

		await expect(getSlotAttestations(publicEnv, {
			chainId: 1,
			slot: 9600000,
		})).rejects.toThrow('returned a non-list payload')
	})
})
