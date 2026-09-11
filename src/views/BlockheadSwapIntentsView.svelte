<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSwapIntent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSwapIntent}
	bind:open
	resource={
		selection({
			fields: {
				$sessionAction: true,
				amount: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSwapIntent })}
		{@const blockheadSwapIntentSelector = blockheadSwapIntent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSwapIntent}
			entitySelector={blockheadSwapIntentSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]/(blockheadSession)/swap-intent/[actionId=stringSegment]',
					{
						sessionId: blockheadSwapIntentSelector.sessionId,
						actionId: blockheadSwapIntentSelector.actionId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadSwapIntent.$sessionAction.selectedProtocol ?? '') || 'blockhead session action'}
			{/snippet}

			{#snippet Value()}
				{blockheadSwapIntent.amount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSwapIntent.$network == null ? '' : blockheadSwapIntent.$network.name || (blockheadSwapIntent.$network.caip2 == null ? '' : `${blockheadSwapIntent.$network.caip2.namespace}:${blockheadSwapIntent.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
