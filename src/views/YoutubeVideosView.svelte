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
		title = 'YouTube Videos',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideos-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeVideo>
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
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeVideo}
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
				title: true,
				videoId: true,
				$author: true,
				publishedAtMs: true,
			},
		})
	}
	getResourceItems={(youtubeVideos) => [...new Map(youtubeVideos.values.map((youtubeVideo) => [youtubeVideo[EntityMetaKey.SelectorKey], youtubeVideo])).values()]}
	getKey={(youtubeVideo) => youtubeVideo[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube Videos yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeVideo })}
		{@const youtubeVideoFields = { ...youtubeVideo[EntityMetaKey.Selector], ...youtubeVideo }}
		{@const selection = select(EntityType.YoutubeVideo, youtubeVideo[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeVideoHrefFields = { ...youtubeVideo, ...youtubeVideo[EntityMetaKey.Selector] }}
		<YoutubeVideoView
			selection={selection}
			prefetched={youtubeVideoFields}
			href={
				(youtubeVideoHrefFields.videoId !== undefined ? resolve('/youtube/video/[videoId=stringSegment]', {
					videoId: encodeURIComponent(String(youtubeVideoHrefFields.videoId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
