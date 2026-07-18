<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'URL preview observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UrlPreview_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.UrlPreview_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UrlPreview_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$image: true,
				title: true,
				$url: true,
				siteName: true,
				previewStatus: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(urlPreviewTimestamps) => [...new Map(urlPreviewTimestamps.values.map((urlPreviewTimestamp) => [urlPreviewTimestamp[EntityMetaKey.SelectorKey], urlPreviewTimestamp])).values()]}
	getKey={(urlPreviewTimestamp) => urlPreviewTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No URL preview observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: urlPreviewTimestamp })}
		{@const urlPreviewTimestampFields = { ...urlPreviewTimestamp[EntityMetaKey.Selector], ...urlPreviewTimestamp }}
		{@const selection = select(EntityType.UrlPreview_Timestamp, urlPreviewTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const urlPreviewTimestampHrefFields = { ...urlPreviewTimestamp, ...urlPreviewTimestamp[EntityMetaKey.Selector] }}
		<UrlPreview_TimestampView
			selection={selection}
			prefetched={urlPreviewTimestampFields}
			href={
				(urlPreviewTimestampHrefFields.timestampMs !== undefined && urlPreviewTimestampHrefFields.source !== undefined && urlPreviewTimestampHrefFields.$url !== undefined && urlPreviewTimestampHrefFields.$url.url !== undefined ? resolve('/url/[url=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(urlPreviewTimestampHrefFields.timestampMs ?? ''),
					source: String(urlPreviewTimestampHrefFields.source ?? ''),
					url: encodeURIComponent(String(urlPreviewTimestampHrefFields.$url.url ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
