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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Reddit comments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditComments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditComment>
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
	entityType={EntityType.RedditComment}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
			fields: {
				body: true,
				fullname: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(redditComments) => [...new Map(redditComments.values.map((redditComment) => [redditComment[EntityMetaKey.SelectorKey], redditComment])).values()]}
	getKey={(redditComment) => redditComment[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit comments yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditComment })}
		{@const redditCommentFields = { ...redditComment[EntityMetaKey.Selector], ...redditComment }}
		<EntityView
			entityType={EntityType.RedditComment}
			entitySelector={redditComment[EntityMetaKey.Selector]}
			href={
				(
					redditComment[EntityMetaKey.Selector] != null && 'fullname' in redditComment[EntityMetaKey.Selector]
					&& redditComment[EntityMetaKey.Selector].fullname != null ?
						resolve('/reddit/comment/[fullname=stringSegment]', {
					fullname: encodeURIComponent(String(redditComment[EntityMetaKey.Selector].fullname ?? '')),
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
				{[String((redditCommentFields.body) ?? '')].filter(Boolean).join(' ') || [String((redditCommentFields.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((redditCommentFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
