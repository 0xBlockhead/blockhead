<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.TronTokenTransfer>
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
	entitySelector={selector}
	title={`${selector.transactionId}:${selector.transferIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Transfer {selector.transferIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.TronTokenTransfer,
					selector,
					({ fields: { standard: true, amount: true, timestampMs: true } }),
				)}
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
