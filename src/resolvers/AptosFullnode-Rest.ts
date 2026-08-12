import { networkBySlug } from '$/constants/Network.ts'
import { resolverSourceBinding } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	AptosAccount,
	AptosBlock,
	AptosEvent,
	AptosResponseMetadata,
	AptosTransaction,
	AptosWriteSetChange,
} from '$/sources/AptosFullnode/Rest/types.ts'

type AptosNetworkIdentity = EntitySelector<typeof schema, EntityType.AptosNetwork>
type AptosTransactionIdentity = EntitySelector<typeof schema, EntityType.AptosTransaction>
type AptosTransactionHashIdentity = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.AptosTransaction,
	'NetworkHash'
>
type AptosTransactionVersionIdentity = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.AptosTransaction,
	'NetworkVersion'
>
type AptosCommittedTransaction = Exclude<AptosTransaction, { type: 'pending_transaction' }>
type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const aptosNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.aptos.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.aptos.slug,
		},
	},
] as const

const aptosNetworkReferenceApplicability = [
	{
		$network: aptosNetworkApplicability[0],
	},
	{
		$network: aptosNetworkApplicability[1],
	},
] as const

const aptosAccountReferenceApplicability = [
	{
		$account: aptosNetworkReferenceApplicability[0],
	},
	{
		$account: aptosNetworkReferenceApplicability[1],
	},
] as const

const assertAptosMainnet = (network: NetworkId) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.aptos.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.aptos.caip2.namespace
			&& network.caip2.reference === networkBySlug.aptos.caip2.reference
		)
	)
		throw new Error('AptosFullnode_Rest: unsupported network')
}

const bigintFromWire = (
	value: string,
	fieldName: string
) => {
	try {
		return BigInt(value)
	} catch {
		throw new Error(`AptosFullnode_Rest: malformed ${fieldName}`)
	}
}

const timestampMsFromMicroseconds = (
	value: string,
	fieldName: string
) => {
	const timestampMs = Number(bigintFromWire(value, fieldName) / 1_000n)
	if (!Number.isSafeInteger(timestampMs))
		throw new Error(`AptosFullnode_Rest: malformed ${fieldName}`)

	return timestampMs
}

const assertSource = (source: string) => {
	if (source !== Source.AptosFullnode_Rest)
		throw new Error('AptosFullnode_Rest: observation source mismatch')
}

const metadataFields = (metadata: AptosResponseMetadata) => ({
	ledgerVersion: bigintFromWire(metadata.ledgerVersion, 'ledger version'),
	timestampMs: timestampMsFromMicroseconds(metadata.ledgerTimestampUsec, 'ledger timestamp'),
	blockHeight: bigintFromWire(metadata.blockHeight, 'block height'),
	chainId: Number(bigintFromWire(metadata.chainId, 'chain ID')),
	epoch: bigintFromWire(metadata.epoch, 'epoch'),
	oldestLedgerVersion: bigintFromWire(metadata.oldestLedgerVersion, 'oldest ledger version'),
	oldestBlockHeight: bigintFromWire(metadata.oldestBlockHeight, 'oldest block height'),
})

const committedTransaction = (transaction: AptosTransaction): AptosCommittedTransaction => {
	if (transaction.type === 'pending_transaction')
		throw new Error('AptosFullnode_Rest: transaction is not committed')

	return transaction
}

const blockFields = (
	block: AptosBlock,
	$network: AptosNetworkIdentity,
	version?: bigint
) => ({
		height: bigintFromWire(block.block_height, 'block height'),
		firstVersion: bigintFromWire(block.first_version, 'block first version'),
		lastVersion: bigintFromWire(block.last_version, 'block last version'),
		timestampMs: timestampMsFromMicroseconds(block.block_timestamp, 'block timestamp'),
		...(version != null && { version }),
		transactions: (block.transactions ?? []).map((transaction) => ({
			[EntityMetaKey.Selector]: {
				$network,
				version: bigintFromWire(committedTransaction(transaction).version, 'transaction version'),
			},
		})),
	})

const transactionFields = (
	transaction: AptosCommittedTransaction,
	$network: AptosNetworkIdentity
) => {
	const version = bigintFromWire(transaction.version, 'transaction version')
	if (transaction.hash === '')
		throw new Error('AptosFullnode_Rest: malformed transaction hash')

	const $transaction = {
		$network,
		version,
	}
	return {
		version,
		hash: transaction.hash,
		transactionKind: transaction.type,
		...('sender' in transaction && { sender: transaction.sender }),
		timestamps: [{
			[EntityMetaKey.Selector]: {
				$transaction,
				ledgerVersion: version,
				source: Source.AptosFullnode_Rest,
			},
		}],
		stateChanges: transaction.changes.map((change, changeIndex) => ({
			[EntityMetaKey.Selector]: {
				$transaction,
				changeIndex,
			},
			[EntityMetaKey.Fields]: Object.fromEntries(
				Object.entries(stateChangeFields(
					change,
					$transaction,
					version,
					'timestamp' in transaction ?
						timestampMsFromMicroseconds(transaction.timestamp, 'transaction timestamp')
						:
						undefined
				)).map(([fieldName, value]) => [
					entityFieldAddressKey(EntityType.AptosStateChange, [], fieldName),
					value,
				])
			),
		})),
		events: ('events' in transaction ? transaction.events : []).map((event, eventIndex) => (
			((fields) => ({
				[EntityMetaKey.Selector]: {
					$network,
					transactionVersion: version,
					eventIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AptosEvent, [], 'eventType')]: fields.eventType,
					[entityFieldAddressKey(EntityType.AptosEvent, [], 'accountAddress')]: fields.accountAddress,
					[entityFieldAddressKey(EntityType.AptosEvent, [], 'creationNumber')]: fields.creationNumber,
					[entityFieldAddressKey(EntityType.AptosEvent, [], 'sequenceNumber')]: fields.sequenceNumber,
					[entityFieldAddressKey(EntityType.AptosEvent, [], '$transaction')]: fields.$transaction,
					[entityFieldAddressKey(EntityType.AptosEvent, [], 'value')]: fields.value,
				},
			}))(eventFields(event, $network, version))
		)),
	}
}

const eventFields = (
	event: AptosEvent,
	$network: AptosNetworkIdentity,
	transactionVersion: bigint
) => ({
	eventType: event.type,
	accountAddress: event.guid.account_address,
	creationNumber: bigintFromWire(event.guid.creation_number, 'event creation number'),
	sequenceNumber: bigintFromWire(event.sequence_number, 'event sequence number'),
	$transaction: {
		[EntityMetaKey.Selector]: {
			$network,
			version: transactionVersion,
		},
	},
	value: event.data,
})

const accountObservationFields = (
	account: AptosAccount,
	coordinate: {
		blockHeight: bigint
		epoch?: bigint
		timestampMs: number
	}
) => ({
	sequenceNumber: bigintFromWire(account.sequence_number, 'account sequence number'),
	authenticationKey: account.authentication_key,
	...coordinate,
})

const stateChangeFields = (
	change: AptosWriteSetChange,
	$transaction: AptosTransactionIdentity,
	ledgerVersion: bigint,
	timestampMs?: number
): {
	changeKind: string
	address?: string
	stateKeyHash?: string
	resourceType?: string
	moduleAddress?: string
	moduleName?: string
	$resource?: {
		[EntityMetaKey.Selector]: {
			$account: {
				$network: AptosNetworkIdentity
				address: string
			}
			resourceType: string
		}
		[EntityMetaKey.Fields]?: Record<string, unknown>
	}
	$module?: {
		[EntityMetaKey.Selector]: {
			$network: AptosNetworkIdentity['$network']
			address: string
			moduleName: string
		}
	}
	$tableItem?: {
		[EntityMetaKey.Selector]: {
			$network: AptosNetworkIdentity
			tableHandle: string
			keyHash: string
		}
		[EntityMetaKey.Fields]: Record<string, unknown>
	}
	value?: unknown
} => {
	const resourceFields = (
		address: string,
		stateKeyHash: string,
		resourceType: string,
		value?: unknown
	) => ({
		changeKind: change.type,
		address,
		stateKeyHash,
		resourceType,
		$resource: {
			[EntityMetaKey.Selector]: {
				$account: {
					$network: $transaction.$network,
					address,
				},
				resourceType,
			},
			...(change.type === 'write_resource' && {
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AptosAccountResource, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$resource: {
								$account: {
									$network: $transaction.$network,
									address,
								},
								resourceType,
							},
							ledgerVersion,
							source: Source.AptosFullnode_Rest,
						},
						[EntityMetaKey.Fields]: {
							...(timestampMs != null && {
								[entityFieldAddressKey(EntityType.AptosAccountResource_Timestamp, [], 'timestampMs')]: timestampMs,
							}),
							...(value != null && {
								[entityFieldAddressKey(EntityType.AptosAccountResource_Timestamp, [], 'value')]: value,
							}),
						},
					}],
				},
			}),
		},
		...(value != null && { value }),
	})
	const moduleFields = (
		address: string,
		stateKeyHash: string,
		moduleName: string,
		value?: unknown
	) => ({
		changeKind: change.type,
		address,
		stateKeyHash,
		moduleAddress: address,
		moduleName,
		$module: {
			[EntityMetaKey.Selector]: {
				$network: $transaction.$network.$network,
				address,
				moduleName,
			},
		},
		...(value != null && { value }),
	})

	switch (change.type) {
		case 'write_resource':
			return resourceFields(change.address, change.state_key_hash, change.data.type, change.data.data)
		case 'delete_resource':
			return resourceFields(change.address, change.state_key_hash, change.resource, {
				deletedResourceType: change.resource,
			})
		case 'write_module':
			return change.data.abi == null ? {
				changeKind: change.type,
				address: change.address,
				stateKeyHash: change.state_key_hash,
				value: change.data,
			} : moduleFields(change.address, change.state_key_hash, change.data.abi.name, change.data)
		case 'delete_module':
			return moduleFields(
				change.address,
				change.state_key_hash,
				change.module.slice(change.module.indexOf('::') + 2),
				{
					deletedModule: change.module,
				}
			)
		case 'write_table_item':
			return {
				changeKind: change.type,
				stateKeyHash: change.state_key_hash,
				$tableItem: {
					[EntityMetaKey.Selector]: {
						$network: $transaction.$network,
						tableHandle: change.handle,
						keyHash: change.state_key_hash,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AptosTableItem, [], 'key')]: change.data?.key ?? change.key,
						...(change.data != null && {
							[entityFieldAddressKey(EntityType.AptosTableItem, [], 'keyType')]: change.data.key_type,
							[entityFieldAddressKey(EntityType.AptosTableItem, [], 'valueType')]: change.data.value_type,
						}),
						[entityFieldAddressKey(EntityType.AptosTableItem, [], '$$timestamps')]: [{
							[EntityMetaKey.Selector]: {
								$tableItem: {
									$network: $transaction.$network,
									tableHandle: change.handle,
									keyHash: change.state_key_hash,
								},
								ledgerVersion,
								source: Source.AptosFullnode_Rest,
							},
							[EntityMetaKey.Fields]: {
								...(timestampMs != null && {
									[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'timestampMs')]: timestampMs,
								}),
								[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'value')]: change.data?.value ?? change.value,
							},
						}],
					},
				},
				value: change.data ?? {
					handle: change.handle,
					key: change.key,
					value: change.value,
				},
			}
		case 'delete_table_item':
			return {
				changeKind: change.type,
				stateKeyHash: change.state_key_hash,
				$tableItem: {
					[EntityMetaKey.Selector]: {
						$network: $transaction.$network,
						tableHandle: change.handle,
						keyHash: change.state_key_hash,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AptosTableItem, [], 'key')]: change.data?.key ?? change.key,
						...(change.data != null && {
							[entityFieldAddressKey(EntityType.AptosTableItem, [], 'keyType')]: change.data.key_type,
						}),
						[entityFieldAddressKey(EntityType.AptosTableItem, [], '$$timestamps')]: [{
							[EntityMetaKey.Selector]: {
								$tableItem: {
									$network: $transaction.$network,
									tableHandle: change.handle,
									keyHash: change.state_key_hash,
								},
								ledgerVersion,
								source: Source.AptosFullnode_Rest,
							},
							[EntityMetaKey.Fields]: {
								...(timestampMs != null && {
									[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'timestampMs')]: timestampMs,
								}),
								[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'pruned')]: true,
							},
						}],
					},
				},
				value: change.data ?? {
					handle: change.handle,
					key: change.key,
				},
			}
	}
}

const transactionByHash = async (selector: AptosTransactionHashIdentity, context: Parameters<typeof resolverSourceBinding>[0]) => {
	assertAptosMainnet(selector.$network.$network)
	const { getTransactionByHash } = await import('$/sources/AptosFullnode/Rest/queries.ts')
	const committed = committedTransaction((await getTransactionByHash(resolverSourceBinding(context), selector.hash)).body)
	if (committed.hash !== selector.hash)
		throw new Error('AptosFullnode_Rest: transaction hash mismatch')

	return transactionFields(committed, selector.$network)
}

const transactionByVersion = async (selector: AptosTransactionVersionIdentity, context: Parameters<typeof resolverSourceBinding>[0]) => {
	assertAptosMainnet(selector.$network.$network)
	const { getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
	const committed = committedTransaction((await getTransactionByVersion(resolverSourceBinding(context), selector.version)).body)
	if (bigintFromWire(committed.version, 'transaction version') !== selector.version)
		throw new Error('AptosFullnode_Rest: transaction version mismatch')

	return transactionFields(committed, selector.$network)
}

export default {
	source: Source.AptosFullnode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.AptosNetwork,
			resolve: {
				Network: {
					appliesTo: aptosNetworkApplicability,
					resolve: async (entitySelector, context) => {
						assertAptosMainnet(entitySelector.$network)
						const { getLedgerInfo } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const ledger = metadataFields((await getLedgerInfo(resolverSourceBinding(context))).metadata)

						return [{
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								ledgerVersion: ledger.ledgerVersion,
								source: Source.AptosFullnode_Rest,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AptosNetwork_Timestamp,
			resolve: {
				NetworkLedgerVersionSource: {
					appliesTo: [
						{
							$network: aptosNetworkApplicability[0],
							source: Source.AptosFullnode_Rest,
						},
						{
							$network: aptosNetworkApplicability[1],
							source: Source.AptosFullnode_Rest,
						},
					],
					resolve: async ({ $network, ledgerVersion, source }, context) => {
						assertAptosMainnet($network.$network)
						assertSource(source)
						const { getLedgerInfo } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getLedgerInfo(resolverSourceBinding(context))
						const fields = metadataFields(response.metadata)
						if (fields.ledgerVersion !== ledgerVersion)
							throw new Error('AptosFullnode_Rest: ledger version mismatch')
						if (bigintFromWire(response.body.ledger_version, 'ledger body version') !== ledgerVersion)
							throw new Error('AptosFullnode_Rest: ledger body version mismatch')

						return {
							...fields,
							nodeRole: response.body.node_role,
						}
					},
				},
			},
		})({
			timestampMs: (ledger) => ledger.timestampMs,
			blockHeight: (ledger) => ledger.blockHeight,
			chainId: (ledger) => ledger.chainId,
			epoch: (ledger) => ledger.epoch,
			oldestLedgerVersion: (ledger) => ledger.oldestLedgerVersion,
			oldestBlockHeight: (ledger) => ledger.oldestBlockHeight,
			nodeRole: (ledger) => ledger.nodeRole,
		}),

		defineResolver({
			entityType: EntityType.AptosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: async (entitySelector, context) => {
						assertAptosMainnet(entitySelector.$network.$network)
						const { getAccount } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getAccount(resolverSourceBinding(context), entitySelector.address)
						const ledgerSnapshot = metadataFields(response.metadata)
						const observation = accountObservationFields(response.body, ledgerSnapshot)

						return [{
							[EntityMetaKey.Selector]: {
								$account: entitySelector,
								ledgerVersion: ledgerSnapshot.ledgerVersion,
								source: Source.AptosFullnode_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'authenticationKey')]: observation.authenticationKey,
								[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'blockHeight')]: observation.blockHeight,
								[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'epoch')]: observation.epoch,
								[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'sequenceNumber')]: observation.sequenceNumber,
								[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'timestampMs')]: observation.timestampMs,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AptosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: async (entitySelector, context) => {
						assertAptosMainnet(entitySelector.$network.$network)
						const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')

						return (await getAccountResources(resolverSourceBinding(context), entitySelector.address)).body.map((resource) => ({
							[EntityMetaKey.Selector]: {
								$account: entitySelector,
								resourceType: resource.type,
							},
						}))
					},
				},
			},
		})({
			$$resources: (resources) => resources,
		}),

		defineResolver({
			entityType: EntityType.AptosAccount_Timestamp,
			resolve: {
				AccountLedgerVersionSource: {
					appliesTo: [
						{
							...aptosAccountReferenceApplicability[0],
							source: Source.AptosFullnode_Rest,
						},
						{
							...aptosAccountReferenceApplicability[1],
							source: Source.AptosFullnode_Rest,
						},
					],
					resolve: async ({ $account, ledgerVersion, source }, context) => {
						assertAptosMainnet($account.$network.$network)
						assertSource(source)
						const {
							getAccount,
							getBlockByVersion,
						} = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const [response, blockResponse] = await Promise.all([
							getAccount(resolverSourceBinding(context), $account.address, ledgerVersion),
							getBlockByVersion(resolverSourceBinding(context), ledgerVersion, false),
						])
						const block = blockFields(blockResponse.body, $account.$network)
						if (ledgerVersion < block.firstVersion || ledgerVersion > block.lastVersion)
							throw new Error('AptosFullnode_Rest: account observation block does not contain ledger version')

						return accountObservationFields(response.body, {
							blockHeight: block.height,
							timestampMs: block.timestampMs,
							epoch: metadataFields(response.metadata).epoch,
						})
					},
				},
			},
		})({
			timestampMs: (account) => account.timestampMs,
			blockHeight: (account) => account.blockHeight,
			epoch: (account) => account.epoch,
			sequenceNumber: (account) => account.sequenceNumber,
			authenticationKey: (account) => account.authenticationKey,
		}),

		defineResolver({
			entityType: EntityType.AptosAccountResource,
			resolve: {
				AccountResourceType: {
					appliesTo: aptosAccountReferenceApplicability,
					resolve: async (entitySelector, context) => {
						assertAptosMainnet(entitySelector.$account.$network.$network)
						const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getAccountResources(resolverSourceBinding(context), entitySelector.$account.address)
						const ledgerVersion = metadataFields(response.metadata).ledgerVersion
						if (!response.body.some((resource) => resource.type === entitySelector.resourceType))
							throw new Error('AptosFullnode_Rest: account resource is missing')

						return [{
							[EntityMetaKey.Selector]: {
								$resource: entitySelector,
								ledgerVersion,
								source: Source.AptosFullnode_Rest,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AptosAccountResource_Timestamp,
			resolve: {
				ResourceLedgerVersionSource: {
					appliesTo: [
						{
							$resource: aptosAccountReferenceApplicability[0],
							source: Source.AptosFullnode_Rest,
						},
						{
							$resource: aptosAccountReferenceApplicability[1],
							source: Source.AptosFullnode_Rest,
						},
					],
					resolve: async ({ $resource, ledgerVersion, source }, context) => {
						assertAptosMainnet($resource.$account.$network.$network)
						assertSource(source)
						const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getAccountResources(resolverSourceBinding(context), $resource.$account.address, ledgerVersion)
						if (metadataFields(response.metadata).ledgerVersion !== ledgerVersion)
							throw new Error('AptosFullnode_Rest: resource observation ledger version mismatch')
						const resource = response.body.find((candidate) => candidate.type === $resource.resourceType)
						if (resource == null)
							throw new Error('AptosFullnode_Rest: account resource is missing')

						return resource.data
					},
				},
			},
		})({
			value: (value) => value,
		}),

		defineResolver({
			entityType: EntityType.AptosBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: async ({ $network, height }, context) => {
						assertAptosMainnet($network.$network)
						const { getBlockByHeight } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const block = (await getBlockByHeight(resolverSourceBinding(context), height)).body
						if (bigintFromWire(block.block_height, 'block height') !== height)
							throw new Error('AptosFullnode_Rest: block height mismatch')

						return blockFields(block, $network)
					},
				},
				NetworkVersion: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: async ({ $network, version }, context) => {
						assertAptosMainnet($network.$network)
						const { getBlockByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const block = (await getBlockByVersion(resolverSourceBinding(context), version)).body
						if (version < bigintFromWire(block.first_version, 'block first version') || version > bigintFromWire(block.last_version, 'block last version'))
							throw new Error('AptosFullnode_Rest: block does not contain requested version')

						return blockFields(block, $network, version)
					},
				},
			},
		})({
			height: (block) => block.height,
			version: (block) => block.version,
			firstVersion: (block) => block.firstVersion,
			lastVersion: (block) => block.lastVersion,
			timestampMs: (block) => block.timestampMs,
			$$transactions: (block) => block.transactions,
		}),

		defineResolver({
			entityType: EntityType.AptosTransaction,
			resolve: {
				NetworkVersion: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: transactionByVersion,
				},
				NetworkHash: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: transactionByHash,
				},
			},
		})({
			version: (transaction) => transaction.version,
			hash: (transaction) => transaction.hash,
			transactionKind: (transaction) => transaction.transactionKind,
			sender: (transaction) => transaction.sender,
			$$timestamps: (transaction) => transaction.timestamps,
			$$stateChanges: (transaction) => transaction.stateChanges,
			$$events: (transaction) => transaction.events,
		}),

		defineResolver({
			entityType: EntityType.AptosTransaction_Timestamp,
			resolve: {
				TransactionLedgerVersionSource: {
					appliesTo: [
						{
							$transaction: aptosNetworkReferenceApplicability[0],
							source: Source.AptosFullnode_Rest,
						},
						{
							$transaction: aptosNetworkReferenceApplicability[1],
							source: Source.AptosFullnode_Rest,
						},
					],
					resolve: async ({ $transaction, ledgerVersion, source }, context) => {
						assertAptosMainnet($transaction.$network.$network)
						assertSource(source)
						if ('version' in $transaction && $transaction.version !== ledgerVersion)
							throw new Error('AptosFullnode_Rest: transaction observation ledger version mismatch')
						const {
							getBlockByVersion,
							getTransactionByVersion,
						} = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const [transactionResponse, blockResponse] = await Promise.all([
							getTransactionByVersion(resolverSourceBinding(context), ledgerVersion),
							getBlockByVersion(resolverSourceBinding(context), ledgerVersion, false),
						])
						const transaction = committedTransaction(transactionResponse.body)
						if ('hash' in $transaction && transaction.hash !== $transaction.hash)
							throw new Error('AptosFullnode_Rest: transaction hash mismatch')
						const block = blockFields(blockResponse.body, $transaction.$network, ledgerVersion)
						if (ledgerVersion < block.firstVersion || ledgerVersion > block.lastVersion)
							throw new Error('AptosFullnode_Rest: transaction observation block does not contain ledger version')

						return {
							...('timestamp' in transaction && {
								timestampMs: timestampMsFromMicroseconds(transaction.timestamp, 'transaction timestamp'),
							}),
							blockHeight: block.height,
							success: transaction.success,
							vmStatus: transaction.vm_status,
							...('gas_unit_price' in transaction && { gasUnitPrice: bigintFromWire(transaction.gas_unit_price, 'gas unit price') }),
							gasUsed: bigintFromWire(transaction.gas_used, 'gas used'),
							accumulatorRootHash: transaction.accumulator_root_hash,
						}
					},
				},
			},
		})({
			timestampMs: (transaction) => transaction.timestampMs,
			blockHeight: (transaction) => transaction.blockHeight,
			success: (transaction) => transaction.success,
			vmStatus: (transaction) => transaction.vmStatus,
			gasUnitPrice: (transaction) => transaction.gasUnitPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			accumulatorRootHash: (transaction) => transaction.accumulatorRootHash,
		}),

		defineResolver({
			entityType: EntityType.AptosEvent,
			resolve: {
				NetworkTransactionVersionEventIndex: {
					appliesTo: aptosNetworkReferenceApplicability,
					resolve: async ({ $network, transactionVersion, eventIndex }, context) => {
						assertAptosMainnet($network.$network)
						const { getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const transaction = committedTransaction((await getTransactionByVersion(resolverSourceBinding(context), transactionVersion)).body)
						const event = ('events' in transaction ? transaction.events : []).at(eventIndex)
						if (event == null)
							throw new Error('AptosFullnode_Rest: event index is missing')

						return eventFields(event, $network, transactionVersion)
					},
				},
			},
		})({
			eventType: (event) => event.eventType,
			accountAddress: (event) => event.accountAddress,
			creationNumber: (event) => event.creationNumber,
			sequenceNumber: (event) => event.sequenceNumber,
			$transaction: (event) => event.$transaction,
			value: (event) => event.value,
		}),

		defineResolver({
			entityType: EntityType.AptosStateChange,
			resolve: {
				TransactionChangeIndex: {
					appliesTo: [
						{
							$transaction: aptosNetworkReferenceApplicability[0],
						},
						{
							$transaction: aptosNetworkReferenceApplicability[1],
						},
					],
					resolve: async ({ $transaction, changeIndex }, context) => {
						assertAptosMainnet($transaction.$network.$network)
						const { getTransactionByHash, getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const transaction = committedTransaction(
							'version' in $transaction ?
								(await getTransactionByVersion(resolverSourceBinding(context), $transaction.version)).body
								:
								(await getTransactionByHash(resolverSourceBinding(context), $transaction.hash)).body
						)
						const change = transaction.changes.at(changeIndex)
						if (change == null)
							throw new Error('AptosFullnode_Rest: state change index is missing')

						return stateChangeFields(
							change,
							$transaction,
							bigintFromWire(transaction.version, 'transaction version'),
							'timestamp' in transaction ?
								timestampMsFromMicroseconds(transaction.timestamp, 'transaction timestamp')
								:
								undefined
						)
					},
				},
			},
		})({
			changeKind: (change) => change.changeKind,
			address: (change) => change.address,
			stateKeyHash: (change) => change.stateKeyHash,
			resourceType: (change) => change.resourceType,
			moduleAddress: (change) => change.moduleAddress,
			moduleName: (change) => change.moduleName,
			$resource: (change) => change.$resource,
			$module: (change) => change.$module,
			$tableItem: (change) => change.$tableItem,
			value: (change) => change.value,
		}),

		defineResolver({
			entityType: EntityType.MoveModule,
			resolve: {
				NetworkAddressModuleName: {
					appliesTo: aptosNetworkApplicability,
					resolve: async (entitySelector, context) => {
						assertAptosMainnet(entitySelector.$network)
						const { getAccountModule } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getAccountModule(resolverSourceBinding(context), entitySelector.address, entitySelector.moduleName)
						if (response.body.abi != null && response.body.abi.name !== entitySelector.moduleName)
							throw new Error('AptosFullnode_Rest: module name mismatch')
						const ledger = metadataFields(response.metadata)

						return [{
							[EntityMetaKey.Selector]: {
								$module: entitySelector,
								timestampMs: ledger.timestampMs,
								source: Source.AptosFullnode_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.MoveModule_Timestamp, [], 'bytecode')]: response.body.bytecode,
								[entityFieldAddressKey(EntityType.MoveModule_Timestamp, [], 'abi')]: response.body.abi,
								[entityFieldAddressKey(EntityType.MoveModule_Timestamp, [], 'ledgerVersion')]: ledger.ledgerVersion,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.MoveModule_Timestamp,
			resolve: {
				ModuleTimestampMsSource: {
					appliesTo: [
						{
							$module: aptosNetworkApplicability[0],
							source: Source.AptosFullnode_Rest,
						},
						{
							$module: aptosNetworkApplicability[1],
							source: Source.AptosFullnode_Rest,
						},
					],
					resolve: async ({ $module, timestampMs, source }, context) => {
						assertAptosMainnet($module.$network)
						assertSource(source)
						const { getAccountModule } = await import('$/sources/AptosFullnode/Rest/queries.ts')
						const response = await getAccountModule(resolverSourceBinding(context), $module.address, $module.moduleName)
						const ledger = metadataFields(response.metadata)
						if (ledger.timestampMs !== timestampMs)
							throw new Error('AptosFullnode_Rest: module observation timestamp mismatch')
						if (response.body.abi != null && response.body.abi.name !== $module.moduleName)
							throw new Error('AptosFullnode_Rest: module name mismatch')

						return {
							bytecode: response.body.bytecode,
							...(response.body.abi != null && { abi: response.body.abi }),
							ledgerVersion: ledger.ledgerVersion,
						}
					},
				},
			},
		})({
			bytecode: (module) => module.bytecode,
			abi: (module) => module.abi,
			ledgerVersion: (module) => module.ledgerVersion,
		}),
	].map((resolver) => ({
		...resolver,
		source: Source.AptosFullnode_Rest,
	})),
} satisfies RegisteredSourceResolverModule
