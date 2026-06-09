<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			entityId: EntityId<typeof schema, EntityType.UtxoAddress>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoAddress = useEntity(entityCollectionsContext, EntityType.UtxoAddress,
		entityId,
		({ fields: { balanceSats: true, transactionCount: true, unspentOutputCount: true, totalReceivedSats: true, totalSpentSats: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={utxoAddress}
			placeholderText="Loading UTXO address..."
		>
			{#snippet children(utxoAddress)}
				<dl>
					{#if utxoAddress.fields.balanceSats != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={utxoAddress.fields.balanceSats} /> sats</dd>
						</div>
					{/if}

					{#if utxoAddress.fields.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={utxoAddress.fields.transactionCount} /></dd>
						</div>
					{/if}

					{#if utxoAddress.fields.unspentOutputCount != null}
						<div>
							<dt>UTXOs</dt>
							<dd><NumberValue value={utxoAddress.fields.unspentOutputCount} /></dd>
						</div>
					{/if}

					{#if open && utxoAddress.fields.totalReceivedSats != null}
						<div>
							<dt>Total received</dt>
							<dd><NumberValue value={utxoAddress.fields.totalReceivedSats} /> sats</dd>
						</div>
					{/if}

					{#if open && utxoAddress.fields.totalSpentSats != null}
						<div>
							<dt>Total spent</dt>
							<dd><NumberValue value={utxoAddress.fields.totalSpentSats} /> sats</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
