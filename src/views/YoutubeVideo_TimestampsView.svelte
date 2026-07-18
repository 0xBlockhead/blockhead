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
		title = 'YouTube video observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideo_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeVideo_Timestamp>
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
	import YoutubeVideo_TimestampView from '$/views/YoutubeVideo_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeVideo_Timestamp}
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
				$video: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(youtubeVideoTimestamps) => [...new Map(youtubeVideoTimestamps.values.map((youtubeVideoTimestamp) => [youtubeVideoTimestamp[EntityMetaKey.SelectorKey], youtubeVideoTimestamp])).values()]}
	getKey={(youtubeVideoTimestamp) => youtubeVideoTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube video observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeVideoTimestamp })}
		{@const youtubeVideoTimestampFields = { ...youtubeVideoTimestamp[EntityMetaKey.Selector], ...youtubeVideoTimestamp }}
		{@const selection = select(EntityType.YoutubeVideo_Timestamp, youtubeVideoTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeVideoTimestampHrefFields = { ...youtubeVideoTimestamp, ...youtubeVideoTimestamp[EntityMetaKey.Selector] }}
		<YoutubeVideo_TimestampView
			selection={selection}
			prefetched={youtubeVideoTimestampFields}
			href={
				(youtubeVideoTimestampHrefFields.timestampMs !== undefined && youtubeVideoTimestampHrefFields.source !== undefined && youtubeVideoTimestampHrefFields.$video !== undefined && youtubeVideoTimestampHrefFields.$video.videoId !== undefined ? resolve('/youtube/video/[videoId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeVideoTimestampHrefFields.timestampMs ?? ''),
					source: String(youtubeVideoTimestampHrefFields.source ?? ''),
					videoId: encodeURIComponent(String(youtubeVideoTimestampHrefFields.$video.videoId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
