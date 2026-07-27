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
	}: EntityListViewProps<EntityType.UrlPreview_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UrlPreview_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$image: true,
				title: true,
				$url: true,
				siteName: true,
				previewStatus: true,
			},
		})
	}
>
	{#snippet Item({ item: urlPreviewTimestamp })}
		{@const urlPreviewTimestampSelector = urlPreviewTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UrlPreview_Timestamp}
			entitySelector={urlPreviewTimestampSelector}
			href={
				resolve(
					'/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						url: encodeURIComponent(String(urlPreviewTimestampSelector.$url.url)),
						timestampMs: String(urlPreviewTimestampSelector.timestampMs),
						source: String(urlPreviewTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{[(urlPreviewTimestamp.title ?? ''), String(urlPreviewTimestampSelector.$url.url) || 'URL'].filter(Boolean).join(' ') || 'URL preview timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(urlPreviewTimestamp.title ?? ''), (urlPreviewTimestamp.siteName ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(urlPreviewTimestamp.previewStatus ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
