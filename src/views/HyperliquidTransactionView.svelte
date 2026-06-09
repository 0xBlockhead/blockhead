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
			entityId: EntityId<typeof schema, EntityType.HyperliquidTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const hyperliquidTransaction = useEntity(entityCollectionsContext, 
		EntityType.HyperliquidTransaction,
		entityId,
		({ fields: { actionType: true, status: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidTransaction}
	{entityId}
	title={entityId.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidTransaction}
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
