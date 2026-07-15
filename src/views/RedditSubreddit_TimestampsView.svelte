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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RedditSubreddit_Timestamp>
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
			selection({
				fields: {
					timestampMs: true,
					subscriberCount: true,
					source: true,
					activeUserCount: true,
					$subreddit: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={redditSubredditTimestamps.totalCount}
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

				{#snippet Item({ item: redditSubredditTimestamp })}
					{@const redditSubredditTimestampFields = { ...redditSubredditTimestamp[EntityMetaKey.Selector], ...redditSubredditTimestamp }}
					{@const selection = select(EntityType.RedditSubreddit_Timestamp, redditSubredditTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const redditSubredditTimestampHrefFields = { ...redditSubredditTimestamp, ...redditSubredditTimestamp[EntityMetaKey.Selector] }}
					<RedditSubreddit_TimestampView
						selection={selection}
						prefetched={redditSubredditTimestampFields}
						href={
							(redditSubredditTimestampHrefFields.timestampMs !== undefined && redditSubredditTimestampHrefFields.source !== undefined && redditSubredditTimestampHrefFields.$subreddit !== undefined && redditSubredditTimestampHrefFields.$subreddit.name !== undefined ? resolve('/reddit/r/[name=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(redditSubredditTimestampHrefFields.timestampMs ?? ''),
								source: String(redditSubredditTimestampHrefFields.source ?? ''),
								name: String(redditSubredditTimestampHrefFields.$subreddit.name ?? ''),
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
		entityType={EntityType.RedditSubreddit_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
