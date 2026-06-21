<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronTokenTransfer>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronTokenTransfer}
	entitySelector={selection.entitySelector}
	title={`${selection.entitySelector.transactionId}:${selection.entitySelector.transferIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Transfer {selection.entitySelector.transferIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { standard: true, amount: true, timestampMs: true } }),
				)}
			placeholderText="Loading TRON token transfer..."
		>
			{#snippet children(transfer)}
				<dl data-column-item="center">
					{#if transfer.standard != null}
						<div>
							<dt>Standard</dt>
							<dd>{transfer.standard}</dd>
						</div>
					{/if}

					{#if transfer.amount != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={transfer.amount} /></dd>
						</div>
					{/if}

					{#if transfer.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={transfer.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
