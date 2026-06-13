<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.TronTokenTransfer>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const transfer = subscribe(EntityType.TronTokenTransfer,
		entityId,
		({ fields: { standard: true, amount: true, timestampMs: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronTokenTransfer}
	{entityId}
	title={`${entityId.transactionId}:${entityId.transferIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Transfer {entityId.transferIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={transfer}
			placeholderText="Loading TRON token transfer..."
		>
			{#snippet children(transfer)}
				<dl data-column-item="center">
					{#if transfer.fields.standard != null}
						<div>
							<dt>Standard</dt>
							<dd>{transfer.fields.standard}</dd>
						</div>
					{/if}

					{#if transfer.fields.amount != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={transfer.fields.amount} /></dd>
						</div>
					{/if}

					{#if transfer.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={transfer.fields.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
