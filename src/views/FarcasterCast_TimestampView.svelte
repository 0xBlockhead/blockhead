<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.FarcasterCast_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FarcasterCast_Timestamp>>
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
	const farcasterCastTimestamp = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
	}))
	const titleFallback = $derived('Farcaster cast observation')
	const viewDomId = $derived('farcaster-cast-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.$cast !== undefined && pendingEntity.$cast.fid !== undefined && pendingEntity.$cast.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			fid: String(pendingEntity.$cast.fid ?? ''),
			hash: String(pendingEntity.$cast.hash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterCastTimestamp}>
			{#snippet Pending()}
				<FarcasterCastView
					selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
					href={
						(selection.entitySelector.$cast.fid !== undefined && selection.entitySelector.$cast.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
							fid: String(selection.entitySelector.$cast.fid ?? ''),
							hash: String(selection.entitySelector.$cast.hash ?? ''),
						}) : selection.entitySelector.$cast.username !== undefined && selection.entitySelector.$cast.hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
							fname: String(selection.entitySelector.$cast.username ?? ''),
							hash: String(selection.entitySelector.$cast.hashPrefix ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<FarcasterCastView
					selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
					href={
						(selection.entitySelector.$cast.fid !== undefined && selection.entitySelector.$cast.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
							fid: String(selection.entitySelector.$cast.fid ?? ''),
							hash: String(selection.entitySelector.$cast.hash ?? ''),
						}) : selection.entitySelector.$cast.username !== undefined && selection.entitySelector.$cast.hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
							fname: String(selection.entitySelector.$cast.username ?? ''),
							hash: String(selection.entitySelector.$cast.hashPrefix ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterCastTimestamp}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Cast</dt>
				<dd>
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast, {})}
						href={
							(selection.entitySelector.$cast.fid !== undefined && selection.entitySelector.$cast.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
								fid: String(selection.entitySelector.$cast.fid ?? ''),
								hash: String(selection.entitySelector.$cast.hash ?? ''),
							}) : selection.entitySelector.$cast.username !== undefined && selection.entitySelector.$cast.hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
								fname: String(selection.entitySelector.$cast.username ?? ''),
								hash: String(selection.entitySelector.$cast.hashPrefix ?? ''),
							}) : undefined)
						}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							likeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const likeCount = pendingEntity.likeCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const likeCount = resolvedEntity.likeCount}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							recastCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recastCount = pendingEntity.recastCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recastCount = resolvedEntity.recastCount}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const replyCount = pendingEntity.replyCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replyCount = resolvedEntity.replyCount}
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
