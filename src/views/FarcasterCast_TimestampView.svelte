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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCast_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterCast_Timestamp>>
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

	const farcasterCastTimestamp = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			likeCount: true,
			recastCount: true,
			replyCount: true,
		},
	}))
	const titleFallback = $derived('Farcaster cast observation')
	const viewDomId = $derived('farcaster-cast-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast_Timestamp}
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
			<FarcasterCastView
				selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
				href={
						resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
							fid: String(selection.entitySelector.$cast.fid),
							hash: String(selection.entitySelector.$cast.hash),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={farcasterCastTimestamp}>
				{#snippet Pending()}
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href={
							resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
								fid: String(selection.entitySelector.$cast.fid),
								hash: String(selection.entitySelector.$cast.hash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href={
							resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
								fid: String(selection.entitySelector.$cast.fid),
								hash: String(selection.entitySelector.$cast.hash),
							})
						}
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
			<ResourceBoundary resource={farcasterCastTimestamp}>
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
			<ResourceBoundary resource={farcasterCastTimestamp}>
				{#snippet Pending()}
					{@const likeCount = prefetched.likeCount ?? selection.entitySelector.likeCount}
					{#if likeCount !== undefined && likeCount !== null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue value={Number(likeCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const likeCount = entity.likeCount ?? selection.entitySelector.likeCount ?? prefetched.likeCount}
					{#if likeCount !== undefined && likeCount !== null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue value={Number(likeCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterCastTimestamp}>
				{#snippet Pending()}
					{@const recastCount = prefetched.recastCount ?? selection.entitySelector.recastCount}
					{#if recastCount !== undefined && recastCount !== null}
						<div>
							<dt>Recasts</dt>
							<dd>
								<NumberValue value={Number(recastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const recastCount = entity.recastCount ?? selection.entitySelector.recastCount ?? prefetched.recastCount}
					{#if recastCount !== undefined && recastCount !== null}
						<div>
							<dt>Recasts</dt>
							<dd>
								<NumberValue value={Number(recastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterCastTimestamp}>
				{#snippet Pending()}
					{@const replyCount = prefetched.replyCount ?? selection.entitySelector.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const replyCount = entity.replyCount ?? selection.entitySelector.replyCount ?? prefetched.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
