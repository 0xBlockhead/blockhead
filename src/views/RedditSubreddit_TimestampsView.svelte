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
		title = 'Reddit subreddit observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Reddit subreddit observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditSubreddit_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditSubreddit_Timestamp>
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
	import RedditSubreddit_TimestampView from '$/views/RedditSubreddit_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					timestampMs: true,
					subscriberCount: true,
					source: true,
					activeUserCount: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditSubreddit_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(redditSubredditTimestamps)}
			{@const uniqueRedditSubredditTimestamps = [...new Map(redditSubredditTimestamps.values.map((redditSubredditTimestamp) => [redditSubredditTimestamp[EntityMetaKey.SelectorKey], redditSubredditTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditSubreddit_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditSubredditTimestamps.values.length === uniqueRedditSubredditTimestamps.length && redditSubredditTimestamps.totalCount != null && redditSubredditTimestamps.totalCount >= uniqueRedditSubredditTimestamps.length ? redditSubredditTimestamps.totalCount : uniqueRedditSubredditTimestamps.length}
				getKey={(redditSubredditTimestamp) => redditSubredditTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRedditSubredditTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit subreddit observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditSubredditTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditSubreddit_Timestamp> })}
					<RedditSubreddit_TimestampView
						href={
							resolve('/(social)/(reddit)/reddit/r/[name]/(subreddit)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								name: String(({ ...redditSubredditTimestamp.entitySelector, ...redditSubredditTimestamp }).$subreddit.name),
								timestampMs: String(({ ...redditSubredditTimestamp.entitySelector, ...redditSubredditTimestamp }).timestampMs),
								source: String(({ ...redditSubredditTimestamp.entitySelector, ...redditSubredditTimestamp }).source),
							})
						}
						selection={select(EntityType.RedditSubreddit_Timestamp, redditSubredditTimestamp.entitySelector)}
						prefetched={redditSubredditTimestamp}
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
		entityType={EntityType.RedditSubreddit_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
