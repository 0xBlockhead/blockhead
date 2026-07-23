<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.RedditLink_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.RedditLink_Timestamp>
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
	const redditLinkTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			score: true,
			commentCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			score: true,
			commentCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit submission timestamp')
	const viewDomId = $derived('reddit-link-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$link' in selection.entitySelector
			&& selection.entitySelector.$link != null && 'fullname' in selection.entitySelector.$link
			&& selection.entitySelector.$link.fullname != null ?
				resolve('/reddit/link/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			source: String(selection.entitySelector.source ?? ''),
			fullname: encodeURIComponent(String(selection.entitySelector.$link.fullname ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'score') && Object.hasOwn(prefetched, 'commentCount')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={redditLinkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'score') && Object.hasOwn(prefetched, 'commentCount')}
			{@const score0 = pendingEntity.score}
			{#if score0 !== undefined && score0 !== null}
				<NumberValue
					value={score0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={redditLinkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const score0 = resolvedEntity.score}
					{#if score0 !== undefined && score0 !== null}
						<NumberValue
							value={score0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'score') && Object.hasOwn(prefetched, 'commentCount')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const commentCount1 = pendingEntity.commentCount}
			{#if commentCount1 !== undefined && commentCount1 !== null}
				<span data-text="muted">
					<NumberValue
						value={commentCount1}
					/>

					<span> comments</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditLinkTimestamp}>
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
							<NumberValue
								value={commentCount1}
							/>

							<span> comments</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							score: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const score = resolvedEntity.score}
					{#if score !== undefined && score !== null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue
									value={score}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							commentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commentCount = resolvedEntity.commentCount}
					{#if commentCount !== undefined && commentCount !== null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue
									value={commentCount}
								/>
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
						selection={select(EntityType.RedditLink, selection.entitySelector.$link)}
						href={
							(
								selection.entitySelector.$link != null && 'fullname' in selection.entitySelector.$link
								&& selection.entitySelector.$link.fullname != null ?
									resolve('/reddit/link/[fullname=stringSegment]', {
								fullname: encodeURIComponent(String(selection.entitySelector.$link.fullname ?? '')),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
