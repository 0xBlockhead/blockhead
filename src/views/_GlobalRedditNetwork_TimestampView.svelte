<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalRedditNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const globalRedditNetworkTimestamp = $derived(selection({
		fields: {
			reachable: true,
			observedLinkCount: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'global Reddit network timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRedditNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalRedditNetworkTimestamp}>
			{#snippet children(entity)}
				{[pendingEntity.source, String(entity.reachable ?? '')].filter(Boolean).join(' ') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalRedditNetworkTimestamp}>
			{#snippet children(entity)}
				{@const observedLinkCount0 = entity.observedLinkCount}
				{#if observedLinkCount0 != null}
					<span data-text="muted">
						{String(observedLinkCount0)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								{String(observedSubredditCount)}
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
								{String(observedLinkCount)}
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
								{String(seededSubredditCount)}
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
								{String(seededLinkCount)}
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
								{String(rateLimitRemaining)}
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
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
