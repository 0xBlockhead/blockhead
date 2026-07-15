import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, type EntitySelector } from '$/schema/$schema.ts'
import { AptosAccountSelector } from '$/schema/AptosAccount.ts'
import { AptosAccountResourceSelector } from '$/schema/AptosAccountResource.ts'
import { AptosAccountResource_TimestampSelector } from '$/schema/AptosAccountResource_Timestamp.ts'
import { AptosAccount_TimestampSelector } from '$/schema/AptosAccount_Timestamp.ts'
import { AptosBlockSelector } from '$/schema/AptosBlock.ts'
import { AptosEventSelector } from '$/schema/AptosEvent.ts'
import { AptosNetworkSelector } from '$/schema/AptosNetwork.ts'
import { AptosNetwork_TimestampSelector } from '$/schema/AptosNetwork_Timestamp.ts'
import { AptosStateChangeSelector } from '$/schema/AptosStateChange.ts'
import { AptosTransactionSelector } from '$/schema/AptosTransaction.ts'
import { AptosTransaction_TimestampSelector } from '$/schema/AptosTransaction_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type {
	AptosBlock,
	AptosEvent,
	AptosResponseMetadata,
	AptosTransaction,
	AptosWriteSetChange,
} from '$/sources/AptosFullnode/Rest/types.ts'

type AptosNetworkIdentity = EntitySelector<typeof schema, EntityType.AptosNetwork>
type AptosTransactionIdentity = EntitySelector<typeof schema, EntityType.AptosTransaction>
type AptosCommittedTransaction = Exclude<AptosTransaction, { type: 'pending_transaction' }>

const aptosFullnodeBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.AptosFullnode_Rest)

if (aptosFullnodeBinding == null)
	throw new Error('AptosFullnode_Rest: source binding is missing')

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
	$network: AptosNetworkIdentity
) => ({
		height: bigintFromWire(block.block_height, 'block height'),
		firstVersion: bigintFromWire(block.first_version, 'block first version'),
		lastVersion: bigintFromWire(block.last_version, 'block last version'),
		timestampMs: timestampMsFromMicroseconds(block.block_timestamp, 'block timestamp'),
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
		stateChanges: transaction.changes.map((_change, changeIndex) => ({
			[EntityMetaKey.Selector]: {
				$transaction,
				changeIndex,
			},
		})),
		events: ('events' in transaction ? transaction.events : []).map((_event, eventIndex) => ({
			[EntityMetaKey.Selector]: {
				$network,
				transactionVersion: version,
				eventIndex,
			},
		})),
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

const stateChangeFields = (
	change: AptosWriteSetChange,
	$transaction: AptosTransactionIdentity
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
	}
	$module?: {
		[EntityMetaKey.Selector]: {
			$network: AptosNetworkIdentity['$network']
			address: string
			moduleName: string
		}
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
				value: change.data ?? {
					handle: change.handle,
					key: change.key,
				},
			}
	}
}

const transactionBySelector = async (selector: {
	$network: AptosNetworkIdentity
	version?: bigint
	hash?: string
}) => {
	const queries = await import('$/sources/AptosFullnode/Rest/queries.ts')
	const transaction = selector.version == null ?
			(await queries.getTransactionByHash(aptosFullnodeBinding, selector.hash ?? '')).body
		:
			(await queries.getTransactionByVersion(aptosFullnodeBinding, selector.version)).body
	const committed = committedTransaction(transaction)
	if (selector.version != null && bigintFromWire(committed.version, 'transaction version') !== selector.version)
		throw new Error('AptosFullnode_Rest: transaction version mismatch')
	if (selector.hash != null && committed.hash !== selector.hash)
		throw new Error('AptosFullnode_Rest: transaction hash mismatch')

	return transactionFields(committed, selector.$network)
}

export default {
	source: Source.AptosFullnode_Rest,

	resolvers: [
		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosNetwork,
			resolve: {
				[AptosNetworkSelector.Network]: async (entitySelector) => {
					const { getLedgerInfo } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const ledger = metadataFields((await getLedgerInfo(aptosFullnodeBinding)).metadata)

					return [{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							ledgerVersion: ledger.ledgerVersion,
							source: Source.AptosFullnode_Rest,
						},
					}]
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosNetwork_Timestamp,
			resolve: {
				[AptosNetwork_TimestampSelector.NetworkLedgerVersionSource]: async ({ ledgerVersion, source }) => {
					assertSource(source)
					const { getLedgerInfo } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const response = await getLedgerInfo(aptosFullnodeBinding)
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
		})({
			timestampMs: (ledger) => ledger.timestampMs,
			blockHeight: (ledger) => ledger.blockHeight,
			chainId: (ledger) => ledger.chainId,
			epoch: (ledger) => ledger.epoch,
			oldestLedgerVersion: (ledger) => ledger.oldestLedgerVersion,
			oldestBlockHeight: (ledger) => ledger.oldestBlockHeight,
			nodeRole: (ledger) => ledger.nodeRole,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccount,
			resolve: {
				[AptosAccountSelector.NetworkAddress]: async (entitySelector) => {
					const { getAccount } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const ledgerVersion = metadataFields((await getAccount(aptosFullnodeBinding, entitySelector.address)).metadata).ledgerVersion

					return [{
						[EntityMetaKey.Selector]: {
							$account: entitySelector,
							ledgerVersion,
							source: Source.AptosFullnode_Rest,
						},
					}]
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccount,
			resolve: {
				[AptosAccountSelector.NetworkAddress]: async (entitySelector) => {
					const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')

					return (await getAccountResources(aptosFullnodeBinding, entitySelector.address)).body.map((resource) => ({
						[EntityMetaKey.Selector]: {
							$account: entitySelector,
							resourceType: resource.type,
						},
					}))
				},
			},
		})({
			$$resources: (resources) => resources,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccount,
			resolve: {
				[AptosAccountSelector.NetworkAddress]: async (entitySelector) => {
					const { getAccountModules } = await import('$/sources/AptosFullnode/Rest/queries.ts')

					return (await getAccountModules(aptosFullnodeBinding, entitySelector.address)).body.map((module) => {
						if (module.abi == null)
							throw new Error('AptosFullnode_Rest: module ABI is missing')

						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network.$network,
								address: module.abi.address,
								moduleName: module.abi.name,
							},
						}
					})
				},
			},
		})({
			$$modules: (modules) => modules,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccount_Timestamp,
			resolve: {
				[AptosAccount_TimestampSelector.AccountLedgerVersionSource]: async ({ $account, ledgerVersion, source }) => {
					assertSource(source)
					const { getAccount } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const response = await getAccount(aptosFullnodeBinding, $account.address, ledgerVersion)
					const ledgerSnapshot = metadataFields(response.metadata)
					if (ledgerSnapshot.ledgerVersion !== ledgerVersion)
						throw new Error('AptosFullnode_Rest: account observation ledger version mismatch')

					return {
						sequenceNumber: bigintFromWire(response.body.sequence_number, 'account sequence number'),
						authenticationKey: response.body.authentication_key,
						timestampMs: ledgerSnapshot.timestampMs,
						blockHeight: ledgerSnapshot.blockHeight,
						epoch: ledgerSnapshot.epoch,
					}
				},
			},
		})({
			timestampMs: (account) => account.timestampMs,
			blockHeight: (account) => account.blockHeight,
			epoch: (account) => account.epoch,
			sequenceNumber: (account) => account.sequenceNumber,
			authenticationKey: (account) => account.authenticationKey,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccountResource,
			resolve: {
				[AptosAccountResourceSelector.AccountResourceType]: async (entitySelector) => {
					const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const response = await getAccountResources(aptosFullnodeBinding, entitySelector.$account.address)
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
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosAccountResource_Timestamp,
			resolve: {
				[AptosAccountResource_TimestampSelector.ResourceLedgerVersionSource]: async ({ $resource, ledgerVersion, source }) => {
					assertSource(source)
					const { getAccountResources } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const response = await getAccountResources(aptosFullnodeBinding, $resource.$account.address, ledgerVersion)
					if (metadataFields(response.metadata).ledgerVersion !== ledgerVersion)
						throw new Error('AptosFullnode_Rest: resource observation ledger version mismatch')
					const resource = response.body.find((candidate) => candidate.type === $resource.resourceType)
					if (resource == null)
						throw new Error('AptosFullnode_Rest: account resource is missing')

					return resource.data
				},
			},
		})({
			value: (value) => value,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosBlock,
			resolve: {
				[AptosBlockSelector.NetworkHeight]: async ({ $network, height }) => {
					const { getBlockByHeight } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const block = (await getBlockByHeight(aptosFullnodeBinding, height)).body
					if (bigintFromWire(block.block_height, 'block height') !== height)
						throw new Error('AptosFullnode_Rest: block height mismatch')

					return blockFields(block, $network)
				},
				[AptosBlockSelector.NetworkVersion]: async ({ $network, version }) => {
					const { getBlockByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const block = (await getBlockByVersion(aptosFullnodeBinding, version)).body
					if (version < bigintFromWire(block.first_version, 'block first version') || version > bigintFromWire(block.last_version, 'block last version'))
						throw new Error('AptosFullnode_Rest: block does not contain requested version')

					return blockFields(block, $network)
				},
			},
		})({
			height: (block) => block.height,
			firstVersion: (block) => block.firstVersion,
			lastVersion: (block) => block.lastVersion,
			timestampMs: (block) => block.timestampMs,
			$$transactions: (block) => block.transactions,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosTransaction,
			resolve: {
				[AptosTransactionSelector.NetworkVersion]: transactionBySelector,
				[AptosTransactionSelector.NetworkHash]: transactionBySelector,
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

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosTransaction_Timestamp,
			resolve: {
				[AptosTransaction_TimestampSelector.TransactionLedgerVersionSource]: async ({ $transaction, ledgerVersion, source }) => {
					assertSource(source)
					if ('version' in $transaction && $transaction.version !== ledgerVersion)
						throw new Error('AptosFullnode_Rest: transaction observation ledger version mismatch')
					const { getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const transaction = committedTransaction((await getTransactionByVersion(aptosFullnodeBinding, ledgerVersion)).body)
					if ('hash' in $transaction && transaction.hash !== $transaction.hash)
						throw new Error('AptosFullnode_Rest: transaction hash mismatch')

					return {
						...('timestamp' in transaction && {
							timestampMs: timestampMsFromMicroseconds(transaction.timestamp, 'transaction timestamp'),
						}),
						success: transaction.success,
						vmStatus: transaction.vm_status,
						...('gas_unit_price' in transaction && { gasUnitPrice: bigintFromWire(transaction.gas_unit_price, 'gas unit price') }),
						gasUsed: bigintFromWire(transaction.gas_used, 'gas used'),
						accumulatorRootHash: transaction.accumulator_root_hash,
					}
				},
			},
		})({
			timestampMs: (transaction) => transaction.timestampMs,
			success: (transaction) => transaction.success,
			vmStatus: (transaction) => transaction.vmStatus,
			gasUnitPrice: (transaction) => transaction.gasUnitPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			accumulatorRootHash: (transaction) => transaction.accumulatorRootHash,
		}),

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosEvent,
			resolve: {
				[AptosEventSelector.NetworkTransactionVersionEventIndex]: async ({ $network, transactionVersion, eventIndex }) => {
					const { getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const transaction = committedTransaction((await getTransactionByVersion(aptosFullnodeBinding, transactionVersion)).body)
					const event = ('events' in transaction ? transaction.events : []).at(eventIndex)
					if (event == null)
						throw new Error('AptosFullnode_Rest: event index is missing')

					return eventFields(event, $network, transactionVersion)
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

		defineResolver(Source.AptosFullnode_Rest, {
			entityType: EntityType.AptosStateChange,
			resolve: {
				[AptosStateChangeSelector.TransactionChangeIndex]: async ({ $transaction, changeIndex }) => {
					const { getTransactionByHash, getTransactionByVersion } = await import('$/sources/AptosFullnode/Rest/queries.ts')
					const transaction = committedTransaction(
						'version' in $transaction ?
							(await getTransactionByVersion(aptosFullnodeBinding, $transaction.version)).body
							:
							(await getTransactionByHash(aptosFullnodeBinding, $transaction.hash)).body
					)
					const change = transaction.changes.at(changeIndex)
					if (change == null)
						throw new Error('AptosFullnode_Rest: state change index is missing')

					return stateChangeFields(change, $transaction)
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
			value: (change) => change.value,
		}),
	].map((resolver) => ({
		...resolver,
		source: Source.AptosFullnode_Rest,
	})),
}
