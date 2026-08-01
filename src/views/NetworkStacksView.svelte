<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.NetworkStack> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkStack}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				networkStackId: true,
			},
		})
	}
>
	{#snippet Item({ item: networkStack })}
		{@const networkStackSelector = networkStack[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NetworkStack}
			entitySelector={networkStackSelector}
			href={
				resolve(
					'/(explore)/network-stack/[networkStackId=stringSegment]',
					{
						networkStackId: networkStackSelector.networkStackId,
					}
				)
			}
		>
			{#snippet Title()}
				{networkStack.label || networkStackSelector.networkStackId || 'network stack'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
