<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RedditSubreddit_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RedditSubreddit_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const redditSubredditTimestamp = $derived(selection({
		fields: {
			subscriberCount: true,
			activeUserCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit subreddit timestamp')
	const viewDomId = $derived('reddit-subreddit-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(reddit)/reddit/r/[name]/(subreddit)/observations/[timestampMs=nonNegativeInteger]/[source]', {
			name: String(({ ...selection.entitySelector, ...prefetched }).$subreddit.name),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={redditSubredditTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const subscriberCount0 = ({ ...selection.entitySelector, ...prefetched }).subscriberCount}
			{#if subscriberCount0 !== undefined && subscriberCount0 !== null}
				<NumberValue value={Number(subscriberCount0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={redditSubredditTimestamp}>
				{#snippet Pending()}
					{@const subscriberCount0 = ({ ...selection.entitySelector, ...prefetched }).subscriberCount}
					{#if subscriberCount0 !== undefined && subscriberCount0 !== null}
						<NumberValue value={Number(subscriberCount0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const subscriberCount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).subscriberCount}
					{#if subscriberCount0 !== undefined && subscriberCount0 !== null}
						<NumberValue value={Number(subscriberCount0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const activeUserCount1 = prefetched.activeUserCount}
			{#if activeUserCount1 !== undefined && activeUserCount1 !== null}
				<span data-text="muted">
					<NumberValue value={Number(activeUserCount1)} />

					<span> active</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditSubredditTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const activeUserCount1 = prefetched.activeUserCount}
					{#if activeUserCount1 !== undefined && activeUserCount1 !== null}
						<span data-text="muted">
							<NumberValue value={Number(activeUserCount1)} />

							<span> active</span>
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const activeUserCount1 = entity.activeUserCount}
					{#if activeUserCount1 !== undefined && activeUserCount1 !== null}
						<span data-text="muted">
							<NumberValue value={Number(activeUserCount1)} />

							<span> active</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Subreddit</dt>
				<dd>
					<RedditSubredditView
						selection={select(EntityType.RedditSubreddit, selection.entitySelector.$subreddit)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
