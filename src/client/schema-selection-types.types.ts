import {
	entity,
	facet,
	indexSchema,
	EntityMetaKey,
	type EntityBaseFieldName,
	type EntityFacetFieldNameAtPath,
	type EntityFacetPathFor,
	type EntityFieldAddressFor,
	type EntityFieldAddressKeyFor,
	type EntitySelectedValue,
	type EntitySelection,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/EntityField.ts'
import type {
	ClientContext,
	SubscribeEntityReferenceResult,
} from '$/client/$client.svelte.ts'
import {
	EntityProxyField,
	type EntityProxyPrefetchedData,
} from '$/client/$proxy.svelte.ts'
import {
	subscribeEntity,
	subscribeEntityField,
} from '$/client/$subscribe.svelte.ts'
import { type } from 'arktype'

const EntityType = {
	EvmLog: 'EvmLog',
	EvmTransaction: 'EvmTransaction',
} as const
type EvmLogEntityType = typeof EntityType.EvmLog
type EvmTransactionEntityType = typeof EntityType.EvmTransaction

const EvmTransaction = entity({
	entityType: EntityType.EvmTransaction,
	labels: {
		singular: 'EVM transaction',
		plural: 'EVM transactions',
	},
})({
	txHash: {
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	envelopeType: {
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		TxHash: ['txHash'],
	},
	facets: {
		FeeMarket: facet({
			path: ['envelopeType'],
			isOneOf: [
				'FeeMarket',
				'Blob',
			],
		})({
			maxFeePerGas: {
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		Blob: facet({
			path: ['envelopeType'],
			is: 'Blob',
		})({
			maxFeePerBlobGas: {
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blobGasUsed: {
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})

const EvmLog = entity({
	entityType: EntityType.EvmLog,
	labels: {
		singular: 'EVM log',
		plural: 'EVM logs',
	},
})({
	$transaction: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	topic0: {
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Topic: ['topic0'],
	},
	facets: {
		Event: facet({
			path: ['topic0'],
			is: 'transfer',
		})({
			signatureHash: {
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			$$eventTransactions: {
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.Many,
			},
		})({
			facets: {
				TokenTransfer: facet({
					path: [
						'Event',
						'signatureHash',
					],
					is: 'transfer',
				})({
					tokenId: {
						type: EntityFieldType.Primitive,
						primitiveType: type('string'),
						cardinality: EntityFieldCardinality.ZeroOrOne,
					},
				}),
			},
		}),
	},
})

const schema = [
	EvmTransaction,
	EvmLog,
] as const
const schemaIndex = indexSchema(schema)

schemaIndex.entitySelectorDefinitionByEntityTypeAndName.EvmTransaction.TxHash.fields

// @ts-expect-error Selector indexes expose only selector names captured by the entity definition.
schemaIndex.entitySelectorDefinitionByEntityTypeAndName.EvmTransaction.Missing

type MissingTransactionSelector = EntitySelectorForSelectorName<typeof schema, EvmTransactionEntityType, 'Missing'>
// @ts-expect-error Invalid selector names resolve to never and cannot describe a selector value.
const missingTransactionSelector: MissingTransactionSelector = {}
void missingTransactionSelector

const baseField: EntityBaseFieldName<typeof schema, EvmTransactionEntityType> = 'txHash'
const facetPath: EntityFacetPathFor<typeof schema, EvmTransactionEntityType> = ['Blob']
const nestedFacetPath: EntityFacetPathFor<typeof schema, EvmLogEntityType> = [
	'Event',
	'TokenTransfer',
]
const facetField: EntityFacetFieldNameAtPath<
	typeof schema,
	EvmTransactionEntityType,
	readonly ['FeeMarket']
> = 'maxFeePerGas'
const baseAddress: EntityFieldAddressFor<typeof schema, EvmTransactionEntityType> = {
	entityType: EntityType.EvmTransaction,
	facetPath: [],
	fieldName: 'txHash',
}
const nestedAddress: EntityFieldAddressFor<typeof schema, EvmLogEntityType> = {
	entityType: EntityType.EvmLog,
	facetPath: [
		'Event',
		'TokenTransfer',
	],
	fieldName: 'tokenId',
}
const addressKey: EntityFieldAddressKeyFor<typeof schema, EvmTransactionEntityType> = 'EvmTransaction\x1eBlob\x1emaxFeePerBlobGas'

const transactionSelection = {
	fields: {
		txHash: true,
	},
} as const satisfies EntitySelection<
	typeof schema,
	EvmTransactionEntityType
>

const blobSelection = {
	fields: {
		maxFeePerBlobGas: true,
	},
} as const satisfies EntitySelection<
	typeof schema,
	EvmTransactionEntityType,
	readonly ['Blob']
>
const logSelection = {
	fields: {
		$transaction: transactionSelection,
		$$transactions: {
			fields: {
				value: true,
			},
		},
	},
} as const satisfies EntitySelection<
	typeof schema,
	EvmLogEntityType
>

declare const selectedTransaction: EntitySelectedValue<
	typeof schema,
	EvmTransactionEntityType,
	readonly [],
	typeof transactionSelection
>
declare const selectedBlob: EntitySelectedValue<
	typeof schema,
	EvmTransactionEntityType,
	readonly ['Blob'],
	typeof blobSelection
>
declare const selectedLog: EntitySelectedValue<
	typeof schema,
	EvmLogEntityType,
	readonly [],
	typeof logSelection
>
declare const prefetchedTransactionReference: SubscribeEntityReferenceResult<
	typeof schema,
	EvmTransactionEntityType,
	typeof transactionSelection
>
declare const prefetchedLogReference: SubscribeEntityReferenceResult<
	typeof schema,
	EvmLogEntityType,
	typeof logSelection
>

selectedTransaction.txHash
selectedBlob.maxFeePerBlobGas
selectedLog.$transaction.txHash
selectedLog.$$transactions[0]?.value
const prefetchedTransaction: EntityProxyPrefetchedData<
	typeof schema,
	EvmTransactionEntityType
> = prefetchedTransactionReference
prefetchedTransaction[EntityMetaKey.Selector]?.txHash
const prefetchedLog: EntityProxyPrefetchedData<
	typeof schema,
	EvmLogEntityType
> = prefetchedLogReference
prefetchedLog.$transaction?.txHash
prefetchedLog.$$transactions?.values[0]?.value

const mismatchedPrefetchedTransaction: EntityProxyPrefetchedData<
	typeof schema,
	EvmTransactionEntityType
> = {
	[EntityMetaKey.Selector]: {
		// @ts-expect-error Prefetched selector metadata stays scoped to the selected entity type.
		topic0: 'transfer',
	},
}
mismatchedPrefetchedTransaction

declare const clientContext: ClientContext<typeof schema>

const selectedTransactionProxy = clientContext.select(
	EntityType.EvmTransaction,
	{
		txHash: '0x01',
	},
	transactionSelection
)
const selectedTransactionOverride = selectedTransactionProxy({
	fields: {
		envelopeType: true,
	},
})
const selectedReferencesProxy = clientContext.select(
	EntityType.EvmLog,
	{
		topic0: 'transfer',
	},
	{
		fields: {
			$transaction: {
				fields: {
					txHash: true,
				},
			},
			$$transactions: {
				fields: {
					value: true,
				},
			},
		},
	}
)
selectedReferencesProxy.$transaction({
	fields: {
		txHash: true,
	},
}).then((transaction) => {
	transaction.txHash
})
selectedReferencesProxy.topic0.then((topic0) => {
	const optionalTopic0: string | undefined = topic0
	optionalTopic0

	// @ts-expect-error ZeroOrOne fields remain optional on the resource promise surface.
	const requiredTopic0: string = topic0
	requiredTopic0
})
const selectedFacetProxy = clientContext.select(
	EntityType.EvmTransaction,
	{
		txHash: '0x01',
	},
	{
		fields: {
			Blob: {
				fields: {
					maxFeePerBlobGas: true,
				},
			},
		},
	}
)
const selectedNestedFacetProxy = clientContext.select(
	EntityType.EvmLog,
	{
		topic0: 'transfer',
	},
	{
		fields: {
			Event: {
				fields: {
					TokenTransfer: {
						fields: {
							tokenId: true,
						},
					},
				},
			},
		},
	}
)
const selectedTransactionField = selectedReferencesProxy.$transaction({
	fields: {
		txHash: true,
	},
})
const selectedTransactionsField = selectedReferencesProxy.$$transactions({
	fields: {
		value: true,
	},
})
const selectedFirstTransaction = selectedReferencesProxy.$$transactions.first({
	fields: {
		txHash: true,
	},
})
const selectedEventTransactions = selectedNestedFacetProxy.Event.$$eventTransactions({
	fields: {
		value: true,
	},
})
const selectedFirstEventTransaction = selectedNestedFacetProxy.Event.$$eventTransactions.first({
	fields: {
		envelopeType: true,
	},
})

selectedTransactionProxy.current?.txHash
selectedTransactionOverride.current?.txHash
selectedTransactionOverride.current?.envelopeType
selectedTransactionProxy[EntityProxyField]('value')
selectedReferencesProxy.current?.$transaction.txHash
selectedReferencesProxy.current?.$$transactions.values[0]?.value
selectedFacetProxy.current?.fields.Blob.fields.maxFeePerBlobGas
selectedFacetProxy.current?.Blob.fields.maxFeePerBlobGas
selectedNestedFacetProxy.current?.fields.Event.fields.TokenTransfer.fields.tokenId
selectedTransactionField.current?.txHash
selectedTransactionsField.current?.values[0]?.value
selectedFirstTransaction.current?.txHash
selectedEventTransactions.current?.values[0]?.value
selectedFirstEventTransaction.current?.envelopeType

const directlySelectedTransaction = subscribeEntity(
	clientContext,
	EntityType.EvmTransaction,
	{
		txHash: '0x01',
	},
	{
		fields: {
			txHash: true,
			Blob: {
				fields: {
					maxFeePerBlobGas: true,
				},
			},
		},
	}
)
const directlySelectedTransactionReference = subscribeEntityField(
	clientContext,
	EntityType.EvmLog,
	{
		topic0: 'transfer',
	},
	'$transaction',
	{
		fields: {
			txHash: true,
		},
	}
)
const directlySelectedTransactionReferences = subscribeEntityField(
	clientContext,
	EntityType.EvmLog,
	{
		topic0: 'transfer',
	},
	'$$transactions',
	{
		fields: {
			value: true,
		},
	}
)
directlySelectedTransaction.current?.txHash
directlySelectedTransaction.current?.fields.Blob.fields.maxFeePerBlobGas
directlySelectedTransactionReference.current?.txHash
directlySelectedTransactionReferences.current?.values[0]?.value

// @ts-expect-error Direct entity subscriptions reject fields outside the selected entity surface.
subscribeEntity(clientContext, EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { missing: true } })

// @ts-expect-error Direct entity subscriptions reject fields owned by a sibling facet.
subscribeEntity(clientContext, EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { Blob: { fields: { maxFeePerGas: true } } } })

// @ts-expect-error Direct reference-field subscriptions validate selections against the referenced entity.
subscribeEntityField(clientContext, EntityType.EvmLog, { topic0: 'transfer' }, '$transaction', { fields: { topic0: true } })

// @ts-expect-error Direct many-reference subscriptions reject undeclared referenced-entity facets.
subscribeEntityField(clientContext, EntityType.EvmLog, { topic0: 'transfer' }, '$$transactions', { fields: { Event: { fields: {} } } })

// @ts-expect-error Direct entity subscription results expose only selected fields.
directlySelectedTransaction.current?.value

// @ts-expect-error Direct entity subscription facet results expose only selected fields.
directlySelectedTransaction.current?.fields.Blob.fields.blobGasUsed

// @ts-expect-error Direct one-reference results expose only recursively selected fields.
directlySelectedTransactionReference.current?.envelopeType

// @ts-expect-error Direct many-reference results expose only recursively selected fields.
directlySelectedTransactionReferences.current?.values[0]?.txHash

// @ts-expect-error Client selections reject fields outside the selected entity surface.
clientContext.select(EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { missing: true } })

// @ts-expect-error Client selections reject undeclared facets.
clientContext.select(EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { Missing: { fields: {} } } })

// @ts-expect-error Nested projection selections reject undeclared fields.
clientContext.select(EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { Blob: { fields: { missing: true } } } })

// @ts-expect-error Projection selections reject fields owned by a sibling facet.
clientContext.select(EntityType.EvmTransaction, { txHash: '0x01' }, { fields: { Blob: { fields: { maxFeePerGas: true } } } })

// @ts-expect-error Referenced-entity selections reject undeclared fields at their own boundary.
clientContext.select(EntityType.EvmLog, { topic0: 'transfer' }, { fields: { $transaction: { fields: { missing: true } } } })

// @ts-expect-error Callable one-reference fields validate against the referenced entity.
selectedReferencesProxy.$transaction({ fields: { topic0: true } })

// @ts-expect-error Callable many-reference fields validate against the referenced entity.
selectedReferencesProxy.$$transactions({ fields: { topic0: true } })

// @ts-expect-error Many-reference first selections validate against the referenced entity.
selectedReferencesProxy.$$transactions.first({ fields: { topic0: true } })

// @ts-expect-error Projection reference fields validate against the referenced entity.
selectedNestedFacetProxy.Event.$$eventTransactions({ fields: { topic0: true } })

// @ts-expect-error Projection reference first selections validate against the referenced entity.
selectedNestedFacetProxy.Event.$$eventTransactions.first({ fields: { topic0: true } })

// @ts-expect-error Callable selection results expose only the merged selected fields.
selectedTransactionOverride.current?.value

// @ts-expect-error One-reference results expose only recursively selected fields.
selectedReferencesProxy.current?.$transaction.envelopeType

// @ts-expect-error Many-reference results expose only recursively selected fields.
selectedReferencesProxy.current?.$$transactions.values[0]?.txHash

// @ts-expect-error Selected facet result maps expose only selected fields.
selectedFacetProxy.current?.fields.Blob.fields.blobGasUsed

// @ts-expect-error Selected facets do not expose sibling facet fields.
selectedFacetProxy.current?.fields.Blob.fields.maxFeePerGas

// @ts-expect-error Nested facet result maps expose only selected fields.
selectedNestedFacetProxy.current?.fields.Event.fields.TokenTransfer.fields.signatureHash

// @ts-expect-error Callable one-reference results expose only selected referenced fields.
selectedTransactionField.current?.envelopeType

// @ts-expect-error Callable many-reference results expose only selected referenced fields.
selectedTransactionsField.current?.values[0]?.txHash

// @ts-expect-error Many-reference first results expose only selected referenced fields.
selectedFirstTransaction.current?.value

// @ts-expect-error Projection reference results expose only selected referenced fields.
selectedEventTransactions.current?.values[0]?.txHash

// @ts-expect-error Projection reference first results expose only selected referenced fields.
selectedFirstEventTransaction.current?.value

// @ts-expect-error Nested result field maps expose only selected fields.
selectedTransactionProxy.current?.fields.envelopeType

// @ts-expect-error Projection fields cannot cross facet boundaries.
selectedTransactionProxy.FeeMarket.maxFeePerBlobGas

// @ts-expect-error The base collision accessor accepts only colliding base field names.
selectedTransactionProxy[EntityProxyField]('envelopeType')

// @ts-expect-error The projection collision accessor rejects valid non-colliding fields.
selectedTransactionProxy.Blob[EntityProxyField]('maxFeePerBlobGas')

// @ts-expect-error Base field names must exist on the entity.
const invalidBaseField: EntityBaseFieldName<typeof schema, EvmTransactionEntityType> = 'missing'

// @ts-expect-error Facet paths must name a declared facet.
const invalidFacetPath: EntityFacetPathFor<typeof schema, EvmTransactionEntityType> = ['Missing']

// @ts-expect-error Nested facet paths must follow the declared facet tree.
const invalidNestedFacetPath: EntityFacetPathFor<typeof schema, EvmLogEntityType> = ['Event', 'Missing']

const invalidCrossFacetSelection = {
	fields: {
		// @ts-expect-error Blob fields are not selectable through FeeMarket.
		maxFeePerBlobGas: true,
	},
} as const satisfies EntitySelection<
	typeof schema,
	EvmTransactionEntityType,
	readonly ['FeeMarket']
>

const invalidCollisionFieldSelection = {
	fields: {
		// @ts-expect-error A facet name cannot be addressed as a base field.
		Blob: true,
	},
} as const satisfies EntitySelection<
	typeof schema,
	EvmTransactionEntityType
>

// @ts-expect-error The field name must belong to the address facet path.
const invalidAddress: EntityFieldAddressFor<typeof schema, EvmTransactionEntityType> = {
	entityType: EntityType.EvmTransaction,
	facetPath: ['FeeMarket'],
	fieldName: 'maxFeePerBlobGas',
}

// @ts-expect-error Serialized field-address keys must encode a valid path-local field.
const invalidAddressKey: EntityFieldAddressKeyFor<typeof schema, EvmTransactionEntityType> = 'EvmTransaction\x1eFeeMarket\x1emaxFeePerBlobGas'

// @ts-expect-error Selected results expose only selected base fields.
selectedTransaction.envelopeType

// @ts-expect-error Selected projection results expose only selected projection fields.
selectedBlob.blobGasUsed

// @ts-expect-error Schema-selected one references reject recursively unselected fields.
selectedLog.$transaction.envelopeType

// @ts-expect-error Schema-selected many references reject recursively unselected fields.
selectedLog.$$transactions[0]?.txHash

void [
	baseField,
	facetPath,
	nestedFacetPath,
	facetField,
	baseAddress,
	nestedAddress,
	addressKey,
	invalidBaseField,
	invalidFacetPath,
	invalidNestedFacetPath,
	invalidCrossFacetSelection,
	invalidCollisionFieldSelection,
	invalidAddress,
	invalidAddressKey,
]
