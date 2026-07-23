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
		title = 'Reddit subreddit observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditSubreddit_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditSubreddit_Timestamp>
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
	entityType={EntityType.RedditSubreddit_Timestamp}
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
				timestampMs: true,
				subscriberCount: true,
				source: true,
				activeUserCount: true,
				$subreddit: true,
			},
		})
	}
	{countResource}
	getResourceItems={(redditSubredditTimestamps) => [...new Map(redditSubredditTimestamps.values.map((redditSubredditTimestamp) => [redditSubredditTimestamp[EntityMetaKey.SelectorKey], redditSubredditTimestamp])).values()]}
	getKey={(redditSubredditTimestamp) => redditSubredditTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit subreddit observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditSubredditTimestamp })}
		{@const redditSubredditTimestampFields = { ...redditSubredditTimestamp[EntityMetaKey.Selector], ...redditSubredditTimestamp }}
		<EntityView
			entityType={EntityType.RedditSubreddit_Timestamp}
			entitySelector={redditSubredditTimestamp[EntityMetaKey.Selector]}
			href={
				(
					redditSubredditTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in redditSubredditTimestamp[EntityMetaKey.Selector]
					&& redditSubredditTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& redditSubredditTimestamp[EntityMetaKey.Selector] != null && 'source' in redditSubredditTimestamp[EntityMetaKey.Selector]
					&& redditSubredditTimestamp[EntityMetaKey.Selector].source != null
					&& redditSubredditTimestamp[EntityMetaKey.Selector] != null && '$subreddit' in redditSubredditTimestamp[EntityMetaKey.Selector]
					&& redditSubredditTimestamp[EntityMetaKey.Selector].$subreddit != null && 'name' in redditSubredditTimestamp[EntityMetaKey.Selector].$subreddit
					&& redditSubredditTimestamp[EntityMetaKey.Selector].$subreddit.name != null ?
						resolve('/reddit/r/[name=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(redditSubredditTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(redditSubredditTimestamp[EntityMetaKey.Selector].source ?? ''),
					name: encodeURIComponent(String(redditSubredditTimestamp[EntityMetaKey.Selector].$subreddit.name ?? '')),
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
				{[String((redditSubredditTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit subreddit timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((redditSubredditTimestampFields.subscriberCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((redditSubredditTimestampFields.source) ?? ''), (String((redditSubredditTimestampFields.activeUserCount) ?? '') ? String((redditSubredditTimestampFields.activeUserCount) ?? '') + ' active' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
