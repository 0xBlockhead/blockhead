<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalRedditNetwork_Timestamp>, 'prefetched'> = $props()

	const globalRedditNetworkTimestamp = $derived(selection({
		fields: {
			reachable: true,
			observedLinkCount: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRedditNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalRedditNetworkTimestamp}>
			{#snippet children(entity)}
				{[selection.entitySelector.source, String(entity.reachable ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalRedditNetworkTimestamp}>
			{#snippet children(entity)}
				{@const observedLinkCount = entity.observedLinkCount}
				{#if observedLinkCount != null}
					<span data-text="muted">
						{observedLinkCount}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={globalRedditNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listingWindowKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const listingWindowKind = entity.listingWindowKind}
					{#if listingWindowKind != null}
						<div>
							<dt>Listing window kind</dt>
							<dd>
								{listingWindowKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedSubredditCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedSubredditCount = entity.observedSubredditCount}
					{#if observedSubredditCount != null}
						<div>
							<dt>Observed subreddit count</dt>
							<dd>
								{observedSubredditCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={globalRedditNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const observedLinkCount = entity.observedLinkCount}
					{#if observedLinkCount != null}
						<div>
							<dt>Observed link count</dt>
							<dd>
								{observedLinkCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededSubredditCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededSubredditCount = entity.seededSubredditCount}
					{#if seededSubredditCount != null}
						<div>
							<dt>Seeded subreddit count</dt>
							<dd>
								{seededSubredditCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededLinkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededLinkCount = entity.seededLinkCount}
					{#if seededLinkCount != null}
						<div>
							<dt>Seeded link count</dt>
							<dd>
								{seededLinkCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rateLimitRemaining = entity.rateLimitRemaining}
					{#if rateLimitRemaining != null}
						<div>
							<dt>Rate limit remaining</dt>
							<dd>
								{rateLimitRemaining}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalRedditNetworkView
						selection={select(EntityType._GlobalRedditNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
