<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGSettlementTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGSettlementTrace}
	bind:open
	resource={
		selection({
			fields: {
				traceId: true,
				$serviceRequest: true,
				settlementTransactionHash: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGSettlementTrace })}
		{@const zeroGSettlementTraceSelector = zeroGSettlementTrace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGSettlementTrace}
			entitySelector={zeroGSettlementTraceSelector}
		>
			{#snippet Title()}
				{zeroGSettlementTraceSelector.traceId || 'zero g settlement trace'}
			{/snippet}

			{#snippet Value()}
				{zeroGSettlementTraceSelector.$serviceRequest.requestId || 'zero g service request'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGSettlementTrace.settlementTransactionHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
