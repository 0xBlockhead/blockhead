<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.UtxoTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const transaction = useEntity(entityCollectionsContext, EntityType.UtxoTransaction,
		entityId,
		({ sources: [
				Source.Esplora_Rest,
				Source.Blockchair_Rest,
				Source.ThreeXpl_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
				Source.Zcashd_JsonRpc,
			], fields: { version: true, lockTime: true, sizeBytes: true, virtualSizeBytes: true, weightUnits: true, feeSats: true, isCoinbase: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	{entityId}
	href={
		'networkSlug' in entityId.$network ?
			`/network/${entityId.$network.networkSlug}/transactions/${entityId.txId}`
		:
			`/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/transactions/${entityId.txId}`
	}
	title={entityId.txId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.txId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A UTXO transaction spends previous outputs and creates new outputs; token or shielded extensions remain chain-specific annotations.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={transaction}
			placeholderText="Loading transaction…"
		>
			{#snippet children(transaction)}
				<dl>
					{#if transaction.fields.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={transaction.fields.version} /></dd>
						</div>
					{/if}

					{#if transaction.fields.feeSats != null}
						<div>
							<dt>Fee</dt>
							<dd>{transaction.fields.feeSats.toString()} sats</dd>
						</div>
					{/if}

					{#if transaction.fields.sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd><NumberValue value={transaction.fields.sizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if transaction.fields.virtualSizeBytes != null}
						<div>
							<dt>Virtual size</dt>
							<dd><NumberValue value={transaction.fields.virtualSizeBytes} /> vB</dd>
						</div>
					{/if}

					{#if transaction.fields.weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={transaction.fields.weightUnits} /> WU</dd>
						</div>
					{/if}

					{#if transaction.fields.lockTime != null}
						<div>
							<dt>Lock time</dt>
							<dd><NumberValue value={transaction.fields.lockTime} /></dd>
						</div>
					{/if}

					{#if transaction.fields.isCoinbase != null}
						<div>
							<dt>Coinbase</dt>
							<dd>{transaction.fields.isCoinbase ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
