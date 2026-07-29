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
	}: EntityListViewProps<EntityType.OracleFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				feedKind: true,
				$market: true,
				address: true,
			},
		})
	}
>
	{#snippet Item({ item: oracleFeed })}
		{@const oracleFeedSelector = oracleFeed[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OracleFeed}
			entitySelector={oracleFeedSelector}
		>
			{#snippet Title()}
				{(oracleFeed.label ?? '') || oracleFeedSelector.address || 'oracle feed'}
			{/snippet}

			{#snippet Value()}
				{[(oracleFeed.feedKind ?? ''), oracleFeed.$market == null ? '' : 'Market'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
