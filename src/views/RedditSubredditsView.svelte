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
		title = 'Reddit subreddits',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditSubreddits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditSubreddit>
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
	entityType={EntityType.RedditSubreddit}
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
				title: true,
				name: true,
			},
		})
	}
	{countResource}
	getResourceItems={(redditSubreddits) => [...new Map(redditSubreddits.values.map((redditSubreddit) => [redditSubreddit[EntityMetaKey.SelectorKey], redditSubreddit])).values()]}
	getKey={(redditSubreddit) => redditSubreddit[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit subreddits yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditSubreddit })}
		{@const redditSubredditFields = { ...redditSubreddit[EntityMetaKey.Selector], ...redditSubreddit }}
		<EntityView
			entityType={EntityType.RedditSubreddit}
			entitySelector={redditSubreddit[EntityMetaKey.Selector]}
			href={
				(
					redditSubreddit[EntityMetaKey.Selector] != null && 'name' in redditSubreddit[EntityMetaKey.Selector]
					&& redditSubreddit[EntityMetaKey.Selector].name != null ?
						resolve('/reddit/r/[name=stringSegment]', {
					name: encodeURIComponent(String(redditSubreddit[EntityMetaKey.Selector].name ?? '')),
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
				{[String((redditSubredditFields.title) ?? '')].filter(Boolean).join(' ') || [(String((redditSubredditFields.name) ?? '') ? 'r/' + String((redditSubredditFields.name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
