<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.HyperliquidTransaction>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidTransaction}
	entitySelector={selector}
	title={selector.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.HyperliquidTransaction,
					selector,
					({ fields: { actionType: true, status: true } }),
				)}
			placeholderText={`Loading Hyperliquid Transaction...`}
		>
			{#snippet children(hyperliquidTransaction)}
				<dl>
					{#if hyperliquidTransaction.fields.actionType != null}
						<div>
							<dt>Action Type</dt>
							<dd>{hyperliquidTransaction.fields.actionType}</dd>
						</div>
					{/if}

					{#if hyperliquidTransaction.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{hyperliquidTransaction.fields.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
