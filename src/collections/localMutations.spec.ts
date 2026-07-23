import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { stringify } from 'devalue'
import { type as arktype } from 'arktype'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { ActionType } from '$/constants/actions.ts'
import {
	localMutationAuthorityKey,
} from '$/client/$client.svelte.ts'
import {
	deleteLocalBlockheadPanel,
	deleteLocalBlockheadSession,
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadLocalMediaIngest,
	writeLocalBlockheadPanel,
	writeLocalBlockheadPanelTree,
	writeLocalBlockheadSession,
	writeLocalBlockheadSessionAction,
	updateLocalBlockheadSessionActionType,
	writeLocalBlockheadSocialPostSession,
	writeLocalBlockheadWorkspace,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
	writeLocalBlockheadWalletRequest,
} from '$/collections/localMutations.ts'
import { SocialProtocol } from '$/schema/BlockheadSocialPostSession.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
	parseEntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const source = readFileSync(resolve('src/collections/localMutations.ts'), 'utf8')
const farcasterMutationSource = source.slice(
	source.indexOf('export const writeLocalBlockheadFarcasterAccountConnection'),
	source.indexOf('export const writeLocalBlockheadSocialPostSession')
)
const workspaceMutationSource = source.slice(
	source.indexOf('export const writeLocalBlockheadWorkspace'),
	source.indexOf('export const writeLocalBlockheadWallet')
)

describe('local Farcaster account connection mutations', () => {
	it('persists verified Farcaster connection state without proof material', () => {
		expect(farcasterMutationSource).toContain('associationFingerprint: connection.associationFingerprint')
		expect(farcasterMutationSource).toContain('expiresAt: connection.expiresAt')
		expect(farcasterMutationSource).not.toMatch(/\b(?:challenge|signature|nonce)\b/)
	})

	it('keeps connection identity stable and disconnect deletion atomic', () => {
		expect(farcasterMutationSource).toContain('connectionId: connection.connectionId')
		expect(farcasterMutationSource).toContain('deleteLocalEntityFields(')
		expect(farcasterMutationSource).toContain('deleteLocalPresence(')
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
					resolution: 'present' | 'resolved' | 'deleted'
				): void
				writeUpsert(row: MockRow | readonly MockRow[]): void
				writeUpsertWithAuthority(
					row: MockRow | readonly MockRow[],
					selectorKey: string,
					authorityKey: string,
					resolution: 'present' | 'resolved' | 'deleted'
				): void
				deleteSelectorRowsAndAuthority(
					predicate: (row: MockRow) => boolean,
					selectorKey: string
				): void
			}
		}
		const collectionByAddress = new Map<string, MockCollection>()
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
					waitForPersistence: async () => {},
					replaceRows: (predicate, nextRows) => {
						for (let index = rows.length - 1; index >= 0; index--)
							if (predicate(rows[index]))
								rows.splice(index, 1)
						rows.push(...nextRows)
					},
					replaceRowsWithAuthority: (predicate, nextRows, selectorKey, authorityKey, resolution) => {
						collection.utils.replaceRows(predicate, nextRows)
						events.push({
							selectorKey,
							authorityKey,
							resolution,
						})
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
					writeUpsertWithAuthority: (row, selectorKey, authorityKey, resolution) => {
						collection.utils.writeUpsert(row)
						events.push({
							selectorKey,
							authorityKey,
							resolution,
						})
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
		await writeLocalBlockheadSessionAction(
			context,
			sessionSelector,
			0,
			ActionType.Transfer
		)
		const actionRow = entityCollections[EntityType.BlockheadSessionAction].toArray[0]
		const actionSelectorKey = actionRow[EntityMetaKey.SelectorKey]
		const actionSelector = parseEntitySelector(
			schema,
			entityDefinitionByType[EntityType.BlockheadSessionAction],
			actionRow[EntityMetaKey.Selector]
		)
		if (actionSelector instanceof arktype.errors)
			throw actionSelector
		await updateLocalBlockheadSessionActionType(
			context,
			actionSelector,
			sessionSelector,
			0,
			10,
			ActionType.Bridge,
			{
				fromChainId: 1,
				toChainId: 10,
				tokenAddress: '0x0000000000000000000000000000000000000000',
				amount: 2n,
				slippage: 0.005,
			}
		)
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: actionSelectorKey,
			}),
		])
		expect(entityFieldCollections[EntityType.BlockheadSessionAction][entityFieldAddressKey(
			EntityType.BlockheadSessionAction,
			[],
			'actionParams'
		)].toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.ParentSelectorKey]: actionSelectorKey,
				[EntityMetaKey.Value]: expect.objectContaining({
					amount: 2n,
				}),
			}),
		])
		expect(() => writeLocalBlockheadSessionAction(
			context,
			sessionSelector,
			1,
			ActionType.Transfer,
			{
				amount: 'invalid',
			}
		)).toThrow()
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toHaveLength(1)

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
		const events: {
			selectorKey: string
			authorityKey: string
			resolution: 'present' | 'resolved' | 'deleted'
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
					resolution: 'present' | 'resolved' | 'deleted'
				) => {
					const rows = rowsFor(address)
					for (let index = rows.length - 1; index >= 0; index--)
						if (predicate(rows[index]))
							rows.splice(index, 1)
					rows.push(...nextRows)
					events.push({
						selectorKey,
						authorityKey,
						resolution,
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
					resolution: 'present' | 'resolved' | 'deleted'
				) => {
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
		)].toArray).toHaveLength(2)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
				filterKey: stringify({}),
			}),
		])
		expect(events).toEqual(expect.arrayContaining([
			expect.objectContaining({
				authorityKey: localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: EntityType._Global,
					selectorKey: stringify({
						scope: '$$blockheadAccounts',
					}),
					fieldName: '$$blockheadAccounts',
					fieldAddressKey: entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts'),
					facetPathKey: stringify([]),
				}),
				resolution: 'resolved',
			}),
		]))
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

		await deleteLocalBlockheadWalletConnection(context, connection.connectionKey)
		expect(context.entityFieldCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)].toArray).toHaveLength(2)
		expect(context.entityFieldCountCollections[EntityType._Global][entityFieldAddressKey(
			EntityType._Global,
			[],
			'$$blockheadAccounts'
		)]?.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 2,
				filterKey: stringify({}),
			}),
		])

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

		writeLocalBlockheadWorkspace(context, {
			id: 'workspace-1',
			name: 'Workspace',
			activePanelTreeId: 'tree-1',
		})
		writeLocalBlockheadPanelTree(context, {
			id: 'tree-1',
			workspaceId: 'workspace-1',
		})
		writeLocalBlockheadPanel(context, {
			treeId: 'tree-1',
			panelId: 'root',
			indexInParent: 0,
			kind: 'split',
		})
		writeLocalBlockheadPanel(context, {
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

		writeLocalBlockheadPanel(context, {
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
		expect(workspaceMutationSource).not.toMatch(/\b(?:focus|hover)\w*/i)

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

		await writeLocalBlockheadWalletRequest(context, {
			id: 'wallet-request-1',
			walletConnectionKey: 'wallet-session',
			walletProtocol: WalletProtocol.Eip6963,
			caip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
			requestKind: 'message-signature',
			requestMethod: 'personal_sign',
			requestPayloadHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			requestedAt: 1,
			timestamps: [{
				timestampMs: 1,
				source: Source.Local_Internal,
				status: 'requested',
			}],
		})
		expect(persistedAddresses).toEqual(expect.arrayContaining([
			`entity:${EntityType.BlockheadWalletRequest}`,
			`entity:${EntityType.BlockheadWalletRequest_Timestamp}`,
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
		]))
	})
})
