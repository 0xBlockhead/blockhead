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
	getSyncCommitteeFromWire,
	getValidatorAtHead,
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
			execution_optimistic: false,
			finalized: true,
		})).toEqual({
			previous_justified: {
				epoch: '100',
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
		})
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
	})

	it('rejects a native validator row for a different requested index', async () => {
		vi.spyOn(sourceHttp, 'sourceFetch').mockResolvedValue(new Response(JSON.stringify({
			data: {
				...validator,
				index: '13',
			},
		})))

		await expect(getValidatorAtHead(
			1,
			12
		)).rejects.toThrow('does not match the subject')
	})
})
