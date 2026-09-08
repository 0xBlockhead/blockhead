import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { stringify } from 'devalue'
import { type as arktype } from 'arktype'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { ActionType, actionTypeDefinitionByActionType } from '$/actions/index.ts'
import {
	actionAuthorityRequestEnvelopeHash,
	authorityRequestEnvelope,
	authorityDecision,
	dispatchEvidence,
	type ActionAuthorityRequestEnvelope,
} from '$/actions/execution.ts'
import {
	localMutationAuthorityKey,
} from '$/client/$client.svelte.ts'
import {
	deleteLocalBlockheadAccount,
	deleteLocalBlockheadPanel,
	deleteLocalBlockheadSession,
	deleteLocalBlockheadWalletCapabilityGrant,
	deleteLocalBlockheadWalletCapabilityGrantsForConnection,
	deleteLocalBlockheadWalletConnection,
	hashLocalBlockheadSessionActionRevision,
	type LocalMutationContext,
	updateLocalBlockheadSessionActionType,
	writeLocalBlockheadAccount,
	writeLocalBlockheadActionAuthorityRequest,
	writeLocalBlockheadActionDispatchEvidence,
	writeLocalBlockheadActionDispatchOccurrenceStart,
	writeLocalBlockheadActionOutcome,
	writeLocalBlockheadActionReadinessChecks,
	writeLocalBlockheadCashuMintQuote,
	writeLocalBlockheadEvmWalletRequest,
	writeLocalBlockheadIntentInvocation,
	writeLocalBlockheadLocalMediaIngest,
	writeLocalBlockheadPanel,
	writeLocalBlockheadPanelTree,
	writeLocalBlockheadSession,
	writeLocalBlockheadSessionAction,
	writeLocalBlockheadSessionLifecycle,
	writeLocalBlockheadSessionLockedAt,
	writeLocalBlockheadSessionSimulation,
	writeLocalBlockheadSocialPostSession,
	writeLocalBlockheadTransferIntent,
	writeLocalBlockheadWalletCapabilityGrant,
	writeLocalBlockheadWorkspace,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
	writeLocalBlockheadWalletRequest,
	writeLocalBlockheadWalletRequest_Timestamp,
	writeLocalBlockheadWalletRequestSubmittedAt,
} from '$/collections/localMutations.ts'
import { SocialProtocol } from '$/schema/SocialProtocol.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
	parseEntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { connectedWalletConnection } from '$/state/wallets/walletConnectionState.ts'

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('local session lifecycle mutations', () => {
	it('coerces missing lockedAt on reload and ignores stale updatedAt races', async () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		let persistenceBarrier: Promise<void> | undefined
		let persistenceStarted: PromiseWithResolvers<void> | undefined
		const collectionByAddress = new Map<string, {
			toArray: MockRow[]
			startSyncImmediate(): void
			utils: {
				waitForPersistence(): Promise<void>
				replaceRows(predicate: (row: MockRow) => boolean, rows: readonly MockRow[]): void
				replaceRowsWithAuthority(
					predicate: (row: MockRow) => boolean,
					rows: readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
				writeUpsert(row: MockRow | readonly MockRow[]): void
				writeUpsertWithAuthority(
					row: MockRow | readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
			}
		}>()
		const collectionFor = (address: string) => {
			const existing = collectionByAddress.get(address)
			if (existing != null)
				return existing

			const rows: MockRow[] = []
			const collection = {
				toArray: rows,
				startSyncImmediate: () => {},
				utils: {
					waitForPersistence: async () => {
						persistenceStarted?.resolve()
						await persistenceBarrier
					},
					replaceRows: (predicate: (row: MockRow) => boolean, nextRows: readonly MockRow[]) => {
						for (let index = rows.length - 1; index >= 0; index--)
							if (predicate(rows[index]))
								rows.splice(index, 1)
						rows.push(...nextRows)
					},
					replaceRowsWithAuthority: (
						predicate: (row: MockRow) => boolean,
						nextRows: readonly MockRow[],
						_selectorKey: string,
						_authorityKey: string,
						_resolution: 'present' | 'resolved' | 'deleted',
						onApplied?: () => void | Promise<void>
					) => {
						collection.utils.replaceRows(predicate, nextRows)
						return Promise.resolve(onApplied?.()).then(() => {})
					},
					writeUpsert: (row: MockRow | readonly MockRow[]) => {
						for (const nextRow of Array.isArray(row) ? row : [row]) {
							const index = rows.findIndex((existingRow) => (
								existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
								&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
								&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
								&& existingRow.valueKey === nextRow.valueKey
							))
							if (index >= 0)
								rows.splice(index, 1)
							rows.push(nextRow)
						}
					},
					writeUpsertWithAuthority: (
						row: MockRow | readonly MockRow[],
						_selectorKey: string,
						_authorityKey: string,
						_resolution: 'present' | 'resolved' | 'deleted',
						onApplied?: () => void | Promise<void>
					) => {
						collection.utils.writeUpsert(row)
						return Promise.resolve(onApplied?.()).then(() => {})
					},
				},
			}
			collectionByAddress.set(address, collection)
			return collection
		}
		const context: LocalMutationContext = {
			entityCollections: new Proxy({}, {
				get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
			}),
			entityFieldCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
				}),
			}),
			entityFieldCountCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldName: string) => collectionFor(`count:${entityType}:${fieldName}`),
				}),
			}),
		}
		const parentSelector = {
			scope: '$$blockheadSessions',
		}
		const coerced = await writeLocalBlockheadSessionLifecycle(context, parentSelector, {
			id: 'session-reload',
			name: 'reload',
			status: BlockheadSessionStatus.Submitted,
			createdAt: 1,
			updatedAt: 20,
		})
		expect(coerced).toEqual({
			id: 'session-reload',
			name: 'reload',
			status: BlockheadSessionStatus.Submitted,
			createdAt: 1,
			updatedAt: 20,
			lockedAt: 20,
		})
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'lockedAt'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 20,
			}),
		])

		await writeLocalBlockheadSessionLifecycle(context, parentSelector, {
			id: 'session-reload',
			name: 'stale-name',
			status: BlockheadSessionStatus.Draft,
			createdAt: 1,
			updatedAt: 10,
		})
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'name'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 'reload',
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'status'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: BlockheadSessionStatus.Submitted,
			}),
		])

		expect(() => deleteLocalBlockheadSession(context, parentSelector, {
			id: 'session-reload',
		})).toThrow('not removable')

		await writeLocalBlockheadSessionLifecycle(context, parentSelector, {
			id: 'session-reload',
			name: 'reload',
			status: BlockheadSessionStatus.Finalized,
			createdAt: 1,
			updatedAt: 30,
			lockedAt: 20,
		})
		expect(() => deleteLocalBlockheadSession(context, parentSelector, {
			id: 'session-reload',
		})).toThrow('not removable')
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'status'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: BlockheadSessionStatus.Finalized,
			}),
		])

		const persistence = Promise.withResolvers<void>()
		persistenceBarrier = persistence.promise
		persistenceStarted = Promise.withResolvers<void>()
		let writerSettled = false
		const draftWrite = writeLocalBlockheadSession(
			context,
			parentSelector,
			'draft-removable'
		).then((selector) => {
			writerSettled = true
			return selector
		})
		await persistenceStarted.promise
		expect(writerSettled).toBe(false)
		persistence.resolve()
		const draftSelector = await draftWrite
		persistenceBarrier = undefined
		persistenceStarted = undefined
		expect(context.entityCollections[EntityType.BlockheadSession].toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Selector]: draftSelector,
			}),
		]))
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadSessions'
		)].toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(draftSelector),
				}),
			}),
		]))
		writeLocalBlockheadSessionLockedAt(context, draftSelector, 5)
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'lockedAt'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelector]: draftSelector,
			[EntityMetaKey.Value]: 5,
		}))
		await deleteLocalBlockheadSession(context, parentSelector, draftSelector)
		expect(context.entityCollections[EntityType.BlockheadSession].toArray.find((row) => (
			row[EntityMetaKey.SelectorKey] === stringify(draftSelector)
		))).toBeUndefined()
	})
})

describe('local session capability grant mutations', () => {
	it('preserves inactive grants, ignores stale reissues, and revokes grants with their connection', async () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		const collectionByAddress = new Map<string, {
			toArray: MockRow[]
			startSyncImmediate(): void
			utils: {
				waitForPersistence(): Promise<void>
				replaceRows(predicate: (row: MockRow) => boolean, rows: readonly MockRow[]): void
				replaceRowsWithAuthority(
					predicate: (row: MockRow) => boolean,
					rows: readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
				writeUpsert(row: MockRow | readonly MockRow[]): void
				writeUpsertWithAuthority(
					row: MockRow | readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
			}
		}>()
		const collectionFor = (address: string) => {
			const existing = collectionByAddress.get(address)
			if (existing != null)
				return existing

			const rows: MockRow[] = []
			const collection = {
				toArray: rows,
				startSyncImmediate: () => {},
				utils: {
					waitForPersistence: async () => {},
					replaceRows: (predicate: (row: MockRow) => boolean, nextRows: readonly MockRow[]) => {
						for (let index = rows.length - 1; index >= 0; index--)
							if (predicate(rows[index]))
								rows.splice(index, 1)
						rows.push(...nextRows)
					},
					replaceRowsWithAuthority: (
						predicate: (row: MockRow) => boolean,
						nextRows: readonly MockRow[],
						_selectorKey: string,
						_authorityKey: string,
						_resolution: 'present' | 'resolved' | 'deleted',
						onApplied?: () => void | Promise<void>
					) => {
						collection.utils.replaceRows(predicate, nextRows)
						return Promise.resolve(onApplied?.()).then(() => {})
					},
					writeUpsert: (row: MockRow | readonly MockRow[]) => {
						for (const nextRow of Array.isArray(row) ? row : [row]) {
							const index = rows.findIndex((existingRow) => (
								existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
								&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
								&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
								&& existingRow.valueKey === nextRow.valueKey
							))
							if (index >= 0)
								rows.splice(index, 1)
							rows.push(nextRow)
						}
					},
					writeUpsertWithAuthority: (
						row: MockRow | readonly MockRow[],
						_selectorKey: string,
						_authorityKey: string,
						_resolution: 'present' | 'resolved' | 'deleted',
						onApplied?: () => void | Promise<void>
					) => {
						collection.utils.writeUpsert(row)
						return Promise.resolve(onApplied?.()).then(() => {})
					},
				},
			}
			collectionByAddress.set(address, collection)
			return collection
		}
		const context: LocalMutationContext = {
			entityCollections: new Proxy({}, {
				get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
			}),
			entityFieldCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
				}),
			}),
			entityFieldCountCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldName: string) => collectionFor(`count:${entityType}:${fieldName}`),
				}),
			}),
		}
		const grant = {
			grantId: 'grant-1',
			connectionKey: 'conn-a',
			authorizationKind: 'wallet-scope',
			scope: {
				namespace: 'eip155',
				reference: '1',
			},
			methods: [
				'eth_sendTransaction',
			],
			resources: [
				'eip155:1',
			],
			issuedAt: 10,
		}

		await writeLocalBlockheadWalletCapabilityGrant(context, {
			...grant,
			expiresAt: 1,
		}, 50)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][entityFieldAddressKey(
			EntityType.BlockheadWalletCapabilityGrant,
			[],
			'expiresAt'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])

		await writeLocalBlockheadWalletCapabilityGrant(context, {
			...grant,
			issuedAt: 20,
		}, 50)
		await writeLocalBlockheadWalletCapabilityGrant(context, {
			...grant,
			issuedAt: 5,
			methods: [
				'eth_sign',
			],
		}, 50)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][entityFieldAddressKey(
			EntityType.BlockheadWalletCapabilityGrant,
			[],
			'methods'
		)].toArray.map((row) => row[EntityMetaKey.Value])).toEqual([
			'eth_sendTransaction',
		])

		await writeLocalBlockheadWalletCapabilityGrant(context, {
			...grant,
			grantId: 'grant-2',
			connectionKey: 'conn-b',
		}, 50)
		await deleteLocalBlockheadWalletCapabilityGrantsForConnection(context, 'conn-a', 50)
		expect(context.entityCollections[EntityType.BlockheadWalletCapabilityGrant].toArray.map((row) => (
			Object(row[EntityMetaKey.Selector]).grantId
		))).toEqual(expect.arrayContaining([
			'grant-1',
			'grant-2',
		]))
		expect(context.entityCollections[EntityType.BlockheadWalletCapabilityGrant].toArray).toHaveLength(2)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletCapabilityGrant][entityFieldAddressKey(
			EntityType.BlockheadWalletCapabilityGrant,
			[],
			'revokedAt'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 50,
			}),
		])
		await deleteLocalBlockheadWalletCapabilityGrant(context, 'grant-2')
		expect(context.entityCollections[EntityType.BlockheadWalletCapabilityGrant].toArray).toHaveLength(1)
	})
})

describe('local mutation authority journal', () => {
	it('records exact field, relationship, count, absence, and deletion authority', async () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		const events: {
			selectorKey: string
			authorityKey: string
			resolution: 'present' | 'resolved' | 'deleted'
		}[] = []
		type MockCollection = {
			toArray: MockRow[]
			delete(key: string): void
			startSyncImmediate(): void
			utils: {
				waitForPersistence(): Promise<void>
				replaceRows(predicate: (row: MockRow) => boolean, rows: readonly MockRow[]): void
				replaceRowsWithAuthority(
					predicate: (row: MockRow) => boolean,
					rows: readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
				writeUpsert(row: MockRow | readonly MockRow[]): void
				writeUpsertWithAuthority(
					row: MockRow | readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				): Promise<void>
				deleteSelectorRowsAndAuthority(
					predicate: (row: MockRow) => boolean,
					selectorKey: string
				): void
			}
		}
		const collectionByAddress = new Map<string, MockCollection>()
		let heldPersistenceAddress: string | undefined
		let persistenceStarted: PromiseWithResolvers<void> | undefined
		let persistenceRelease: Promise<void> | undefined
		const collectionFor = (address: string): MockCollection => {
			const existing = collectionByAddress.get(address)
			if (existing != null)
				return existing

			const rows: MockRow[] = []
			const collection: MockCollection = {
				toArray: rows,
				delete: (key) => {
					const index = rows.findIndex((row) => row.key === key)
					if (index >= 0)
						rows.splice(index, 1)
				},
				startSyncImmediate: () => {},
				utils: {
					waitForPersistence: async () => {
						if (address !== heldPersistenceAddress)
							return
						persistenceStarted?.resolve()
						await persistenceRelease
					},
					replaceRows: (predicate, nextRows) => {
						for (let index = rows.length - 1; index >= 0; index--)
							if (predicate(rows[index]))
								rows.splice(index, 1)
						rows.push(...nextRows)
					},
					replaceRowsWithAuthority: (predicate, nextRows, selectorKey, authorityKey, resolution, onApplied) => {
						collection.utils.replaceRows(predicate, nextRows)
						events.push({
							selectorKey,
							authorityKey,
							resolution,
						})
						return Promise.resolve(onApplied?.()).then(() => {})
					},
					writeUpsert: (row) => {
						for (const nextRow of Array.isArray(row) ? row : [row]) {
							const index = rows.findIndex((existingRow) => (
								existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
								&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
								&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
								&& existingRow.valueKey === nextRow.valueKey
							))
							if (index >= 0)
								rows.splice(index, 1)
							rows.push(nextRow)
						}
					},
					writeUpsertWithAuthority: (row, selectorKey, authorityKey, resolution, onApplied) => {
						collection.utils.writeUpsert(row)
						events.push({
							selectorKey,
							authorityKey,
							resolution,
						})
						return Promise.resolve(onApplied?.()).then(() => {})
					},
					deleteSelectorRowsAndAuthority: (predicate, selectorKey) => {
						collection.utils.replaceRows(predicate, [])
						for (let index = events.length - 1; index >= 0; index--)
							if (events[index].selectorKey === selectorKey)
								events.splice(index, 1)
					},
				},
			}
			collectionByAddress.set(address, collection)
			return collection
		}
		const entityCollections: LocalMutationContext['entityCollections'] = new Proxy({}, {
			get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
		})
		const entityFieldCollections: LocalMutationContext['entityFieldCollections'] = new Proxy({}, {
			get: (_target, entityType: string) => new Proxy({}, {
				get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
			}),
		})
		const entityFieldCountCollections: LocalMutationContext['entityFieldCountCollections'] = new Proxy({}, {
			get: (_target, entityType: string) => new Proxy({}, {
				get: (_fields, fieldName: string) => collectionFor(`count:${entityType}:${fieldName}`),
			}),
		})
		const context: LocalMutationContext = {
			entityCollections,
			entityFieldCollections,
			entityFieldCountCollections,
		}
		const sharedLocalStorage = new Map<string, string>()
		const lockQueueByName = new Map<string, Promise<void>>()
		const lockRequests: string[] = []
		vi.stubGlobal('window', {
			localStorage: {
				getItem: (key: string) => sharedLocalStorage.get(key) ?? null,
				setItem: (key: string, value: string) => {
					sharedLocalStorage.set(key, value)
				},
			},
		})
		vi.stubGlobal('navigator', {
			locks: {
				request: <_Result>(name: string, create: () => Promise<_Result>) => {
					lockRequests.push(name)
					const creation = (lockQueueByName.get(name) ?? Promise.resolve()).then(create)
					lockQueueByName.set(name, creation.then(
						() => undefined,
						() => undefined
					))
					return creation
				},
			},
		})
		const walletSelectorKey = stringify({ id: 'wallet-1' })
		const connectionSelectorKey = stringify({ connectionKey: 'connection-1' })

		await writeLocalBlockheadWallet(context, {
			id: 'wallet-1',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			capabilities: [WalletCapability.Connect],
		})
		await writeLocalBlockheadWalletConnection(context, {
			connectionKey: 'connection-1',
			walletId: 'wallet-1',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1,
			scopes: [],
			accounts: [],
		})

		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			['Connected'],
			'selected'
		)].toArray).toEqual([
			expect.objectContaining({
				facetPath: ['Connected'],
				facetPathKey: stringify(['Connected']),
				[EntityMetaKey.Value]: false,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'error'
		)].toArray).toHaveLength(0)

		expect(events).toEqual(expect.arrayContaining([
			expect.objectContaining({
				selectorKey: walletSelectorKey,
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWallet,
					selectorKey: walletSelectorKey,
				}),
				resolution: 'present',
			}),
			expect.objectContaining({
				selectorKey: connectionSelectorKey,
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWalletConnection,
					selectorKey: connectionSelectorKey,
					fieldName: 'selected',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, ['Connected'], 'selected'),
					facetPathKey: stringify(['Connected']),
				}),
				resolution: 'resolved',
			}),
			expect.objectContaining({
				selectorKey: connectionSelectorKey,
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWalletConnection,
					selectorKey: connectionSelectorKey,
					fieldName: 'error',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'error'),
					facetPathKey: stringify([]),
				}),
				resolution: 'resolved',
			}),
			expect.objectContaining({
				selectorKey: connectionSelectorKey,
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWalletConnection,
					selectorKey: connectionSelectorKey,
					fieldName: '$$accounts',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts'),
					facetPathKey: stringify([]),
					filterKey: stringify({}),
				}),
				resolution: 'resolved',
			}),
		]))

		await deleteLocalBlockheadWalletConnection(context, 'connection-1')

		expect(events).toContainEqual(expect.objectContaining({
			selectorKey: connectionSelectorKey,
			authorityKey: localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: EntityType.BlockheadWalletConnection,
				selectorKey: connectionSelectorKey,
			}),
			resolution: 'deleted',
		}))

		expect(entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWalletConnections'
		)].toArray).toHaveLength(0)
		expect(events.filter((event) => event.authorityKey === localMutationAuthorityKey({
			source: Source.Local_Internal,
			entityType: EntityType._Global,
			selectorKey: stringify({ scope: '$$blockheadWalletConnections' }),
			fieldName: '$$blockheadWalletConnections',
			fieldAddressKey: entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections'),
			facetPathKey: stringify([]),
			filterKey: stringify({}),
		}))).toHaveLength(2)

		const sessionParentSelector = {
			scope: '$$blockheadSessions',
		}
		const sessionSelector = await writeLocalBlockheadSession(
			context,
			sessionParentSelector,
			'Authority session'
		)
		const secondSessionSelector = await writeLocalBlockheadSession(
			context,
			sessionParentSelector,
			'Second authority session'
		)
		expect(entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadSessions'
		)].toArray.map((row) => row.valueIndex)).toEqual([
			0,
			1,
		])
		const createdActionSelector = await writeLocalBlockheadSessionAction(
			context,
			sessionSelector,
			ActionType.Transfer
		)
		await Promise.all([
			writeLocalBlockheadSessionAction(
				context,
				sessionSelector,
				ActionType.Swap
			),
			writeLocalBlockheadSessionAction(
				{
					entityCollections,
					entityFieldCollections,
					entityFieldCountCollections,
				},
				sessionSelector,
				ActionType.Bridge
			),
		])
		await writeLocalBlockheadSessionAction(
			{
				entityCollections,
				entityFieldCollections,
				entityFieldCountCollections,
			},
			sessionSelector,
			ActionType.Transfer
		)
		expect(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'indexInSequence'
		)].toArray.map((row) => row[EntityMetaKey.Value]).sort()).toEqual([
			0,
			1,
			2,
			3,
		])
		expect(new Set(lockRequests)).toEqual(new Set([
			`blockhead:session-action-sequence:${stringify(sessionSelector)}`,
		]))
		expect(lockRequests).toHaveLength(4)
		const actionRow = entityCollections[EntityType.BlockheadSessionAction].toArray[0]
		const actionSelectorKey = actionRow[EntityMetaKey.SelectorKey]
		const actionSelector = parseEntitySelector(
			schema,
			entityDefinitionByType[EntityType.BlockheadSessionAction],
			actionRow[EntityMetaKey.Selector]
		)
		if (actionSelector instanceof arktype.errors)
			throw actionSelector
		expect(createdActionSelector).toEqual(actionSelector)
		const initialRevisionHash = entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'contentRevisionHash'
		)].toArray.find((row) => row[EntityMetaKey.ParentSelectorKey] === actionSelectorKey)?.[EntityMetaKey.Value]
		expect(initialRevisionHash).toBe(hashLocalBlockheadSessionActionRevision(
			ActionType.Transfer,
			actionTypeDefinitionByActionType[ActionType.Transfer].params.assert({})
		))
		const bridgeParams = {
			fromChainId: 1,
			toChainId: 10,
			tokenAddress: '0x0000000000000000000000000000000000000000',
			amount: 2n,
			slippage: 0.005,
		}
		await updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Bridge,
			bridgeParams,
			initialRevisionHash
		)
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: actionSelectorKey,
			})
		)
		expect(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'actionParams'
		)].toArray).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelectorKey]: actionSelectorKey,
				[EntityMetaKey.Value]: expect.objectContaining({
					amount: 2n,
				}),
			})
		)
		expect(entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'updatedAt'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.Value]: expect.any(Number),
		}))
		expect(() => writeLocalBlockheadSessionAction(
			context,
			sessionSelector,
			ActionType.Transfer,
			{
				amount: 'invalid',
			}
		)).toThrow()
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toHaveLength(4)

		const revisionRow = entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'contentRevisionHash'
		)].toArray.find((row) => row[EntityMetaKey.ParentSelectorKey] === actionSelectorKey)
		if (revisionRow == null)
			throw new Error('Expected the authored action revision hash')
		const contentRevisionHash = Hash32.assert(revisionRow[EntityMetaKey.Value])
		expect(contentRevisionHash).toBe(hashLocalBlockheadSessionActionRevision(ActionType.Bridge, bridgeParams))
		expect(contentRevisionHash).not.toBe(initialRevisionHash)
		const actionRowsBeforeStaleEdit = structuredClone(entityCollections[EntityType.BlockheadSessionAction].toArray)
		const actionFieldNames = [
			'$session',
			'indexInSequence',
			'actionType',
			'actionParams',
			'contentRevisionHash',
			'createdAt',
			'updatedAt',
		] as const
		const actionFieldRowsBeforeStaleEdit = Object.fromEntries(actionFieldNames.map((fieldName) => [
			fieldName,
			structuredClone(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
				EntityType.BlockheadSessionAction,
				[],
				fieldName
			)].toArray),
		]))
		await expect(updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Transfer,
			{},
			initialRevisionHash
		)).rejects.toThrow('Session action edit is stale')
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toEqual(actionRowsBeforeStaleEdit)
		for (const fieldName of actionFieldNames)
			expect(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
				EntityType.BlockheadSessionAction,
				[],
				fieldName
			)].toArray).toEqual(actionFieldRowsBeforeStaleEdit[fieldName])
		const envelope = {
			adapterKey: 'evm.personal-sign',
			adapterVersion: '1',
			value: {
				chainId: 1,
				accountAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				message: 'Consent is exact and immutable.',
			},
		} satisfies ActionAuthorityRequestEnvelope
		const authorityRequest = {
			id: 'authority-request-1',
			walletConnection: { connectionKey: 'connection-1' },
			actionRevisionBindings: [{
				sessionId: actionSelector.sessionId,
				actionId: actionSelector.actionId,
				contentRevisionHash,
			}],
			sessionActions: [actionSelector],
			envelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(envelope),
			presentedAt: 20,
			decision: authorityDecision.assert({
				kind: 'prepared-without-dispatch',
				decidedAt: 21,
			}),
		}
		heldPersistenceAddress = `field:${EntityType.BlockheadActionAuthorityRequest}:${entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'envelope'
		)}`
		persistenceStarted = Promise.withResolvers<void>()
		const authorityRelease = Promise.withResolvers<void>()
		persistenceRelease = authorityRelease.promise
		const authorityWrite = writeLocalBlockheadActionAuthorityRequest(context, authorityRequest)
		await persistenceStarted.promise
		envelope.value.message = 'Caller-mutated consent must not persist.'
		authorityRequest.actionRevisionBindings[0].contentRevisionHash = Hash32.assert(
			'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
		)
		const persistedEnvelope = entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'envelope'
		)].toArray[0]?.[EntityMetaKey.Value]
		expect(persistedEnvelope).toMatchObject({
			value: {
				message: 'Consent is exact and immutable.',
			},
		})
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'actionRevisionBindings'
		)].toArray[0]?.[EntityMetaKey.Value]).toMatchObject({ contentRevisionHash })
		envelope.value.message = 'Consent is exact and immutable.'
		authorityRequest.actionRevisionBindings[0].contentRevisionHash = contentRevisionHash
		authorityRelease.resolve()
		const authoritySelector = await authorityWrite
		heldPersistenceAddress = undefined
		persistenceStarted = undefined
		persistenceRelease = undefined
		await expect(writeLocalBlockheadActionAuthorityRequest(context, authorityRequest)).resolves.toEqual(
			authoritySelector
		)
		const authorityHistoryBeforeActionEdit = {
			envelope: structuredClone(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
				EntityType.BlockheadActionAuthorityRequest,
				[],
				'envelope'
			)].toArray),
			envelopeHash: structuredClone(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
				EntityType.BlockheadActionAuthorityRequest,
				[],
				'envelopeHash'
			)].toArray),
			actionRevisionBindings: structuredClone(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
				EntityType.BlockheadActionAuthorityRequest,
				[],
				'actionRevisionBindings'
			)].toArray),
		}
		expect(entityCollections[EntityType.BlockheadActionAuthorityRequest].toArray).toHaveLength(1)
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'decision'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.Value]: authorityRequest.decision,
		}))
		expect(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'$$authorityRequests'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelectorKey]: actionSelectorKey,
		}))

		const conflictingEnvelope = {
			...envelope,
			value: {
				...envelope.value,
				message: 'A different consent envelope.',
			},
		}
		const rowsBeforeAuthorityConflict = [...collectionByAddress.values()].reduce(
			(count, collection) => count + collection.toArray.length,
			0
		)
		await expect(writeLocalBlockheadActionAuthorityRequest(context, {
			...authorityRequest,
			envelope: conflictingEnvelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(conflictingEnvelope),
		})).rejects.toThrow('conflicting immutable data')
		expect([...collectionByAddress.values()].reduce(
			(count, collection) => count + collection.toArray.length,
			0
		)).toBe(rowsBeforeAuthorityConflict)

		const occurrence = {
			id: 'dispatch-occurrence-1',
			authorityRequest: authoritySelector,
			walletConnection: { connectionKey: 'connection-1' },
			address: {
				kind: 'wallet-connection',
				connectionKey: 'connection-1',
				method: 'personal_sign',
			},
			startedAt: 22,
		}
		await updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Transfer,
			{},
			contentRevisionHash
		)
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'envelope'
		)].toArray).toEqual(authorityHistoryBeforeActionEdit.envelope)
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'envelopeHash'
		)].toArray).toEqual(authorityHistoryBeforeActionEdit.envelopeHash)
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'actionRevisionBindings'
		)].toArray).toEqual(authorityHistoryBeforeActionEdit.actionRevisionBindings)
		const transferRevisionHash = hashLocalBlockheadSessionActionRevision(
			ActionType.Transfer,
			actionTypeDefinitionByActionType[ActionType.Transfer].params.assert({})
		)
		const retargetedAuthoritySelector = await writeLocalBlockheadActionAuthorityRequest(context, {
			...authorityRequest,
			id: 'authority-request-2',
			actionRevisionBindings: [{
				sessionId: actionSelector.sessionId,
				actionId: actionSelector.actionId,
				contentRevisionHash: transferRevisionHash,
			}],
			decision: undefined,
		})
		expect(entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(
			EntityType.BlockheadActionAuthorityRequest,
			[],
			'actionRevisionBindings'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(
				schema,
				entityDefinitionByType[EntityType.BlockheadActionAuthorityRequest],
				retargetedAuthoritySelector
			),
			[EntityMetaKey.Value]: {
				sessionId: actionSelector.sessionId,
				actionId: actionSelector.actionId,
				contentRevisionHash: transferRevisionHash,
			},
		}))
		await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, occurrence)).rejects.toThrow(
			'cannot start after an authority decision has been persisted'
		)
		expect(entityCollections[EntityType.BlockheadActionDispatchOccurrence].toArray).toHaveLength(0)
		for (const decision of [
			authorityDecision.assert({
				kind: 'denied',
				decidedAt: 21,
				reason: 'Consent declined',
			}),
			authorityDecision.assert({
				kind: 'cancelled',
				decidedAt: 21,
			}),
		]) {
			const decidedAuthority = await writeLocalBlockheadActionAuthorityRequest(context, {
				...authorityRequest,
				id: `authority-request-${decision.kind}`,
				actionRevisionBindings: [{
					sessionId: actionSelector.sessionId,
					actionId: actionSelector.actionId,
					contentRevisionHash: transferRevisionHash,
				}],
				decision,
			})
			await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, {
				...occurrence,
				authorityRequest: decidedAuthority,
			})).rejects.toThrow('cannot start after an authority decision has been persisted')
			expect(entityCollections[EntityType.BlockheadActionDispatchOccurrence].toArray).toHaveLength(0)
		}
		const staleAuthoritySelector = await writeLocalBlockheadActionAuthorityRequest(context, {
			...authorityRequest,
			id: 'authority-request-stale-revision',
			actionRevisionBindings: [{
				sessionId: actionSelector.sessionId,
				actionId: actionSelector.actionId,
				contentRevisionHash: transferRevisionHash,
			}],
			decision: undefined,
		})
		const bridgeRevisionHash = hashLocalBlockheadSessionActionRevision(
			ActionType.Bridge,
			bridgeParams
		)
		await updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Bridge,
			bridgeParams,
			transferRevisionHash
		)
		await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			...occurrence,
			authorityRequest: staleAuthoritySelector,
		})).rejects.toThrow(
			'no longer matches the persisted authored action revision'
		)
		await updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Transfer,
			{},
			bridgeRevisionHash
		)
		occurrence.authorityRequest = retargetedAuthoritySelector
		heldPersistenceAddress = `field:${EntityType.BlockheadActionDispatchOccurrence}:${entityFieldAddressKey(
			EntityType.BlockheadActionDispatchOccurrence,
			[],
			'address'
		)}`
		persistenceStarted = Promise.withResolvers<void>()
		const occurrenceRelease = Promise.withResolvers<void>()
		persistenceRelease = occurrenceRelease.promise
		const occurrenceWrite = writeLocalBlockheadActionDispatchOccurrenceStart(context, occurrence)
		await persistenceStarted.promise
		occurrence.address.connectionKey = 'caller-mutated-connection'
		expect(entityFieldCollections[EntityType.BlockheadActionDispatchOccurrence][entityFieldAddressKey(
			EntityType.BlockheadActionDispatchOccurrence,
			[],
			'address'
		)].toArray[0]?.[EntityMetaKey.Value]).toMatchObject({ connectionKey: 'connection-1' })
		occurrence.address.connectionKey = 'connection-1'
		occurrenceRelease.resolve()
		const occurrenceSelector = await occurrenceWrite
		heldPersistenceAddress = undefined
		persistenceStarted = undefined
		persistenceRelease = undefined
		await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, occurrence)).resolves.toEqual(
			occurrenceSelector
		)
		expect(entityCollections[EntityType.BlockheadActionDispatchOccurrence].toArray).toHaveLength(1)
		await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			...occurrence,
			startedAt: 23,
		})).rejects.toThrow('conflicting immutable data')
		expect(entityCollections[EntityType.BlockheadActionDispatchOccurrence].toArray).toHaveLength(1)

		const evidence = {
			kind: 'returned',
			response: {
				adapterKey: 'evm.signature',
				adapterVersion: '1',
				value: {
					signatureHash: Hash32.assert('0x4444444444444444444444444444444444444444444444444444444444444444'),
				},
			},
		} as const
		heldPersistenceAddress = `field:${EntityType.BlockheadActionDispatchOccurrence}:${entityFieldAddressKey(
			EntityType.BlockheadActionDispatchOccurrence,
			[],
			'evidence'
		)}`
		persistenceStarted = Promise.withResolvers<void>()
		const release = Promise.withResolvers<void>()
		persistenceRelease = release.promise
		let evidenceSettled = false
		const evidenceWrite = writeLocalBlockheadActionDispatchEvidence(
			context,
			occurrenceSelector,
			evidence
		).then(() => {
			evidenceSettled = true
		})
		await persistenceStarted.promise
		expect(evidenceSettled).toBe(false)
		evidence.response.value.signatureHash = Hash32.assert('0x5555555555555555555555555555555555555555555555555555555555555555')
		expect(entityFieldCollections[EntityType.BlockheadActionDispatchOccurrence][entityFieldAddressKey(
			EntityType.BlockheadActionDispatchOccurrence,
			[],
			'evidence'
		)].toArray[0]?.[EntityMetaKey.Value]).toMatchObject({
			response: { value: { signatureHash: '0x4444444444444444444444444444444444444444444444444444444444444444' } },
		})
		evidence.response.value.signatureHash = Hash32.assert('0x4444444444444444444444444444444444444444444444444444444444444444')
		release.resolve()
		await evidenceWrite
		heldPersistenceAddress = undefined
		persistenceStarted = undefined
		persistenceRelease = undefined
		await expect(writeLocalBlockheadActionDispatchEvidence(
			context,
			occurrenceSelector,
			evidence
		)).resolves.toBeUndefined()

		const suiEnvelope = authorityRequestEnvelope.assert({
			adapterKey: 'wallet.message-sign',
			adapterVersion: '1',
			value: {
				namespace: 'sui',
				method: 'sui:signPersonalMessage',
				accountAddress: '0x1234',
				message: 'Bind this Sui authority exactly.',
			},
		})
		const suiAuthoritySelector = await writeLocalBlockheadActionAuthorityRequest(context, {
			id: 'authority-request-sui',
			walletConnection: { connectionKey: 'connection-sui' },
			actionRevisionBindings: [],
			sessionActions: [],
			envelope: suiEnvelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(suiEnvelope),
			presentedAt: 30,
		})
		await expect(writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			id: 'dispatch-occurrence-sui',
			authorityRequest: suiAuthoritySelector,
			walletConnection: { connectionKey: 'connection-sui' },
			address: {
				kind: 'wallet-connection',
				connectionKey: 'connection-sui',
				method: 'sui:signPersonalMessage',
			},
			startedAt: 31,
		})).resolves.toEqual({ id: 'dispatch-occurrence-sui' })

		const tonEnvelope = authorityRequestEnvelope.assert({
			adapterKey: 'ton.internal-message-sign',
			adapterVersion: '1',
			value: {
				namespace: 'ton',
				reference: '-239',
				accountAddress: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				method: 'signMessage',
				network: '-239',
				from: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				messages: [
					{
						address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
						amount: '1000',
					},
				],
			},
		})
		const tonAuthoritySelector = await writeLocalBlockheadActionAuthorityRequest(context, {
			id: 'authority-request-ton-internal-message',
			walletConnection: { connectionKey: 'connection-ton' },
			actionRevisionBindings: [],
			sessionActions: [],
			envelope: tonEnvelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(tonEnvelope),
			presentedAt: 32,
		})
		const tonOccurrenceSelector = await writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			id: 'dispatch-occurrence-ton-internal-message',
			authorityRequest: tonAuthoritySelector,
			walletConnection: { connectionKey: 'connection-ton' },
			address: {
				kind: 'wallet-connection',
				connectionKey: 'connection-ton',
				method: 'signMessage',
			},
			startedAt: 33,
		})
		const bitcoinSignatureEvidence = dispatchEvidence.assert({
			kind: 'returned',
			response: {
				adapterKey: 'wallet.signature',
				adapterVersion: '1',
				value: {
					namespace: 'bip122',
					signatureHash: '0x4444444444444444444444444444444444444444444444444444444444444444',
				},
			},
		})
		await expect(writeLocalBlockheadActionDispatchEvidence(
			context,
			tonOccurrenceSelector,
			bitcoinSignatureEvidence
		)).rejects.toThrow('does not match')
		await expect(writeLocalBlockheadActionDispatchEvidence(context, tonOccurrenceSelector, {
			kind: 'returned',
			response: {
				adapterKey: 'ton.internal-message-sign',
				adapterVersion: '1',
				value: {
					internalBocHash: '0x5555555555555555555555555555555555555555555555555555555555555555',
				},
			},
		})).resolves.toBeUndefined()

		const bitcoinEnvelope = authorityRequestEnvelope.assert({
			adapterKey: 'wallet.message-sign',
			adapterVersion: '1',
			value: {
				namespace: 'bip122',
				method: 'signMessage',
				accountAddress: 'bc1qauthority',
				message: 'Bind this Bitcoin authority exactly.',
			},
		})
		const bitcoinAuthoritySelector = await writeLocalBlockheadActionAuthorityRequest(context, {
			id: 'authority-request-bitcoin-message',
			walletConnection: { connectionKey: 'connection-bitcoin' },
			actionRevisionBindings: [],
			sessionActions: [],
			envelope: bitcoinEnvelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(bitcoinEnvelope),
			presentedAt: 34,
		})
		const bitcoinOccurrenceSelector = await writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			id: 'dispatch-occurrence-bitcoin-message',
			authorityRequest: bitcoinAuthoritySelector,
			walletConnection: { connectionKey: 'connection-bitcoin' },
			address: {
				kind: 'wallet-connection',
				connectionKey: 'connection-bitcoin',
				method: 'signMessage',
			},
			startedAt: 35,
		})
		await expect(writeLocalBlockheadActionDispatchEvidence(context, bitcoinOccurrenceSelector, {
			kind: 'returned',
			response: {
				adapterKey: 'ton.internal-message-sign',
				adapterVersion: '1',
				value: {
					internalBocHash: '0x6666666666666666666666666666666666666666666666666666666666666666',
				},
			},
		})).rejects.toThrow('does not match')
		await expect(writeLocalBlockheadActionDispatchEvidence(
			context,
			bitcoinOccurrenceSelector,
			bitcoinSignatureEvidence
		)).resolves.toBeUndefined()

		deleteLocalBlockheadSession(context, sessionParentSelector, sessionSelector)
		deleteLocalBlockheadSession(context, sessionParentSelector, secondSessionSelector)

		expect(entityCollections[EntityType.BlockheadSession].toArray).toHaveLength(0)
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toHaveLength(0)
		expect(events).toContainEqual(expect.objectContaining({
			selectorKey: actionSelectorKey,
			authorityKey: localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: EntityType.BlockheadSessionAction,
				selectorKey: actionSelectorKey,
			}),
			resolution: 'deleted',
		}))
	})

	it('reconciles relationships before declaring count and absence authority', async () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		const rowsByAddress = new Map<string, MockRow[]>()
		const persistedAddresses: string[] = []
		let queueMutations = false
		const queuedMutationApplications: (() => Promise<void>)[] = []
		const events: {
			selectorKey: string
			authorityKey: string
			resolution: 'present' | 'resolved' | 'deleted'
			rowCount: number
		}[] = []
		const rowsFor = (address: string) => {
			const rows = rowsByAddress.get(address) ?? []
			rowsByAddress.set(address, rows)
			return rows
		}
		const collectionFor = (address: string) => ({
			toArray: rowsFor(address),
			delete: () => {},
			startSyncImmediate: () => {},
			utils: {
				waitForPersistence: async () => {
					persistedAddresses.push(address)
				},
				replaceRows: (
					predicate: (row: MockRow) => boolean,
					nextRows: readonly MockRow[]
				) => {
					const rows = rowsFor(address)
					for (let index = rows.length - 1; index >= 0; index--)
						if (predicate(rows[index]))
							rows.splice(index, 1)
					rows.push(...nextRows)
				},
				replaceRowsWithAuthority: (
					predicate: (row: MockRow) => boolean,
					nextRows: readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				) => {
					const apply = () => {
						const rows = rowsFor(address)
						for (let index = rows.length - 1; index >= 0; index--)
							if (predicate(rows[index]))
								rows.splice(index, 1)
						rows.push(...nextRows)
					events.push({
						selectorKey,
						authorityKey,
						resolution,
						rowCount: nextRows.length,
					})
						return Promise.resolve(onApplied?.()).then(() => {})
					}
					if (!queueMutations)
						return apply()

					return new Promise<void>((resolve, reject) => {
						queuedMutationApplications.push(() => apply().then(resolve, reject))
					})
				},
				writeUpsert: (row: MockRow | readonly MockRow[]) => {
					const rows = rowsFor(address)
					for (const nextRow of Array.isArray(row) ? row : [row]) {
						const index = rows.findIndex((existingRow) => (
							existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
								&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
								&& existingRow.valueKey === nextRow.valueKey
						))
						if (index >= 0)
							rows.splice(index, 1)
						rows.push(nextRow)
					}
				},
				writeUpsertWithAuthority: (
					row: MockRow | readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted',
					onApplied?: () => void | Promise<void>
				) => {
					const apply = () => {
						const rows = rowsFor(address)
						for (const nextRow of Array.isArray(row) ? row : [row]) {
							const index = rows.findIndex((existingRow) => (
								existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
								&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
								&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
								&& existingRow.valueKey === nextRow.valueKey
							))
							if (index >= 0)
								rows.splice(index, 1)
							rows.push(nextRow)
						}
					events.push({
						selectorKey,
						authorityKey,
						resolution,
						rowCount: Array.isArray(row) ? row.length : 1,
					})
						return Promise.resolve(onApplied?.()).then(() => {})
					}
					if (!queueMutations)
						return apply()

					return new Promise<void>((resolve, reject) => {
						queuedMutationApplications.push(() => apply().then(resolve, reject))
					})
				},
				deleteSelectorRowsAndAuthority: (
					predicate: (row: MockRow) => boolean,
					selectorKey: string
				) => {
					const rows = rowsFor(address)
					for (let index = rows.length - 1; index >= 0; index--)
						if (predicate(rows[index]))
							rows.splice(index, 1)
					for (let index = events.length - 1; index >= 0; index--)
						if (events[index].selectorKey === selectorKey)
							events.splice(index, 1)
				},
			},
		})
		const context: LocalMutationContext = {
			entityCollections: new Proxy({}, {
				get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
			}),
			entityFieldCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
				}),
			}),
			entityFieldCountCollections: new Proxy({}, {
				get: (_target, entityType: string) => new Proxy({}, {
					get: (_fields, fieldName: string) => collectionFor(`count:${entityType}:${fieldName}`),
				}),
			}),
		}
		const {
			entitySelector: cashuMintQuoteSelector,
			observationEntitySelector: cashuMintQuoteObservationSelector,
		} = await writeLocalBlockheadCashuMintQuote(
			context,
			{
				mintUrl: 'https://mint.example',
				method: 'bolt11',
				quoteId: 'quote-1',
				request: 'lnbc-invoice',
				amount: 21n,
				unit: 'sat',
			},
			{
				timestampMs: 1_700_000_000_000,
				source: Source.CashuMint_Rest,
				state: 'UNPAID',
				expiryMs: 1_700_000_100_000,
			}
		)
		expect(cashuMintQuoteObservationSelector).toEqual({
			$mintQuote: cashuMintQuoteSelector,
			timestampMs: 1_700_000_000_000,
			source: Source.CashuMint_Rest,
		})
		expect(context.entityCollections[EntityType.BlockheadCashuMintQuote].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: cashuMintQuoteSelector,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadCashuMintQuote][entityFieldAddressKey(
			EntityType.BlockheadCashuMintQuote,
			[],
			'amount'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 21n,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadCashuMintQuote_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadCashuMintQuote_Timestamp,
			[],
			'state'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: 'UNPAID',
			}),
		])
		const firstAccount = {
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0x1111111111111111111111111111111111111111',
			capabilities: [],
		}
		const secondAccount = {
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0x2222222222222222222222222222222222222222',
			capabilities: [],
		}
		const connection = {
			connectionKey: 'connection-1',
			walletId: 'wallet-1',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1,
			scopes: [],
			accounts: [
				firstAccount,
				secondAccount,
			],
			activeAccount: secondAccount,
		}
		await writeLocalBlockheadWallet(context, {
			id: connection.walletId,
			name: 'Wallet 1',
			icon: '',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			capabilities: [WalletCapability.Connect],
		})
		expect(persistedAddresses.indexOf(`field:${EntityType._Global}:${entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWallets'
		)}`)).toBeGreaterThan(persistedAddresses.indexOf(`entity:${EntityType.BlockheadWallet}`))
		expect(persistedAddresses.indexOf(`field:${EntityType._Global}:${entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWallets'
		)}`)).toBeGreaterThan(persistedAddresses.indexOf(`field:${EntityType.BlockheadWallet}:${entityFieldAddressKey(
			EntityType.BlockheadWallet,
			[],
			'name'
		)}`))
		expect(persistedAddresses.indexOf(`count:${EntityType._Global}:${entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWallets'
		)}`)).toBeGreaterThan(persistedAddresses.indexOf(`field:${EntityType.BlockheadWallet}:${entityFieldAddressKey(
			EntityType.BlockheadWallet,
			[],
			'protocol'
		)}`))

		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([])

		await writeLocalBlockheadWalletConnection(context, connection)
		expect(context.entityCollections[EntityType.Account].toArray).toHaveLength(0)
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(0)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([])
		expect(persistedAddresses).not.toContain(`entity:${EntityType.BlockheadAccount}`)
		expect(persistedAddresses).not.toContain(`field:${EntityType._Global}:${entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)}`)
		const activeAccountRow = context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$activeAccount'
		)].toArray[0]
		expect(activeAccountRow[EntityMetaKey.Value]).toMatchObject({
			[EntityMetaKey.SelectorKey]: entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.Account],
			{
				caip10: {
					namespace: secondAccount.namespace,
					reference: secondAccount.reference,
					accountAddress: secondAccount.accountAddress,
				},
			}
			),
		})
		await writeLocalBlockheadWalletConnection(context, {
			...connection,
			accounts: [firstAccount],
			activeAccount: undefined,
		})

		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)].toArray).toHaveLength(1)
		expect(context.entityFieldCountCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)]?.toArray)
			.toEqual([
				expect.objectContaining({
					[EntityMetaKey.Value]: 1,
					filterKey: stringify({}),
				}),
			])

		persistedAddresses.length = 0
		await writeLocalBlockheadWalletConnection(context, {
			...connection,
			status: BlockheadConnectionStatus.Disconnected,
			selected: false,
			disconnectedAt: 2,
			accounts: [],
			activeAccount: undefined,
		})
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			['Connected'],
			'selected'
		)].toArray).toHaveLength(0)

		expect(context.entityCollections[EntityType.BlockheadWalletConnection].toArray).toHaveLength(1)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'status'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: BlockheadConnectionStatus.Disconnected,
			}),
		])
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWalletConnections'
		)].toArray).toHaveLength(1)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWalletConnections'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
				filterKey: stringify({}),
			}),
		])
		expect(persistedAddresses).toContain(`field:${EntityType._Global}:${entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadWalletConnections'
		)}`)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)].toArray).toHaveLength(0)
		expect(context.entityFieldCountCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 0,
				filterKey: stringify({}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$activeAccount'
		)].toArray).toHaveLength(0)
		expect(persistedAddresses).toContain(`field:${EntityType.BlockheadWalletConnection}:${entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$activeAccount'
		)}`)
		expect(events).toEqual(expect.arrayContaining([
			expect.objectContaining({
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWalletConnection,
					selectorKey: stringify({
						connectionKey: 'connection-1',
					}),
					fieldName: '$activeAccount',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$activeAccount'),
					facetPathKey: stringify([]),
				}),
				resolution: 'resolved',
			}),
			expect.objectContaining({
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType.BlockheadWalletConnection,
					selectorKey: stringify({
						connectionKey: 'connection-1',
					}),
					fieldName: '$$accounts',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts'),
					facetPathKey: stringify([]),
					filterKey: stringify({}),
				}),
				resolution: 'resolved',
			}),
		]))

		const secondConnection = {
			...connection,
			connectionKey: 'connection-2',
			accounts: [firstAccount],
			activeAccount: firstAccount,
		}
		await writeLocalBlockheadWalletConnection(context, {
			...connection,
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			disconnectedAt: undefined,
			accounts: [firstAccount],
			activeAccount: firstAccount,
		})
		await writeLocalBlockheadWalletConnection(context, secondConnection)

		expect(context.entityCollections[EntityType.BlockheadAccount].toArray).toHaveLength(0)
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(0)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([])

		await writeLocalBlockheadAccount(context, firstAccount)
		await writeLocalBlockheadAccount(context, firstAccount)
		expect(context.entityCollections[EntityType.BlockheadAccount].toArray).toHaveLength(1)
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(1)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
				filterKey: stringify({}),
			}),
		])
		const blockheadAccountRows = context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray
		blockheadAccountRows.push({
			...blockheadAccountRows[0],
			valueIndex: 99,
		})
		await writeLocalBlockheadAccount(context, firstAccount)
		expect(blockheadAccountRows).toHaveLength(2)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
				expect.objectContaining({
					[EntityMetaKey.Value]: 1,
					filterKey: stringify({}),
				}),
			])
		blockheadAccountRows.splice(1)

		await writeLocalBlockheadWalletConnection(context, {
			...connection,
			status: BlockheadConnectionStatus.Disconnected,
			selected: false,
			disconnectedAt: 3,
			accounts: [firstAccount],
			activeAccount: firstAccount,
		})
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(1)

		await writeLocalBlockheadWalletConnection(context, {
			...secondConnection,
			status: BlockheadConnectionStatus.Disconnected,
			selected: false,
			disconnectedAt: 4,
		})
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
				filterKey: stringify({}),
			}),
		])
		const exposedAccountRows = context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)].toArray
		const exposedAccountSelectorKey = entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.Account],
			{
				caip10: {
					namespace: firstAccount.namespace,
					reference: firstAccount.reference,
					accountAddress: firstAccount.accountAddress,
				},
			}
		)
		expect(exposedAccountRows).toHaveLength(2)
		expect(exposedAccountRows).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.BlockheadWalletConnection],
					{ connectionKey: connection.connectionKey }
				),
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: exposedAccountSelectorKey,
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.BlockheadWalletConnection],
					{ connectionKey: secondConnection.connectionKey }
				),
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: exposedAccountSelectorKey,
				}),
			}),
		]))

		await deleteLocalBlockheadAccount(context, firstAccount)
		expect(context.entityCollections[EntityType.BlockheadAccount].toArray).toHaveLength(0)
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(0)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 0,
				filterKey: stringify({}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$accounts'
		)].toArray).toEqual(exposedAccountRows)

		await deleteLocalBlockheadWalletConnection(context, connection.connectionKey)
		await deleteLocalBlockheadWalletConnection(context, secondConnection.connectionKey)

		writeLocalBlockheadSocialPostSession(context, {
			id: 'social-session-1',
			protocol: SocialProtocol.Atproto,
			authorKey: 'did:plc:ewvi7nxzyoun6zhxrhs64oiz',
			walletConnectionKey: 'connection-1',
			agentConversationId: 'conversation-1',
			mediaUrls: [
				'https://cdn.example/first.png',
				'https://cdn.example/second.png',
			],
		})
		writeLocalBlockheadSocialPostSession(context, {
			id: 'social-session-1',
			protocol: SocialProtocol.Atproto,
			authorKey: 'did:plc:ewvi7nxzyoun6zhxrhs64oiz',
			mediaUrls: [],
		})

		expect(context.entityFieldCollections[EntityType.BlockheadSocialPostSession][entityFieldAddressKey(
			EntityType.BlockheadSocialPostSession,
			[],
			'protocol'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: SocialProtocol.Atproto,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSocialPostSession][entityFieldAddressKey(
			EntityType.BlockheadSocialPostSession,
			[],
			'authorKey'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 'did:plc:ewvi7nxzyoun6zhxrhs64oiz',
			}),
		])
		for (const fieldName of [
			'$walletConnection',
			'$agentConversation',
			'$$media',
		])
			expect(context.entityFieldCollections[EntityType.BlockheadSocialPostSession][entityFieldAddressKey(
				EntityType.BlockheadSocialPostSession,
				[],
				fieldName
			)].toArray).toHaveLength(0)
		expect(context.entityFieldCountCollections[EntityType.BlockheadSocialPostSession][entityFieldAddressKey(
			EntityType.BlockheadSocialPostSession,
			[],
			'$$media'
		)]?.toArray)
			.toEqual([
				expect.objectContaining({
					[EntityMetaKey.Value]: 0,
				}),
			])

		const workspaceSelector = await writeLocalBlockheadWorkspace(context, {
			id: 'workspace-1',
			name: 'Workspace',
			activePanelTreeId: 'tree-1',
		})
		expect(workspaceSelector).toEqual({ id: 'workspace-1' })
		const panelTreeSelector = await writeLocalBlockheadPanelTree(context, {
			id: 'tree-1',
			workspaceId: 'workspace-1',
		})
		expect(panelTreeSelector).toEqual({ id: 'tree-1' })
		const rootPanelSelector = await writeLocalBlockheadPanel(context, {
			treeId: 'tree-1',
			panelId: 'root',
			indexInParent: 0,
			kind: 'split',
		})
		expect(rootPanelSelector).toEqual({
			treeId: 'tree-1',
			panelId: 'root',
		})
		await writeLocalBlockheadPanel(context, {
			treeId: 'tree-1',
			panelId: 'entity',
			parentPanelId: 'root',
			indexInParent: 1,
			kind: 'entity',
			entityType: EntityType.Network,
			selector: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
		})
		for (const persistedAddress of [
			`entity:${EntityType.BlockheadWorkspace}`,
			`field:${EntityType._Global}:${entityFieldAddressKey(EntityType._Global, [], '$$blockheadWorkspaces')}`,
			`entity:${EntityType.BlockheadPanelTree}`,
			`field:${EntityType._Global}:${entityFieldAddressKey(EntityType._Global, [], '$$blockheadPanelTrees')}`,
			`entity:${EntityType.BlockheadPanel}`,
			`field:${EntityType.BlockheadPanelTree}:${entityFieldAddressKey(EntityType.BlockheadPanelTree, [], '$$panels')}`,
		])
			expect(persistedAddresses).toContain(persistedAddress)

		expect(context.entityFieldCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)].toArray).toEqual([
			expect.objectContaining({
				valueIndex: 0,
			}),
			expect.objectContaining({
				valueIndex: 1,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
			}),
		])
		for (const [fieldName, value] of [
			[
				'parentPanelId',
				'root',
			],
			[
				'entityType',
				EntityType.Network,
			],
			[
				'selector',
				{
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			],
		] as const)
			expect(context.entityFieldCollections[EntityType.BlockheadPanel][entityFieldAddressKey(
				EntityType.BlockheadPanel,
				[],
				fieldName
			)].toArray).toEqual([
				expect.objectContaining({
					[EntityMetaKey.Value]: value,
				}),
			])

		await writeLocalBlockheadPanel(context, {
			treeId: 'tree-1',
			panelId: 'entity',
			parentPanelId: 'root',
			indexInParent: 1,
			kind: 'empty',
		})
		for (const fieldName of [
			'entityType',
			'selector',
		])
			expect(context.entityFieldCollections[EntityType.BlockheadPanel][entityFieldAddressKey(
				EntityType.BlockheadPanel,
				[],
				fieldName
			)].toArray).toHaveLength(0)

		deleteLocalBlockheadPanel(context, 'tree-1', 'entity')
		expect(context.entityCollections[EntityType.BlockheadPanel].toArray).toHaveLength(1)
		expect(context.entityFieldCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)].toArray).toHaveLength(1)
		expect(context.entityFieldCountCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])

		await writeLocalBlockheadPanelTree(context, {
			id: 'tree-duplicate',
			workspaceId: 'workspace-1',
		})
		await writeLocalBlockheadPanel(context, {
			treeId: 'tree-duplicate',
			panelId: 'root',
			indexInParent: 0,
			kind: 'empty',
		})
		const panelRows = context.entityFieldCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)].toArray
		const duplicatePanelRow = panelRows.find((row) => (
			Object(row[EntityMetaKey.ParentSelector]).id === 'tree-duplicate'
		))
		expect(duplicatePanelRow).toBeDefined()
		if (duplicatePanelRow !== undefined)
			panelRows.push({
				...duplicatePanelRow,
				valueIndex: 1,
			})
		await writeLocalBlockheadPanel(context, {
			treeId: 'tree-duplicate',
			panelId: 'root',
			indexInParent: 0,
			kind: 'empty',
		})
		expect(context.entityFieldCountCollections[EntityType.BlockheadPanelTree][entityFieldAddressKey(
			EntityType.BlockheadPanelTree,
			[],
			'$$panels'
		)]?.toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelector]: {
				id: 'tree-duplicate',
			},
			[EntityMetaKey.Value]: 1,
		}))
		writeLocalBlockheadLocalMediaIngest(context, {
			ingestId: 'ingest-1',
			fileName: 'draft.png',
			mimeType: 'image/png',
			size: 4,
			sha256: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			mediaUrl: 'https://cdn.example/draft.png',
		})
		writeLocalBlockheadLocalMediaIngest(context, {
			ingestId: 'ingest-1',
			fileName: 'draft.png',
			mimeType: 'image/png',
			size: 4,
			sha256: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})

		expect(context.entityFieldCollections[EntityType.BlockheadLocalMediaIngest][entityFieldAddressKey(
			EntityType.BlockheadLocalMediaIngest,
			[],
			'sha256'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadLocalMediaIngest][entityFieldAddressKey(
			EntityType.BlockheadLocalMediaIngest,
			[],
			'$media'
		)].toArray).toHaveLength(0)

		const walletRequestSelector = {
			id: 'wallet-request-1',
		}
		const walletConnectionSelector = {
			connectionKey: 'wallet-session',
		}
		const accountSelector = {
			caip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
		}
		const walletConnections = [connectedWalletConnection({
			walletId: 'eip6963:wallet-session',
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			connectionKey: walletConnectionSelector.connectionKey,
			scopes: [{
				namespace: accountSelector.caip10.namespace,
				reference: accountSelector.caip10.reference,
				methods: ['wallet_sendCalls'],
				events: [],
			}],
			accounts: [{
				...accountSelector.caip10,
				capabilities: [WalletCapability.SendTransaction],
			}],
			activeAccount: {
				...accountSelector.caip10,
				capabilities: [WalletCapability.SendTransaction],
			},
			selected: true,
		})]
		const networkSelector = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}
		const simulationSelector = {
			id: 'wallet-request-simulation',
		}
		const sessionActionSelector = {
			sessionId: 'wallet-request-session',
			actionId: 'wallet-request-action',
		}
		const intentOrderSelector = {
			id: 'wallet-request-order',
		}
		const walletRequestDefinition = {
			id: 'wallet-request-1',
			sessionAction: sessionActionSelector,
			intentOrder: intentOrderSelector,
			walletConnection: walletConnectionSelector,
			account: accountSelector,
			requestKind: 'transaction',
			requestMethod: 'wallet_sendCalls',
			atomicRequired: true,
			requestPayloadHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			requestedAt: 1,
			evm: {
				network: networkSelector,
				simulation: simulationSelector,
				calls: [
					{
						toAddress: '0x1111111111111111111111111111111111111111',
						value: 1n,
						inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					},
					{
						toAddress: '0x2222222222222222222222222222222222222222',
						value: 2n,
						inputDataHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
					},
				],
			},
		} as const satisfies Parameters<typeof writeLocalBlockheadWalletRequest>[1]
		await writeLocalBlockheadWalletRequest(context, walletRequestDefinition, walletConnections)
		const evmWalletRequestSelector = {
			$walletRequest: walletRequestSelector,
		}
		expect(context.entityCollections[EntityType.BlockheadEvmWalletRequest].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: evmWalletRequestSelector,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest,
			[],
			'$walletConnection'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: walletConnectionSelector,
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest,
			[],
			'$account'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: accountSelector,
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest,
			[],
			'$evmRequest'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: evmWalletRequestSelector,
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadEvmWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadEvmWalletRequest,
			[],
			'$walletRequest'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: walletRequestSelector,
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadEvmWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadEvmWalletRequest,
			[],
			'$network'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: networkSelector,
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadEvmWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadEvmWalletRequest,
			[],
			'$simulation'
		)].toArray[0]?.[EntityMetaKey.Value]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: simulationSelector,
		}))
		expect(context.entityCollections[EntityType.EvmTransaction].toArray).toHaveLength(0)
		expect(persistedAddresses).not.toContain(`entity:${EntityType.EvmTransaction}`)
		const walletRequestCallRows = context.entityFieldCollections[EntityType.BlockheadEvmWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadEvmWalletRequest,
			[],
			'$$calls'
		)].toArray
		expect(walletRequestCallRows.map((row) => ({
			selector: Object(row[EntityMetaKey.Value])[EntityMetaKey.Selector],
			valueIndex: row.valueIndex,
		}))).toEqual([
			{
				selector: {
					$evmRequest: evmWalletRequestSelector,
					callIndex: 0,
				},
				valueIndex: 0,
			},
			{
				selector: {
					$evmRequest: evmWalletRequestSelector,
					callIndex: 1,
				},
				valueIndex: 1,
			},
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequestCall][entityFieldAddressKey(
			EntityType.BlockheadWalletRequestCall,
			[],
			'callIndex'
		)].toArray.map((row) => row[EntityMetaKey.Value])).toEqual([0, 1])
		await expect(writeLocalBlockheadWalletRequest(context, {
			...walletRequestDefinition,
			requestMethod: 'eth_sendTransaction',
		}, walletConnections)).rejects.toThrow('Wallet request definition already exists: wallet-request-1')
		await expect(writeLocalBlockheadEvmWalletRequest(
			context,
			walletRequestSelector,
			{
				...walletRequestDefinition.evm,
				calls: [],
			}
		)).rejects.toThrow('EVM wallet request detail already exists: wallet-request-1')
		await expect(writeLocalBlockheadWalletRequest(context, {
			...walletRequestDefinition,
			id: 'wallet-request-empty-calls',
			evm: {
				...walletRequestDefinition.evm,
				calls: [],
			},
		}, walletConnections)).rejects.toThrow('Wallet request preparation requires at least one BlockheadWalletRequestCall.')
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest,
			[],
			'requestMethod'
		)].toArray[0]?.[EntityMetaKey.Value]).toBe('wallet_sendCalls')
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: 1,
			source: Source.Local_Internal,
			status: 'requested',
			evmTransactions: [
				{
					$network: networkSelector,
					txHash: '0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
				},
				{
					$network: networkSelector,
					txHash: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				},
			],
		})
		await writeLocalBlockheadWalletRequestSubmittedAt(context, walletRequestSelector, 2)
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: 2,
			source: Source.Local_Internal,
			status: 'signed',
			signatureHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		})
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: 3,
			source: Source.Local_Internal,
			status: 'audit-failed',
			error: 'audit history persistence failed',
		})
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: 3,
			source: Source.Local_Internal,
			status: 'tampered',
			error: 'must not replace durable history',
		})
		expect(walletRequestCallRows.map((row) => row.valueIndex)).toEqual([0, 1])
		expect(context.entityFieldCountCollections[EntityType.BlockheadEvmWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadEvmWalletRequest,
			[],
			'$$calls'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest_Timestamp,
			[],
			'$$evmTransactions'
		)].toArray.map((row) => ({
			selector: Object(row[EntityMetaKey.Value])[EntityMetaKey.Selector],
			valueIndex: row.valueIndex,
		}))).toEqual([
			{
				selector: {
					$network: networkSelector,
					txHash: '0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
				},
				valueIndex: 0,
			},
			{
				selector: {
					$network: networkSelector,
					txHash: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				},
				valueIndex: 1,
			},
		])
		expect(context.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].toArray).toHaveLength(3)
		expect(context.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest_Timestamp,
			[],
			'status'
		)].toArray.map((row) => row[EntityMetaKey.Value])).toEqual([
			'requested',
			'signed',
			'audit-failed',
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(
			EntityType.BlockheadWalletRequest,
			[],
			'$$timestamps'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 3,
			}),
		])

		const preparationSessionSelector = {
			id: 'session-preparation',
		}
		const preparationActionSelector = {
			sessionId: preparationSessionSelector.id,
			actionId: 'action-transfer',
		}
		await writeLocalBlockheadTransferIntent(context, {
			...preparationActionSelector,
			fromCaip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0x1111111111111111111111111111111111111111',
			},
			toCaip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0x2222222222222222222222222222222222222222',
			},
			chainId: 1,
			amount: 1n,
		})
		await writeLocalBlockheadTransferIntent(context, {
			...preparationActionSelector,
			chainId: 1,
			amount: 2n,
		})
		const transferIntentSelectorKey = entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadTransferIntent],
			preparationActionSelector
		)
		expect(context.entityCollections[EntityType.BlockheadTransferIntent].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: transferIntentSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadTransferIntent][entityFieldAddressKey(
			EntityType.BlockheadTransferIntent,
			[],
			'amount'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.ParentSelectorKey]: transferIntentSelectorKey,
				[EntityMetaKey.Value]: 2n,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadTransferIntent][entityFieldAddressKey(
			EntityType.BlockheadTransferIntent,
			[],
			'fromCaip10'
		)].toArray).toHaveLength(0)
		expect(context.entityFieldCollections[EntityType.BlockheadTransferIntent][entityFieldAddressKey(
			EntityType.BlockheadTransferIntent,
			[],
			'$sessionAction'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(preparationActionSelector),
				}),
			}),
		])

		const invocationSelector = await writeLocalBlockheadIntentInvocation(
			context,
			preparationSessionSelector,
			{
				invocationId: 'invocation-1',
				modality: 'click',
				sourceEntityType: EntityType.Account,
				sourceSelector: {
					caip10: {
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0x1111111111111111111111111111111111111111',
					},
				},
				targetEntityType: EntityType.Account,
				targetSelector: {
					caip10: {
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0x2222222222222222222222222222222222222222',
					},
				},
				createdAt: 20,
				createdAction: preparationActionSelector,
			}
		)
		expect(invocationSelector).toEqual({
			sessionId: preparationSessionSelector.id,
			invocationId: 'invocation-1',
		})
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$$intentInvocations'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(invocationSelector),
				}),
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$$intentInvocations'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])

		const transactionSelector = {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			txHash: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
		}
		const {
			entitySelector: outcomeSelector,
			observationEntitySelector: outcomeObservationSelector,
		} = await writeLocalBlockheadActionOutcome(
			context,
			preparationActionSelector,
			{
				outcomeId: 'outcome-1',
				outcomeKind: 'transaction',
				transactionId: transactionSelector.txHash,
				createdAt: 21,
				evmTransactions: [transactionSelector],
			},
			{
				timestampMs: 22,
				source: Source.Local_Internal,
				status: 'confirmed',
				finality: 'local-final',
				transactionId: transactionSelector.txHash,
			}
		)
		expect(outcomeSelector).toEqual({
			...preparationActionSelector,
			outcomeId: 'outcome-1',
		})
		expect(outcomeObservationSelector).toEqual({
			$outcome: outcomeSelector,
			timestampMs: 22,
			source: Source.Local_Internal,
		})
		expect(context.entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'$$outcomes'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(outcomeSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadActionOutcome][entityFieldAddressKey(
			EntityType.BlockheadActionOutcome,
			[],
			'$$timestamps'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(outcomeObservationSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadActionOutcome_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadActionOutcome_Timestamp,
			[],
			'finality'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 'local-final',
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'$$outcomes'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadActionOutcome][entityFieldAddressKey(
			EntityType.BlockheadActionOutcome,
			[],
			'$$timestamps'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])
		const readinessCheck = {
			checkId: 'rpc-simulation',
			checkKind: 'rpc-simulation',
			chainId: 1,
			createdAt: 10,
		}
		const readinessCheckSelector = {
			...preparationActionSelector,
			checkId: readinessCheck.checkId,
		}
		await writeLocalBlockheadActionReadinessChecks(
			context,
			preparationActionSelector,
			[{
				check: readinessCheck,
				observation: {
					timestampMs: 10,
					source: Source.Voltaire_JsonRpc,
					status: 'blocked',
					error: 'first simulation failed',
				},
			}]
		)
		const recoveredReadiness = [{
			check: readinessCheck,
			observation: {
				timestampMs: 11,
				source: Source.Voltaire_JsonRpc,
				status: 'ready',
			},
		}]
		await writeLocalBlockheadActionReadinessChecks(
			context,
			preparationActionSelector,
			recoveredReadiness
		)
		await writeLocalBlockheadActionReadinessChecks(
			context,
			preparationActionSelector,
			recoveredReadiness
		)
		expect(context.entityCollections[EntityType.BlockheadActionReadinessCheck].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: stringify(readinessCheckSelector),
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
		])
		expect(context.entityCollections[EntityType.BlockheadActionReadinessCheck_Timestamp].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'$$readinessChecks'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 1,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadActionReadinessCheck][entityFieldAddressKey(
			EntityType.BlockheadActionReadinessCheck,
			[],
			'$$timestamps'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadActionReadinessCheck_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadActionReadinessCheck_Timestamp,
			[],
			'source'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: Source.Voltaire_JsonRpc,
			}),
			expect.objectContaining({
				[EntityMetaKey.Value]: Source.Voltaire_JsonRpc,
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadActionReadinessCheck_Timestamp][entityFieldAddressKey(
			EntityType.BlockheadActionReadinessCheck_Timestamp,
			[],
			'$readinessCheck'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(readinessCheckSelector),
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(readinessCheckSelector),
				}),
			}),
		])

		const firstSimulationSelector = {
			id: 'simulation-1',
		}
		await writeLocalBlockheadSessionSimulation(
			context,
			preparationSessionSelector,
			{
				...firstSimulationSelector,
				status: 'succeeded',
				createdAt: 10,
				completedAt: 11,
				paramsHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				forkBlockNumber: 1n,
				forkRpcOrigin: 'https://ethereum.example',
				actionCount: 1,
				gasUsed: 21_000n,
				resultPayloadHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			},
			[{
				callPath: '0',
				depth: 0,
				callIndex: 0,
				callType: 'CALL',
				gasUsed: 21_000n,
				reverted: false,
			}, {
				callPath: '0.0',
				parentCallPath: '0',
				depth: 1,
				callIndex: 0,
				callType: 'STATICCALL',
				gasUsed: 1_500n,
				reverted: false,
			}],
			[{
				logIndex: 0,
				callPath: '0.0',
				address: '0x1111111111111111111111111111111111111111',
				topic0: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				topics: [
					'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					'0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				],
				dataHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
				decodedEventName: 'Transfer',
				decodedArgs: { amount: '100' },
				removed: false,
			}]
		)
		const failedSimulationSelector = {
			id: 'simulation-2',
		}
		await writeLocalBlockheadSessionSimulation(
			context,
			preparationSessionSelector,
			{
				...failedSimulationSelector,
				status: 'failed',
				createdAt: 12,
				completedAt: 12,
				paramsHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				actionCount: 1,
				error: 'execution transport unavailable',
			}
		)
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(2)
		expect(context.entityCollections[EntityType.BlockheadSessionSimulationCall].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: stringify({
					simulationId: firstSimulationSelector.id,
					callPath: '0',
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: stringify({
					simulationId: firstSimulationSelector.id,
					callPath: '0.0',
				}),
			}),
		])
		expect(context.entityCollections[EntityType.BlockheadSessionSimulationLog].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: stringify({
					simulationId: firstSimulationSelector.id,
					logIndex: 0,
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSessionSimulationCall][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulationCall,
			[],
			'$simulation'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(firstSimulationSelector),
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(firstSimulationSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSessionSimulationLog][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulationLog,
			[],
			'$simulation'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(firstSimulationSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulation,
			[],
			'resultPayloadHash'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelector]: firstSimulationSelector,
			[EntityMetaKey.Value]: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		}))
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$latestSimulation'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(failedSimulationSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'simulationCount'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$$simulations'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
			}),
		])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulation,
			[],
			'$$calls'
		)]?.toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: firstSimulationSelector,
				[EntityMetaKey.Value]: 2,
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: failedSimulationSelector,
				[EntityMetaKey.Value]: 0,
			}),
		]))
		const simulationSelectorKey = stringify(firstSimulationSelector)
		const simulationCallsAuthorityKey = localMutationAuthorityKey({
			source: Source.Local_Internal,
			entityType: EntityType.BlockheadSessionSimulation,
			selectorKey: simulationSelectorKey,
			fieldName: '$$calls',
			fieldAddressKey: entityFieldAddressKey(
				EntityType.BlockheadSessionSimulation,
				[],
				'$$calls'
			),
			facetPathKey: stringify([]),
		})
		expect(events.filter((event) => (
			event.selectorKey === simulationSelectorKey
			&& event.authorityKey === simulationCallsAuthorityKey
		))).toEqual([expect.objectContaining({
			resolution: 'resolved',
			rowCount: 2,
		})])
		expect(context.entityFieldCountCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulation,
			[],
			'$$logs'
		)]?.toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: firstSimulationSelector,
				[EntityMetaKey.Value]: 1,
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: failedSimulationSelector,
				[EntityMetaKey.Value]: 0,
			}),
		]))
		expect(context.entityFieldCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(
			EntityType.BlockheadSessionSimulation,
			[],
			'error'
		)].toArray).toContainEqual(expect.objectContaining({
			[EntityMetaKey.ParentSelector]: failedSimulationSelector,
			[EntityMetaKey.Value]: 'execution transport unavailable',
		}))
		const reloadedRowsByAddress = new Map([...rowsByAddress].map(([address, rows]) => [
			address,
			rows.map((row) => ({ ...row })),
		]))
		expect(reloadedRowsByAddress.get(`entity:${EntityType.BlockheadSessionSimulation}`)).toHaveLength(2)
		expect(reloadedRowsByAddress.get(`field:${EntityType.BlockheadSession}:${entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$latestSimulation'
		)}`)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(failedSimulationSelector),
				}),
			}),
		])
		queueMutations = true
		const queuedSimulationSelector = {
			id: 'simulation-queued',
		}
		const queuedSimulationWrite = writeLocalBlockheadSessionSimulation(
			context,
			preparationSessionSelector,
			{
				...queuedSimulationSelector,
				status: 'failed',
				createdAt: 13,
				completedAt: 13,
				paramsHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				actionCount: 1,
				error: 'queued failure',
			}
		)
		await Promise.resolve()
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(2)
		expect(queuedMutationApplications.length).toBeGreaterThan(0)
		queueMutations = false
		while (queuedMutationApplications.length > 0) {
			await queuedMutationApplications[0]()
			queuedMutationApplications.splice(0, 1)
		}
		await queuedSimulationWrite
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(3)
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'$latestSimulation'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: expect.objectContaining({
					[EntityMetaKey.SelectorKey]: stringify(queuedSimulationSelector),
				}),
			}),
		])
		expect(context.entityFieldCollections[EntityType.BlockheadSession][entityFieldAddressKey(
			EntityType.BlockheadSession,
			[],
			'simulationCount'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 3,
			}),
		])
		expect(persistedAddresses).toEqual(expect.arrayContaining([
			`entity:${EntityType.BlockheadWalletRequest}`,
			`entity:${EntityType.BlockheadWalletRequest_Timestamp}`,
			`entity:${EntityType.BlockheadTransferIntent}`,
			`entity:${EntityType.BlockheadActionReadinessCheck}`,
			`entity:${EntityType.BlockheadActionReadinessCheck_Timestamp}`,
			`entity:${EntityType.BlockheadSessionSimulation}`,
			`entity:${EntityType.BlockheadSessionSimulationCall}`,
			`field:${EntityType.BlockheadWalletRequest}:${entityFieldAddressKey(
				EntityType.BlockheadWalletRequest,
				[],
				'$$timestamps'
			)}`,
			`field:${EntityType._Global}:${entityFieldAddressKey(
				EntityType._Global,
				[],
				'$$blockheadWalletRequests'
			)}`,
			`field:${EntityType.BlockheadSession}:${entityFieldAddressKey(
				EntityType.BlockheadSession,
				[],
				'$latestSimulation'
			)}`,
			`field:${EntityType.BlockheadSession}:${entityFieldAddressKey(
				EntityType.BlockheadSession,
				[],
				'simulationCount'
			)}`,
			`count:${EntityType.BlockheadSession}:${entityFieldAddressKey(
				EntityType.BlockheadSession,
				[],
				'$$simulations'
			)}`,
			`count:${EntityType.BlockheadSessionSimulation}:${entityFieldAddressKey(
				EntityType.BlockheadSessionSimulation,
				[],
				'$$calls'
			)}`,
		]))
	})
})
