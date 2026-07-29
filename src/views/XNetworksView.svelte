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
		typeAnnotationParagraphs = ['X profiles and posts surfaced through declared public HTTP sources.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: xNetwork })}
		{@const xNetworkSelector = xNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XNetwork}
			entitySelector={xNetworkSelector}
			href={
				xNetworkSelector.scope === 'XNetwork' ?
					resolve('/(social)/(x)/x')
				:
					undefined
			}
		>
			{#snippet Title()}
				{xNetwork.protocolName || 'X'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
