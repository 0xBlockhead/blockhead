import { beforeEach, describe, expect, it, vi } from 'vitest'
import { print } from 'graphql'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Sui/bindings.ts'

const executeSui = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Sui/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Sui/Graphql/client.ts')>(),
	executeSui,
}))

const {
	getAddressBalances,
	getAddressObjects,
	getAddressTransactions,
	getCheckpointByDigest,
	getCheckpointBySequence,
	getCoinMetadata,
	getLatestCheckpoint,
	getObject,
	getPackage,
	getRecentTransactions,
	getTransaction,
} = await import('$/sources/Sui/Graphql/queries.ts')

const binding = bindings[Source.Sui].find(
	({ apiFamily }) => apiFamily === ApiFamily.GraphqlHttp
)

if (binding == null)
	throw new Error('Sui GraphQL spec missing GraphQL binding')

const address = `0x${'1'.repeat(64)}`
const pageInfo = {
	hasNextPage: true,
	endCursor: 'next-cursor',
}

describe('Sui GraphQL account portfolio queries', () => {
	beforeEach(() => {
		executeSui.mockReset()
	})

	it('queries complete owned balances through the existing RemoteQuery binding', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address,
				balances: {
					pageInfo,
					nodes: [{
						coinType: {
							repr: '0x2::sui::SUI',
						},
						totalBalance: '123',
						coinBalance: '100',
						addressBalance: '23',
					}],
				},
			},
		})

		await expect(getAddressBalances({
			address,
			limit: 10,
			after: 'current-cursor',
		})).resolves.toEqual({
			balances: [{
				coinType: {
					repr: '0x2::sui::SUI',
				},
				totalBalance: '123',
				coinBalance: '100',
				addressBalance: '23',
			}],
			pagination: {
				limit: 10,
				after: 'current-cursor',
				nextAfter: 'next-cursor',
			},
		})
		expect(binding).toMatchObject({
			target: {
				kind: SourceTargetKind.NetworkSlug,
				key: 'sui',
			},
			delivery: SourceDelivery.RemoteQuery,
		})
		expect(executeSui.mock.calls[0][0]).toBe(binding)
		expect(executeSui.mock.calls[0][2]).toEqual({
			address,
			first: 10,
			after: 'current-cursor',
		})
		expect(print(executeSui.mock.calls[0][1])).toContain('balances(first: $first, after: $after)')
	})

	it('queries affected-address activity with lossless digest and cursor identities', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address,
			},
			transactions: {
				pageInfo,
				nodes: [{
					digest: 'TransactionDigest',
					sender: {
						address,
					},
				}],
			},
		})

		await expect(getAddressTransactions({
			address,
			limit: 1,
		})).resolves.toEqual({
			transactions: [{
				digest: 'TransactionDigest',
				sender: {
					address,
				},
			}],
			pagination: {
				limit: 1,
				nextAfter: 'next-cursor',
			},
		})
		expect(executeSui.mock.calls[0][2]).toEqual({
			address,
			first: 1,
		})
		expect(print(executeSui.mock.calls[0][1])).toContain('filter: {affectedAddress: $address}')
	})

	it('normalizes shorthand addresses to the canonical GraphQL identity', async () => {
		const canonicalAddress = `0x${'0'.repeat(63)}2`
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
				balances: {
					pageInfo: {
						hasNextPage: false,
						endCursor: null,
					},
					nodes: [],
				},
			},
		})

		await expect(getAddressBalances({
			address: '0x2',
			limit: 1,
		})).resolves.toMatchObject({
			balances: [],
		})
		expect(executeSui.mock.calls[0][2]).toEqual({
			address: canonicalAddress,
			first: 1,
		})
	})

	it('fails closed on mismatched subjects, malformed rows, and broken pagination', async () => {
		const balanceFailures = [
			{
				address: {
					address: `0x${'2'.repeat(64)}`,
					balances: {
						pageInfo,
						nodes: [],
					},
				},
			},
			{
				address: {
					address,
					balances: {
						pageInfo,
						nodes: [{
							coinType: {
								repr: '',
							},
							totalBalance: '1',
							coinBalance: '1',
							addressBalance: '0',
						}],
					},
				},
			},
			{
				address: {
					address,
					balances: {
						pageInfo,
						nodes: [{
							coinType: {
								repr: '0x2::sui::SUI',
							},
							totalBalance: 'not-an-integer',
							coinBalance: '1',
							addressBalance: '0',
						}],
					},
				},
			},
		]
		for (const payload of balanceFailures) {
			executeSui.mockResolvedValueOnce(payload)
			await expect(getAddressBalances({
				address,
				limit: 2,
			})).rejects.toThrow()
		}

		for (const payload of [
			{
				address: {
					address,
				},
				transactions: {
					pageInfo,
					nodes: [
						{
							digest: 'duplicate',
							sender: null,
						},
						{
							digest: 'duplicate',
							sender: null,
						},
					],
				},
			},
			{
				address: {
					address,
				},
				transactions: {
					pageInfo: {
						hasNextPage: true,
						endCursor: null,
					},
					nodes: [],
				},
			},
		]) {
			executeSui.mockResolvedValueOnce(payload)
			await expect(getAddressTransactions({
				address,
				limit: 2,
			})).rejects.toThrow()
		}

		executeSui.mockResolvedValueOnce({
			address: {
				address,
			},
			transactions: {
				pageInfo: {
					hasNextPage: true,
					endCursor: 'current-cursor',
				},
				nodes: [],
			},
		})
		await expect(getAddressTransactions({
			address,
			limit: 2,
			after: 'current-cursor',
		})).rejects.toThrow('did not advance')
	})

	it('bounds requests and performs no transport for zero limits', async () => {
		for (const request of [
			{ address: '', limit: 1 },
			{ address: '0xz', limit: 1 },
			{ address: `0x${'1'.repeat(65)}`, limit: 1 },
			{ address, limit: -1 },
			{ address, limit: 51 },
			{ address, limit: 0.5 },
			{ address, limit: 1, after: '' },
		])
			await expect(getAddressBalances(request)).rejects.toThrow()

		await expect(getAddressTransactions({
			address,
			limit: 0,
			after: 'cursor',
		})).resolves.toEqual({
			transactions: [],
			pagination: {
				limit: 0,
				after: 'cursor',
			},
		})
		expect(executeSui).not.toHaveBeenCalled()
	})
})

const tipCheckpoint = {
	sequenceNumber: 100,
	digest: 'CheckpointDigest',
	previousCheckpointDigest: 'PreviousDigest',
	timestamp: '2026-08-06T12:00:00.000Z',
	networkTotalTransactions: 1_000,
	epoch: {
		epochId: 42,
		protocolConfigs: {
			protocolVersion: 88,
		},
	},
}

describe('Sui GraphQL checkpoint and transaction queries', () => {
	beforeEach(() => {
		executeSui.mockReset()
	})

	it('normalizes latest / by-sequence / by-digest checkpoints', async () => {
		executeSui
			.mockResolvedValueOnce({
				checkpoint: tipCheckpoint,
			})
			.mockResolvedValueOnce({
				checkpoint: tipCheckpoint,
			})
			.mockResolvedValueOnce({
				checkpoint: tipCheckpoint,
			})

		await expect(getLatestCheckpoint()).resolves.toEqual({
			sequence: 100n,
			digest: 'CheckpointDigest',
			previousDigest: 'PreviousDigest',
			timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
			totalTransactionCount: 1000n,
			epoch: 42n,
			protocolVersion: 88n,
		})
		await expect(getCheckpointBySequence(100n)).resolves.toMatchObject({
			sequence: 100n,
			digest: 'CheckpointDigest',
		})
		await expect(getCheckpointByDigest('CheckpointDigest')).resolves.toMatchObject({
			sequence: 100n,
		})
		expect(executeSui.mock.calls[1][2]).toEqual({
			sequenceNumber: '100',
		})
		expect(print(executeSui.mock.calls[0][1])).toContain('checkpoint {')
		expect(print(executeSui.mock.calls[2][1])).toContain('checkpoint(digest: $digest)')
	})

	it('lists recent network transactions with pagination', async () => {
		executeSui.mockResolvedValueOnce({
			transactions: {
				pageInfo,
				nodes: [{
					digest: 'TransactionDigest',
					sender: {
						address: '0x2',
					},
				}],
			},
		})

		await expect(getRecentTransactions({
			limit: 1,
			after: 'cursor',
		})).resolves.toEqual({
			transactions: [{
				digest: 'TransactionDigest',
				sender: {
					address: `0x${'0'.repeat(63)}2`,
				},
			}],
			pagination: {
				limit: 1,
				after: 'cursor',
				nextAfter: 'next-cursor',
			},
		})
		expect(print(executeSui.mock.calls[0][1])).toContain('SuiRecentTransactions')
	})

	it('projects transaction identity, kind, gas, checkpoint effects, and nested facets', async () => {
		executeSui.mockResolvedValueOnce({
			transaction: {
				digest: 'TransactionDigest',
				sender: {
					address: '0x2',
				},
				kind: {
					__typename: 'ProgrammableTransaction',
					commands: {
						nodes: [
							{
								__typename: 'MoveCallCommand',
								function: {
									name: 'transfer',
									module: {
										name: 'pay',
										package: {
											address: '0x2',
										},
									},
								},
								arguments: [
									{
										__typename: 'Input',
										ix: 0,
									},
									{
										__typename: 'GasCoin',
										_: true,
									},
								],
							},
							{
								__typename: 'TransferObjectsCommand',
								inputs: [
									{
										__typename: 'TxResult',
										cmd: 0,
										ix: 0,
									},
								],
								address: {
									__typename: 'Input',
									ix: 1,
								},
							},
						],
					},
				},
				gasInput: {
					gasBudget: '1000',
					gasPrice: '1000',
				},
				effects: {
					status: 'SUCCESS',
					effectsDigest: 'EffectsDigest',
					timestamp: '2026-08-06T12:00:00.000Z',
					gasEffects: {
						gasSummary: {
							computationCost: 10,
							storageCost: 20,
							storageRebate: 5,
							nonRefundableStorageFee: 1,
						},
					},
					checkpoint: {
						sequenceNumber: 100,
					},
					balanceChanges: {
						nodes: [{
							owner: {
								address: '0x2',
							},
							coinType: {
								repr: '0x2::sui::SUI',
							},
							amount: '-100',
						}],
					},
					objectChanges: {
						nodes: [{
							address: '0xabc',
							idCreated: true,
							idDeleted: false,
							outputState: {
								version: 1,
								digest: 'ObjectDigest',
								asMoveObject: {
									contents: {
										type: {
											repr: '0x2::coin::Coin<0x2::sui::SUI>',
										},
									},
								},
								owner: {
									__typename: 'AddressOwner',
									address: {
										address: '0x2',
									},
								},
							},
						}],
					},
					events: {
						nodes: [{
							sequenceNumber: 0,
							sender: {
								address: '0x2',
							},
							contents: {
								type: {
									repr: '0x2::coin::TransferEvent',
								},
								json: {
									amount: '1',
								},
							},
							transactionModule: {
								name: 'pay',
								package: {
									address: '0x2',
								},
							},
						}],
					},
				},
			},
		})

		await expect(getTransaction('TransactionDigest')).resolves.toEqual({
			digest: 'TransactionDigest',
			sender: `0x${'0'.repeat(63)}2`,
			transactionKind: 'ProgrammableTransaction',
			checkpointSequence: 100n,
			status: 'SUCCESS',
			effectsDigest: 'EffectsDigest',
			timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
			gasBudget: 1000n,
			gasPrice: 1000n,
			gasUsed: {
				computationCost: '10',
				storageCost: '20',
				storageRebate: '5',
				nonRefundableStorageFee: '1',
			},
			commands: [
				{
					commandIndex: 0,
					commandKind: 'MoveCallCommand',
					packageId: `0x${'0'.repeat(63)}2`,
					moduleName: 'pay',
					functionName: 'transfer',
					typeArguments: [],
					arguments: [
						{
							kind: 'Input',
							ix: 0,
						},
						{
							kind: 'GasCoin',
						},
					],
				},
				{
					commandIndex: 1,
					commandKind: 'TransferObjectsCommand',
					typeArguments: [],
					arguments: {
						inputs: [
							{
								kind: 'TxResult',
								cmd: 0,
								ix: 0,
							},
						],
						address: {
							kind: 'Input',
							ix: 1,
						},
					},
				},
			],
			balanceChanges: [{
				changeIndex: 0,
				ownerSelector: {
					kind: 'Address',
					address: `0x${'0'.repeat(63)}2`,
				},
				coinType: '0x2::sui::SUI',
				amountDelta: -100n,
			}],
			objectChanges: [{
				changeIndex: 0,
				changeKind: 'Created',
				objectId: `0x${'0'.repeat(61)}abc`,
				objectType: '0x2::coin::Coin<0x2::sui::SUI>',
				ownerSelector: {
					kind: 'AddressOwner',
					address: `0x${'0'.repeat(63)}2`,
				},
				version: 1n,
				digest: 'ObjectDigest',
			}],
			events: [{
				eventIndex: 0,
				eventType: '0x2::coin::TransferEvent',
				packageId: `0x${'0'.repeat(63)}2`,
				moduleName: 'pay',
				sender: `0x${'0'.repeat(63)}2`,
				value: {
					amount: '1',
				},
			}],
		})
		expect(print(executeSui.mock.calls[0][1])).toContain('balanceChanges')
		expect(print(executeSui.mock.calls[0][1])).toContain('objectChanges')
		expect(print(executeSui.mock.calls[0][1])).toContain('MoveCallCommand')
		expect(print(executeSui.mock.calls[0][1])).toContain('TransferObjectsCommand')
	})

	it('projects owned objects, object tip, coin metadata, and package modules', async () => {
		executeSui
			.mockResolvedValueOnce({
				address: {
					address: `0x${'0'.repeat(63)}2`,
					objects: {
						pageInfo,
						nodes: [{
							address: '0xabc',
							version: 3,
							digest: 'ObjectDigest',
							asMoveObject: {
								contents: {
									type: {
										repr: '0x2::coin::Coin<0x2::sui::SUI>',
									},
								},
							},
						}],
					},
				},
			})
			.mockResolvedValueOnce({
				object: {
					address: '0xabc',
					version: 3,
					digest: 'ObjectDigest',
					storageRebate: '9',
					previousTransaction: {
						digest: 'PrevDigest',
					},
					owner: {
						__typename: 'AddressOwner',
						address: {
							address: '0x2',
						},
					},
					asMoveObject: {
						contents: {
							type: {
								repr: '0x2::coin::Coin<0x2::sui::SUI>',
							},
							json: {
								balance: '1',
							},
						},
					},
					asMovePackage: null,
				},
			})
			.mockResolvedValueOnce({
				coinMetadata: {
					address: '0xabc',
					decimals: 9,
					symbol: 'SUI',
					name: 'Sui',
					description: 'Sui Coin',
					iconUrl: 'https://example.com/sui.png',
					regulatedState: 'REGULATED',
					allowGlobalPause: true,
					denyCap: {
						address: '0xdef',
						version: 4,
						digest: 'DenyCapDigest',
					},
				},
			})
			.mockResolvedValueOnce({
				package: {
					address: '0x2',
					version: 1,
					digest: 'PackageDigest',
					modules: {
						pageInfo,
						nodes: [{
							name: 'coin',
						}],
					},
				},
			})

		await expect(getAddressObjects({
			address: '0x2',
			limit: 1,
		})).resolves.toEqual({
			objects: [{
				objectId: `0x${'0'.repeat(61)}abc`,
				version: 3n,
				digest: 'ObjectDigest',
				objectType: '0x2::coin::Coin<0x2::sui::SUI>',
			}],
			pagination: {
				limit: 1,
				nextAfter: 'next-cursor',
			},
		})
		await expect(getObject('0xabc')).resolves.toEqual({
			objectId: `0x${'0'.repeat(61)}abc`,
			version: 3n,
			digest: 'ObjectDigest',
			ownerSelector: {
				kind: 'AddressOwner',
				address: `0x${'0'.repeat(63)}2`,
			},
			objectType: '0x2::coin::Coin<0x2::sui::SUI>',
			previousTransaction: 'PrevDigest',
			storageRebate: 9n,
			contents: {
				balance: '1',
			},
		})
		const fetchedAtMs = Date.now()
		vi.spyOn(Date, 'now').mockReturnValueOnce(fetchedAtMs)
		await expect(getCoinMetadata('0x2::sui::SUI')).resolves.toEqual({
			coinType: '0x2::sui::SUI',
			fetchedAtMs,
			metadataObjectId: `0x${'0'.repeat(61)}abc`,
			decimals: 9,
			symbol: 'SUI',
			name: 'Sui',
			description: 'Sui Coin',
			iconUrl: 'https://example.com/sui.png',
			regulatedState: 'REGULATED',
			allowGlobalPause: true,
			denyCap: {
				objectId: `0x${'0'.repeat(61)}def`,
				version: 4n,
				digest: 'DenyCapDigest',
			},
		})
		await expect(getPackage({
			packageId: '0x2',
			moduleLimit: 1,
		})).resolves.toEqual({
			packageId: `0x${'0'.repeat(63)}2`,
			version: 1n,
			digest: 'PackageDigest',
			moduleNames: [
				'coin',
			],
			modulePagination: {
				limit: 1,
				nextAfter: 'next-cursor',
			},
		})
		expect(executeSui.mock.calls[3][2]).toEqual({
			address: `0x${'0'.repeat(63)}2`,
			moduleFirst: 1,
		})
		expect(print(executeSui.mock.calls[2][1])).toContain('regulatedState')
		expect(print(executeSui.mock.calls[2][1])).toContain('allowGlobalPause')
		expect(print(executeSui.mock.calls[2][1])).toContain('denyCap')
	})

	it('fail-closes missing checkpoint digests, sequence mismatches, and incomplete transactions', async () => {
		executeSui
			.mockResolvedValueOnce({
				checkpoint: {
					...tipCheckpoint,
					digest: null,
				},
			})
			.mockResolvedValueOnce({
				checkpoint: {
					...tipCheckpoint,
					sequenceNumber: 99,
				},
			})
			.mockResolvedValueOnce({
				transaction: {
					digest: 'TransactionDigest',
					sender: null,
					kind: null,
					gasInput: null,
					effects: {
						status: 'SUCCESS',
						effectsDigest: null,
						timestamp: null,
						gasEffects: null,
						checkpoint: null,
					},
				},
			})
			.mockResolvedValueOnce({
				transaction: null,
			})

		await expect(getLatestCheckpoint()).rejects.toThrow('missing digest')
		await expect(getCheckpointBySequence(100n)).rejects.toThrow('sequence mismatch')
		await expect(getTransaction('TransactionDigest')).rejects.toThrow('missing checkpoint effects')
		await expect(getTransaction('TransactionDigest')).rejects.toThrow('was not found')
	})

	it('fail-closes unsafe and duplicate event sequence numbers', async () => {
		executeSui
			.mockResolvedValueOnce({
				transaction: {
					digest: 'TransactionDigest',
					sender: null,
					kind: null,
					gasInput: null,
					effects: {
						checkpoint: {
							sequenceNumber: 100,
						},
						events: {
							nodes: [{
								sequenceNumber: '9007199254740993',
								contents: {
									type: {
										repr: '0x2::coin::Event',
									},
								},
							}],
						},
					},
				},
			})
			.mockResolvedValueOnce({
				transaction: {
					digest: 'TransactionDigest',
					sender: null,
					kind: null,
					gasInput: null,
					effects: {
						checkpoint: {
							sequenceNumber: 100,
						},
						events: {
							nodes: [
								{
									sequenceNumber: 1,
									contents: {
										type: {
											repr: '0x2::coin::Event',
										},
									},
								},
								{
									sequenceNumber: 1,
									contents: {
										type: {
											repr: '0x2::coin::Event',
										},
									},
								},
							],
						},
					},
				},
			})

		await expect(getTransaction('TransactionDigest')).rejects.toThrow('invalid sequence number')
		await expect(getTransaction('TransactionDigest')).rejects.toThrow('duplicate event sequence number')
	})
})
