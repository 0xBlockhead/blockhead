<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RssFeed_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RssFeed_Timestamp>>
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

	const rssFeedTimestamp = $derived(selection({
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
		fields: {
			reachable: true,
			sourceWindowItemCount: true,
			fetchWindowKind: true,
		},
	}))
	const titleFallback = $derived('RSS feed observation')
	const viewDomId = $derived('rss-feed-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssFeed_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<RssFeedView
				selection={select(EntityType.RssFeed, selection.entitySelector.$feed)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={rssFeedTimestamp}>
				{#snippet Pending()}
					<RssFeedView
						selection={select(EntityType.RssFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<RssFeedView
						selection={select(EntityType.RssFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={rssFeedTimestamp}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={rssFeedTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssFeedTimestamp}>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssFeedTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowItemCount = prefetched.sourceWindowItemCount ?? selection.entitySelector.sourceWindowItemCount}
					{#if sourceWindowItemCount !== undefined && sourceWindowItemCount !== null}
						<div>
							<dt>Source window items</dt>
							<dd>
								<NumberValue value={Number(sourceWindowItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowItemCount = entity.sourceWindowItemCount ?? selection.entitySelector.sourceWindowItemCount ?? prefetched.sourceWindowItemCount}
					{#if sourceWindowItemCount !== undefined && sourceWindowItemCount !== null}
						<div>
							<dt>Source window items</dt>
							<dd>
								<NumberValue value={Number(sourceWindowItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssFeedTimestamp}>
				{#snippet Pending()}
					{@const fetchWindowKind = prefetched.fetchWindowKind ?? selection.entitySelector.fetchWindowKind}
					{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
						<div>
							<dt>Fetch window</dt>
							<dd>
								{String((fetchWindowKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fetchWindowKind = entity.fetchWindowKind ?? selection.entitySelector.fetchWindowKind ?? prefetched.fetchWindowKind}
					{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
						<div>
							<dt>Fetch window</dt>
							<dd>
								{String((fetchWindowKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
