<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.RssItem_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))
	const titleFallback = 'RSS item observation'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				feedUrl: encodeURIComponent(String(selection.entitySelector.$item.$feed.feedUrl)),
				itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind),
				itemIdentity: encodeURIComponent(String(selection.entitySelector.$item.itemIdentity)),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<RssItemView
			selection={select(EntityType.RssItem, selection.entitySelector.$item)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Item</dt>
				<dd>
					<RssItemView
						selection={select(EntityType.RssItem, selection.entitySelector.$item)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Observed</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									observed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.observed ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed reachable</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									reachable: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.reachable ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fetch window</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									fetchWindowKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.fetchWindowKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
