<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A web URL that is modeled as a referenced resource rather than an inline string.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Url> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Url}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				url: true,
			},
		})
	}
>
	{#snippet Item({ item: url })}
		{@const urlSelector = url[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Url}
			entitySelector={urlSelector}
			href={
				resolve(
					'/(explore)/url/[url=absoluteUrl]',
					{
						url: encodeURIComponent(String(urlSelector.url)),
					}
				)
			}
		>
			{#snippet Title()}
				{String(urlSelector.url) || 'URL'}
			{/snippet}

			{#snippet Value()}
				{String(urlSelector.url)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
