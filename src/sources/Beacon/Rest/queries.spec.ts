import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import * as sourceHttp from '$/sources/_runtime/http.ts'
import {
	getCommitteesFromWire,
	getFinalityCheckpointsFromWire,
	getForkScheduleFromWire,
	getGenesisTimeSeconds,
	getHeadSlot,
	getHeaderFromWire,
	getNodePeerCountFromWire,
	getNodePeerCountObservation,
	getNodeIdentityFromWire,
	getNodeIdentityObservation,
	getNodeHealthObservation,
	getNodeVersionObservation,
	getNodeSyncingFromWire,
	getNodeSyncingObservation,
	getSyncCommitteeFromWire,
	getValidator,
	getValidatorAtHead,
	getValidatorEnvelopeFromWire,
	getValidatorFromWire,
} from '$/sources/Beacon/Rest/queries.ts'
import bindings from '$/sources/Beacon/bindings.ts'
import { Source } from '$/sources/Source.ts'

afterEach(() => {
	vi.restoreAllMocks()
})

describe('Beacon REST native checkpoint and fork wires', () => {
	it('preserves native finality checkpoint keys and decimal strings', () => {
		expect(getFinalityCheckpointsFromWire({
			data: {
				previous_justified: {
					epoch: '100',
					root: `0x${'AA'.repeat(32)}`,
				},
				current_justified: {
					epoch: '101',
					root: `0x${'CC'.repeat(32)}`,
				},
				finalized: {
					epoch: '99',
					root: `0x${'EE'.repeat(32)}`,
				},
			},
			execution_optimistic: false,
			finalized: true,
		})).toEqual({
			previous_justified: {
				epoch: '100',
				root: `0x${'AA'.repeat(32)}`,
			},
			current_justified: {
				epoch: '101',
				root: `0x${'CC'.repeat(32)}`,
			},
			finalized: {
				epoch: '99',
				root: `0x${'EE'.repeat(32)}`,
			},
		})
	})

	it('rejects non-canonical roots and unsafe epoch identities', () => {
		const checkpoint = {
			epoch: '100',
			root: `0x${'11'.repeat(32)}`,
		}

		expect(getFinalityCheckpointsFromWire({
			data: {
				previous_justified: checkpoint,
				current_justified: {
					...checkpoint,
					root: '0x1234',
				},
				finalized: checkpoint,
			},
		})).toBeUndefined()
		expect(getFinalityCheckpointsFromWire({
			data: {
				previous_justified: checkpoint,
				current_justified: checkpoint,
				finalized: {
					...checkpoint,
					epoch: '9007199254740992',
				},
			},
		})).toBeUndefined()
	})

	it('preserves native fork schedule ordering and fields without canonical conversion', () => {
		expect(getForkScheduleFromWire({
			data: [
				{
					epoch: '0',
					previous_version: '0x00000000',
					current_version: '0xAABBCCDD',
				},
				{
					epoch: '100',
					previous_version: '0xAABBCCDD',
					current_version: '0xEEFF0011',
				},
			],
		})).toEqual([
			{
				epoch: '0',
				previous_version: '0x00000000',
				current_version: '0xAABBCCDD',
			},
			{
				epoch: '100',
				previous_version: '0xAABBCCDD',
				current_version: '0xEEFF0011',
			},
		])
	})

	it('rejects malformed checkpoints and skips malformed or legacy fork rows', () => {
		expect(getFinalityCheckpointsFromWire({
			data: {
				previous_justified: {
					epoch: 100,
					root: '0xAABB',
				},
				current_justified: {
					epoch: '101',
					root: '0xCCDD',
				},
				finalized: {
					epoch: '99',
					root: '0xEEFF',
				},
			},
		})).toBeUndefined()
		expect(getForkScheduleFromWire({
			data: [
				{
					epoch: 'one',
					previous_version: '0x00000000',
					current_version: '0xAABBCCDD',
				},
				{
					epoch: '100',
					previousVersion: '0xAABBCCDD',
					currentVersion: '0xEEFF0011',
				},
			],
		})).toEqual([])
	})
})

describe('Beacon REST native header wire', () => {
	const header = {
		root: `0x${'A'.repeat(64)}`,
		canonical: true,
		header: {
			message: {
				slot: '64',
				proposer_index: '12',
				parent_root: `0x${'B'.repeat(64)}`,
				state_root: `0x${'C'.repeat(64)}`,
				body_root: `0x${'D'.repeat(64)}`,
			},
			signature: `0x${'E'.repeat(192)}`,
		},
	}

	it('preserves the complete native header row, decimal strings, keys, and case', () => {
		expect(getHeaderFromWire({
			data: header,
			execution_optimistic: false,
			finalized: true,
		})).toEqual(header)
		expect(getHeaderFromWire({
			data: {
				...header,
				header: {
					...header.header,
					message: {
						...header.header.message,
						proposer_index: '18446744073709551615',
					},
				},
			},
		})?.header.message.proposer_index).toBe('18446744073709551615')
	})

	it('rejects partial rows, malformed uint64 values, and invalid protocol hex sizes', () => {
		expect(getHeaderFromWire({
			data: {
				root: header.root,
				header: header.header,
			},
		})).toBeUndefined()
		expect(getHeaderFromWire({
			data: {
				...header,
				header: {
					...header.header,
					message: {
						...header.header.message,
						proposer_index: '12x',
					},
				},
			},
		})).toBeUndefined()
		expect(getHeaderFromWire({
			data: {
				...header,
				root: '0x1234',
			},
		})).toBeUndefined()
		expect(getHeaderFromWire({
			data: {
				...header,
				header: {
					...header.header,
					signature: `0x${'E'.repeat(190)}`,
				},
			},
		})).toBeUndefined()
	})
})

describe('Beacon REST native scalar clocks', () => {
	it('preserves native node peer counts and timestamps only a valid response', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				disconnected: '12',
				connecting: '34',
				connected: '56',
				disconnecting: '5',
			},
		})))

		await expect(getNodePeerCountObservation(1)).resolves.toEqual({
			disconnected: '12',
			connecting: '34',
			connected: '56',
			disconnecting: '5',
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_700_000_000_123,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			'https://ethereum-beacon-api.publicnode.com/eth/v1/node/peer_count',
			{ headers: { accept: 'application/json' } }
		)
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('rejects malformed node peer counts before assigning a fetched-at clock', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				disconnected: '12',
				connecting: '34',
				connected: '18446744073709551616',
				disconnecting: '5',
			},
		})))

		await expect(getNodePeerCountObservation(1)).rejects.toThrow('invalid node peer_count response')
		expect(dateNow).not.toHaveBeenCalled()
		expect(getNodePeerCountFromWire({
			data: {
				disconnected: '12',
				connecting: '34',
				connected: '56',
			},
		})).toBeUndefined()
	})

	it('preserves one complete native node identity snapshot', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_321)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				peer_id: '16Uiu2HAmExample',
				enr: 'enr:-example',
				p2p_addresses: ['/ip4/127.0.0.1/tcp/9000/p2p/16Uiu2HAmExample'],
				discovery_addresses: ['/ip4/127.0.0.1/udp/9000/p2p/16Uiu2HAmExample'],
				metadata: {
					seq_number: '18446744073709551615',
					attnets: '0x0000000000000000',
					syncnets: '0x0f',
					custody_group_count: '128',
				},
			},
		})))

		await expect(getNodeIdentityObservation(1)).resolves.toEqual({
			peer_id: '16Uiu2HAmExample',
			enr: 'enr:-example',
			p2p_addresses: ['/ip4/127.0.0.1/tcp/9000/p2p/16Uiu2HAmExample'],
			discovery_addresses: ['/ip4/127.0.0.1/udp/9000/p2p/16Uiu2HAmExample'],
			metadata: {
				seq_number: '18446744073709551615',
				attnets: '0x0000000000000000',
				syncnets: '0x0f',
				custody_group_count: '128',
			},
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_700_000_000_321,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			'https://ethereum-beacon-api.publicnode.com/eth/v1/node/identity',
			{ headers: { accept: 'application/json' } }
		)
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('rejects invalid node identity metadata before assigning a fetched-at clock', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				peer_id: '16Uiu2HAmExample',
				enr: 'enr:-example',
				p2p_addresses: [],
				discovery_addresses: [],
				metadata: {
					seq_number: '1',
					attnets: 'not-hex',
				},
			},
		})))

		await expect(getNodeIdentityObservation(1)).rejects.toThrow('invalid node identity response')
		expect(dateNow).not.toHaveBeenCalled()
		expect(getNodeIdentityFromWire({
			data: {
				peer_id: '16Uiu2HAmExample',
				enr: 'enr:-example',
				p2p_addresses: [],
				discovery_addresses: [],
				metadata: {
					seq_number: '18446744073709551616',
					attnets: '0x00',
				},
			},
		})).toBeUndefined()
	})

	it.each([
		200,
		206,
		503,
	] as const)('preserves native node health status %i as the complete response fact', async (statusCode) => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_350)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(null, {
			status: statusCode,
		}))

		await expect(getNodeHealthObservation(1)).resolves.toEqual({
			statusCode,
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_700_000_000_350,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			'https://ethereum-beacon-api.publicnode.com/eth/v1/node/health',
			{ headers: { accept: 'application/json' } }
		)
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('rejects a status outside the Beacon health contract before assigning a fetched-at clock', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(null, {
			status: 418,
			statusText: 'Teapot',
		}))

		await expect(getNodeHealthObservation(1)).rejects.toThrow()
		expect(dateNow).not.toHaveBeenCalled()
	})

	it('preserves the implementation-owned node version string without parsing labels', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_400)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				version: 'Lighthouse/v8.2.1-b263df5/x86_64-linux',
			},
		})))

		await expect(getNodeVersionObservation(1)).resolves.toEqual({
			version: 'Lighthouse/v8.2.1-b263df5/x86_64-linux',
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_700_000_000_400,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			'https://ethereum-beacon-api.publicnode.com/eth/v1/node/version',
			{ headers: { accept: 'application/json' } }
		)
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('rejects an empty node version before assigning a fetched-at clock', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				version: '',
			},
		})))

		await expect(getNodeVersionObservation(1)).rejects.toThrow('invalid node version response')
		expect(dateNow).not.toHaveBeenCalled()
	})

	it('preserves native node sync coordinates and readiness flags in one snapshot', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_456)
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				head_slot: '18446744073709551615',
				sync_distance: '12',
				is_syncing: true,
				is_optimistic: true,
				el_offline: false,
			},
		})))

		await expect(getNodeSyncingObservation(1)).resolves.toEqual({
			head_slot: '18446744073709551615',
			sync_distance: '12',
			is_syncing: true,
			is_optimistic: true,
			el_offline: false,
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_700_000_000_456,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			'https://ethereum-beacon-api.publicnode.com/eth/v1/node/syncing',
			{ headers: { accept: 'application/json' } }
		)
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('rejects partial or malformed node sync rows before assigning a fetched-at clock', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				head_slot: '128',
				sync_distance: '-1',
				is_syncing: true,
				is_optimistic: false,
				el_offline: false,
			},
		})))

		await expect(getNodeSyncingObservation(1)).rejects.toThrow('invalid node syncing response')
		expect(dateNow).not.toHaveBeenCalled()
		expect(getNodeSyncingFromWire({
			data: {
				head_slot: '128',
				sync_distance: '0',
				is_syncing: false,
				is_optimistic: false,
			},
		})).toBeUndefined()
	})

	it('preserves the head slot decimal string until a numeric consumer boundary', async () => {
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				root: `0x${'A'.repeat(64)}`,
				canonical: true,
				header: {
					message: {
						slot: '18446744073709551615',
						proposer_index: '12',
						parent_root: `0x${'B'.repeat(64)}`,
						state_root: `0x${'C'.repeat(64)}`,
						body_root: `0x${'D'.repeat(64)}`,
					},
					signature: `0x${'E'.repeat(192)}`,
				},
			},
		})))

		await expect(getHeadSlot(1)).resolves.toBe('18446744073709551615')
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Beacon_Rest][0],
			`${bindings[Source.Beacon_Rest][0].endpoints[0].locator}/eth/v1/beacon/headers/head`,
			{
				headers: { accept: 'application/json' },
			}
		)
	})

	it('preserves a complete validated genesis uint64 clock as its native decimal string', async () => {
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				genesis_time: '18446744073709551615',
				genesis_validators_root: `0x${'A'.repeat(64)}`,
				genesis_fork_version: '0xAABBCCDD',
			},
		})))

		await expect(getGenesisTimeSeconds(1)).resolves.toBe('18446744073709551615')
	})

	it('rejects genesis uint64 overflow and partial protocol rows', async () => {
		vi.spyOn(sourceHttp, 'sourceFetch')
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					genesis_time: '18446744073709551616',
					genesis_validators_root: `0x${'A'.repeat(64)}`,
					genesis_fork_version: '0xAABBCCDD',
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					genesis_time: '1',
				},
			})))

		await expect(getGenesisTimeSeconds(1)).resolves.toBeUndefined()
		await expect(getGenesisTimeSeconds(1)).resolves.toBeUndefined()
	})
})

describe('Beacon REST native committee wires', () => {
	it('preserves committee decimal strings and native membership keys', () => {
		expect(getCommitteesFromWire({
			data: [
				{
					index: '1',
					slot: '64',
					validators: [
						'2',
						'3',
					],
				},
			],
		})).toEqual([
			{
				index: '1',
				slot: '64',
				validators: [
					'2',
					'3',
				],
			},
		])
	})

	it('preserves sync committee members and native aggregate groups', () => {
		expect(getSyncCommitteeFromWire({
			data: {
				validators: [
					'4',
					'5',
				],
				validator_aggregates: [
					['4'],
					['5'],
				],
			},
		})).toEqual({
			validators: [
				'4',
				'5',
			],
			validator_aggregates: [
				['4'],
				['5'],
			],
		})
	})

	it('requests historical sync committees by state id and optional epoch', async () => {
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				validators: ['4'],
				validator_aggregates: [['4']],
			},
			execution_optimistic: false,
			finalized: true,
		})))
		const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')

		await expect(getSyncCommittee(
			1,
			16384,
			512
		)).resolves.toEqual({
			validators: ['4'],
			validator_aggregates: [['4']],
		})
		expect(String(sourceFetch.mock.calls[0]?.[1])).toContain(
			'/eth/v1/beacon/states/16384/sync_committees?epoch=512'
		)
	})

	it('rejects non-decimal, partial, and unsafe committee indices', () => {
		expect(getCommitteesFromWire({
			data: [
				{
					index: '1',
					slot: '64',
					validators: ['2x'],
				},
				{
					index: '9007199254740992',
					slot: '64',
					validators: ['2'],
				},
			],
		})).toEqual([])
		expect(getSyncCommitteeFromWire({
			data: {
				validators: ['4'],
				validator_aggregates: [
					['5.5'],
				],
			},
		})).toBeUndefined()
	})
})

describe('Beacon REST native validator wire', () => {
	const validator = {
		index: '12',
		balance: '32000000001',
		status: 'active_ongoing',
		validator: {
			pubkey: `0x${'A'.repeat(96)}`,
			withdrawal_credentials: `0x${'B'.repeat(64)}`,
			effective_balance: '32000000000',
			slashed: false,
			activation_eligibility_epoch: '10',
			activation_epoch: '11',
			exit_epoch: '18446744073709551615',
			withdrawable_epoch: '18446744073709551615',
		},
	}

	it('preserves the complete OpenAPI validator row and decimal strings', () => {
		expect(getValidatorFromWire({
			data: validator,
			execution_optimistic: false,
			finalized: true,
		})).toEqual(validator)
		expect(getValidatorEnvelopeFromWire({
			data: validator,
			execution_optimistic: false,
			finalized: true,
		})).toEqual({
			validator,
			executionOptimistic: false,
			finalized: true,
		})
	})

	it('rejects missing effective balance, malformed pubkeys, and uint64 overflow', () => {
		expect(getValidatorFromWire({
			data: {
				...validator,
				validator: {
					pubkey: validator.validator.pubkey,
					withdrawal_credentials: validator.validator.withdrawal_credentials,
					slashed: validator.validator.slashed,
					activation_eligibility_epoch: validator.validator.activation_eligibility_epoch,
					activation_epoch: validator.validator.activation_epoch,
					exit_epoch: validator.validator.exit_epoch,
					withdrawable_epoch: validator.validator.withdrawable_epoch,
				},
			},
		})).toBeUndefined()
		expect(getValidatorFromWire({
			data: {
				...validator,
				validator: {
					...validator.validator,
					pubkey: '0x1234',
				},
			},
		})).toBeUndefined()
		expect(getValidatorFromWire({
			data: {
				...validator,
				balance: '18446744073709551616',
			},
		})).toBeUndefined()
		expect(getValidatorEnvelopeFromWire({
			data: validator,
			execution_optimistic: 'false',
			finalized: true,
		})).toBeUndefined()
	})

	it('rejects a native validator row for a different requested index', async () => {
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				...validator,
				index: '13',
			},
			execution_optimistic: false,
			finalized: true,
		})))

		await expect(getValidatorAtHead(
			1,
			12
		)).rejects.toThrow('does not match the subject')
	})

	it('looks up validators by pubkey against a historical state id', async () => {
		const sourceFetch = vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: validator,
			execution_optimistic: true,
			finalized: false,
		})))

		await expect(getValidator(
			1,
			`0x${'a'.repeat(96)}`,
			8192
		)).resolves.toEqual({
			validator,
			executionOptimistic: true,
			finalized: false,
		})
		expect(String(sourceFetch.mock.calls[0]?.[1])).toContain(
			`/eth/v1/beacon/states/8192/validators/0x${'a'.repeat(96)}`
		)
	})

	it('rejects a native validator row for a different requested pubkey', async () => {
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: validator,
			execution_optimistic: false,
			finalized: true,
		})))

		await expect(getValidator(
			1,
			`0x${'b'.repeat(96)}`,
			'head'
		)).rejects.toThrow('does not match the subject')
	})
})
