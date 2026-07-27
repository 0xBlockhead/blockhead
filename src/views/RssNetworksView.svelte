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
		typeAnnotationParagraphs = ['RSS and Atom syndication feeds publish ordered item streams keyed by feed URL.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RssNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssNetwork}
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
	{#snippet Item({ item: rssNetwork })}
		{@const rssNetworkSelector = rssNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssNetwork}
			entitySelector={rssNetworkSelector}
			href={
				(
					rssNetworkSelector.scope === 'RssNetwork' ?
						resolve('/(social)/(rss)/rss')
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{rssNetwork.protocolName || 'RSS / Atom'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
