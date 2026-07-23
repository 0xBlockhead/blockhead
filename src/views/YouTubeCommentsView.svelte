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
		title = 'YouTube comments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeComments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeComment>
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
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeComment}
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
				authorDisplayName: true,
				text: true,
				publishedAtMs: true,
				videoId: true,
				commentId: true,
			},
		})
	}
	getResourceItems={(youtubeComments) => [...new Map(youtubeComments.values.map((youtubeComment) => [youtubeComment[EntityMetaKey.SelectorKey], youtubeComment])).values()]}
	getKey={(youtubeComment) => youtubeComment[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube comments yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeComment })}
		{@const youtubeCommentFields = { ...youtubeComment[EntityMetaKey.Selector], ...youtubeComment }}
		{@const selection = select(EntityType.YoutubeComment, youtubeComment[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeCommentHrefFields = { ...youtubeComment, ...youtubeComment[EntityMetaKey.Selector] }}
		<YoutubeCommentView
			selection={selection}
			prefetched={youtubeCommentFields}
			href={
				(youtubeCommentHrefFields.videoId !== undefined && youtubeCommentHrefFields.commentId !== undefined ? resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]', {
					videoId: encodeURIComponent(String(youtubeCommentHrefFields.videoId ?? '')),
					commentId: encodeURIComponent(String(youtubeCommentHrefFields.commentId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
