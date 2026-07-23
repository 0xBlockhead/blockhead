<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UrlPreview_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.UrlPreview_Timestamp}
			entitySelector={urlPreviewTimestamp[EntityMetaKey.Selector]}
			href={
				(
					urlPreviewTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in urlPreviewTimestamp[EntityMetaKey.Selector]
					&& urlPreviewTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& urlPreviewTimestamp[EntityMetaKey.Selector] != null && 'source' in urlPreviewTimestamp[EntityMetaKey.Selector]
					&& urlPreviewTimestamp[EntityMetaKey.Selector].source != null
					&& urlPreviewTimestamp[EntityMetaKey.Selector] != null && '$url' in urlPreviewTimestamp[EntityMetaKey.Selector]
					&& urlPreviewTimestamp[EntityMetaKey.Selector].$url != null && 'url' in urlPreviewTimestamp[EntityMetaKey.Selector].$url
					&& urlPreviewTimestamp[EntityMetaKey.Selector].$url.url != null ?
						resolve('/url/[url=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(urlPreviewTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(urlPreviewTimestamp[EntityMetaKey.Selector].source ?? ''),
					url: encodeURIComponent(String(urlPreviewTimestamp[EntityMetaKey.Selector].$url.url ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((urlPreviewTimestampFields.title) ?? ''), [String((urlPreviewTimestampFields.$url.url) ?? '')].filter(Boolean).join(' ') || 'URL'].filter(Boolean).join(' ') || 'URL preview timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((urlPreviewTimestampFields.title) ?? ''), String((urlPreviewTimestampFields.siteName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((urlPreviewTimestampFields.previewStatus) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
