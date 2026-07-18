import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { stringify } from 'devalue'
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
	deleteLocalBlockheadSession,
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadLocalMediaIngest,
	writeLocalBlockheadSession,
	writeLocalBlockheadSessionAction,
	writeLocalBlockheadSocialPostSession,
	writeLocalBlockheadWorkspace,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
} from '$/collections/localMutations.ts'
import { SocialProtocol } from '$/schema/BlockheadSocialPostSession.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const source = readFileSync(resolve('src/collections/localMutations.ts'), 'utf8')
const farcasterMutationSource = source.slice(
	source.indexOf('export const writeLocalBlockheadFarcasterAccountConnection'),
	source.indexOf('export const writeLocalBlockheadSocialPostSession')
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
	it('records exact field, relationship, count, absence, and deletion authority', () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		const events: {
			selectorKey: string
			authorityKey: string
			resolution: 'present' | 'resolved' | 'deleted'
		}[] = []
		type MockCollection = {
			toArray: MockRow[]
			delete(key: string): void
			utils: {
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
				utils: {
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

		writeLocalBlockheadWallet(context, {
			id: 'wallet-1',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			capabilities: [WalletCapability.Connect],
		})
		writeLocalBlockheadWalletConnection(context, {
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
					fieldName: '$$connectedAccounts',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$connectedAccounts'),
					facetPathKey: stringify([]),
					filterKey: stringify({}),
				}),
				resolution: 'resolved',
			}),
		]))

		deleteLocalBlockheadWalletConnection(context, 'connection-1')

		expect(events.some((event) => event.selectorKey === connectionSelectorKey)).toBe(false)

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
		const sessionSelector = writeLocalBlockheadSession(
			context,
			sessionParentSelector,
			'Authority session'
		)
		writeLocalBlockheadSessionAction(
			context,
			sessionSelector,
			0,
			ActionType.Transfer
		)
		const actionSelectorKey = entityCollections[EntityType.BlockheadSessionAction]
			.toArray[0][EntityMetaKey.SelectorKey]

		deleteLocalBlockheadSession(context, sessionParentSelector, sessionSelector)

		expect(entityCollections[EntityType.BlockheadSession].toArray).toHaveLength(0)
		expect(entityCollections[EntityType.BlockheadSessionAction].toArray).toHaveLength(0)
		expect(events.some((event) => event.selectorKey === actionSelectorKey)).toBe(false)
	})

	it('reconciles connection relationships before declaring count and absence authority', () => {
		type MockRow = Record<string, object | string | number | boolean | bigint | undefined>
		const rowsByAddress = new Map<string, MockRow[]>()
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
			utils: {
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

		writeLocalBlockheadWalletConnection(context, connection)
		const activeAccountRow = context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$activeAccount'
		)].toArray[0]
		expect(activeAccountRow[EntityMetaKey.Value]).toMatchObject({
			[EntityMetaKey.SelectorKey]: entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadWalletAccount],
			{
				caip10: {
					namespace: secondAccount.namespace,
					reference: secondAccount.reference,
					accountAddress: secondAccount.accountAddress,
				},
			}
			),
		})
		writeLocalBlockheadWalletConnection(context, {
			...connection,
			accounts: [firstAccount],
			activeAccount: undefined,
		})

		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$connectedAccounts'
		)].toArray).toHaveLength(1)
		expect(context.entityFieldCountCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$$connectedAccounts'
		)]?.toArray)
			.toEqual([
				expect.objectContaining({
					[EntityMetaKey.Value]: 1,
					filterKey: stringify({}),
				}),
			])

		writeLocalBlockheadWalletConnection(context, {
			...connection,
			accounts: [],
			activeAccount: undefined,
		})

		expect(context.entityFieldCollections[EntityType.BlockheadWalletConnection][entityFieldAddressKey(
			EntityType.BlockheadWalletConnection,
			[],
			'$activeAccount'
		)].toArray).toHaveLength(0)
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
					fieldName: '$$connectedAccounts',
					fieldAddressKey: entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$connectedAccounts'),
					facetPathKey: stringify([]),
					filterKey: stringify({}),
				}),
				resolution: 'resolved',
			}),
		]))

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
			activePanelTreeId: 'tree-1',
		})
		writeLocalBlockheadWorkspace(context, {
			id: 'workspace-1',
		})
		expect(context.entityFieldCollections[EntityType.BlockheadWorkspace][entityFieldAddressKey(
			EntityType.BlockheadWorkspace,
			[],
			'$activePanelTree'
		)].toArray).toHaveLength(0)

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
	})
})
