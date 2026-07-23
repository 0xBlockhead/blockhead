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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeVideo>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.YoutubeVideo}
			entitySelector={youtubeVideo[EntityMetaKey.Selector]}
			href={
				(
					youtubeVideo[EntityMetaKey.Selector] != null && 'videoId' in youtubeVideo[EntityMetaKey.Selector]
					&& youtubeVideo[EntityMetaKey.Selector].videoId != null ?
						resolve('/youtube/video/[videoId=stringSegment]', {
					videoId: encodeURIComponent(String(youtubeVideo[EntityMetaKey.Selector].videoId ?? '')),
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
				{[String((youtubeVideoFields.title) ?? '')].filter(Boolean).join(' ') || [String((youtubeVideoFields.videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video'}
			{/snippet}

			{#snippet Value()}
				{[[String((youtubeVideoFields.$author.title) ?? '')].filter(Boolean).join(' ') || [String((youtubeVideoFields.$author.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((youtubeVideoFields.publishedAtMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
