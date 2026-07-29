<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.BlockheadSwapIntent}
			entitySelector={blockheadSwapIntent[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadSwapIntent.$sessionAction.actionType || 'blockhead session action'}
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
