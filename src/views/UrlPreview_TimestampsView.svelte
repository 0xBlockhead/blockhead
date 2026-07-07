<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'URL preview observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UrlPreview_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UrlPreview_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UrlPreview_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(urlPreviewTimestamps)}
			{@const uniqueUrlPreviewTimestamps = [...new Map(urlPreviewTimestamps.values.map((urlPreviewTimestamp) => [urlPreviewTimestamp[EntityMetaKey.SelectorKey], urlPreviewTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UrlPreview_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={urlPreviewTimestamps.totalCount}
				getKey={(urlPreviewTimestamp) => urlPreviewTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueUrlPreviewTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No URL preview observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: urlPreviewTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UrlPreview_Timestamp> })}
					{@const urlPreviewTimestampFields = { ...urlPreviewTimestamp[EntityMetaKey.Selector], ...urlPreviewTimestamp }}
					{@const urlPreviewTimestampHrefFields = { ...urlPreviewTimestamp, ...urlPreviewTimestamp[EntityMetaKey.Selector] }}
					<UrlPreview_TimestampView
						selection={select(EntityType.UrlPreview_Timestamp, urlPreviewTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={urlPreviewTimestampFields}
						href={
							(urlPreviewTimestampHrefFields.$url !== undefined && urlPreviewTimestampHrefFields.$url.url !== undefined && urlPreviewTimestampHrefFields.timestampMs !== undefined && urlPreviewTimestampHrefFields.source !== undefined ? resolve('/(explore)/url/[url]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								url: encodeURIComponent(String(urlPreviewTimestampHrefFields.$url.url ?? '')),
								timestampMs: String(urlPreviewTimestampHrefFields.timestampMs ?? ''),
								source: encodeURIComponent(String(urlPreviewTimestampHrefFields.source ?? '')),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.UrlPreview_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
