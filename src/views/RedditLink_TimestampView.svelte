<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditLink_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RedditLink_Timestamp>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const redditLinkTimestamp = $derived(selection({
		fields: {
			score: true,
			commentCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit submission timestamp')
	const viewDomId = $derived('reddit-link-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$link !== undefined && pendingEntity.$link.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			fullname: String(pendingEntity.$link.fullname ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={redditLinkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={redditLinkTimestamp}>
			{#snippet Pending()}
				{@const score0 = pendingEntity.score}
				{#if score0 !== undefined && score0 !== null}
					<NumberValue value={Number(score0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const score0 = resolvedEntity.score}
				{#if score0 !== undefined && score0 !== null}
					<NumberValue value={Number(score0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditLinkTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const commentCount1 = pendingEntity.commentCount}
				{#if commentCount1 !== undefined && commentCount1 !== null}
					<span data-text="muted">
						<NumberValue value={Number(commentCount1)} />

						<span> comments</span>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const commentCount1 = resolvedEntity.commentCount}
				{#if commentCount1 !== undefined && commentCount1 !== null}
					<span data-text="muted">
						<NumberValue value={Number(commentCount1)} />

						<span> comments</span>
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							score: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const score = pendingEntity.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue value={Number(score)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const score = resolvedEntity.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue value={Number(score)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commentCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commentCount = pendingEntity.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue value={Number(commentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commentCount = resolvedEntity.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue value={Number(commentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Submission</dt>
				<dd>
					<RedditLinkView
						selection={select(EntityType.RedditLink, selection.entitySelector.$link, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
