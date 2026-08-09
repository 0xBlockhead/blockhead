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
	}: EntityListViewProps<EntityType.Payout> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Payout}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: payout })}
		{@const payoutSelector = payout[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Payout}
			entitySelector={payoutSelector}
			href={
				resolve(
					'/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]',
					{
						payoutSource: payoutSelector.source,
						payoutId: payoutSelector.payoutId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
