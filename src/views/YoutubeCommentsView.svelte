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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeComment>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.YoutubeComment}
			entitySelector={youtubeComment[EntityMetaKey.Selector]}
			href={
				(
					youtubeComment[EntityMetaKey.Selector] != null && 'videoId' in youtubeComment[EntityMetaKey.Selector]
					&& youtubeComment[EntityMetaKey.Selector].videoId != null
					&& youtubeComment[EntityMetaKey.Selector] != null && 'commentId' in youtubeComment[EntityMetaKey.Selector]
					&& youtubeComment[EntityMetaKey.Selector].commentId != null ?
						resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]', {
					videoId: encodeURIComponent(String(youtubeComment[EntityMetaKey.Selector].videoId ?? '')),
					commentId: encodeURIComponent(String(youtubeComment[EntityMetaKey.Selector].commentId ?? '')),
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
				{[String((youtubeCommentFields.text) ?? '')].filter(Boolean).join(' ') || 'YouTube comment'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((youtubeCommentFields.publishedAtMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
