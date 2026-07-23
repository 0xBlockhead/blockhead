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
			selection: RegisteredEntityProxyResource<EntityType.FarcasterCast_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FarcasterCast_Timestamp>
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
	const farcasterCastTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'Farcaster cast observation'
	const viewDomId = $derived('farcaster-cast-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && '$cast' in selection.entitySelector
			&& selection.entitySelector.$cast != null && 'fid' in selection.entitySelector.$cast
			&& selection.entitySelector.$cast.fid != null
			&& selection.entitySelector.$cast != null && 'hash' in selection.entitySelector.$cast
			&& selection.entitySelector.$cast.hash != null ?
				resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			fid: String(selection.entitySelector.$cast.fid ?? ''),
			hash: String(selection.entitySelector.$cast.hash ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$cast') && prefetched.$cast != null && Object.hasOwn(prefetched.$cast, 'text') && Object.hasOwn(prefetched.$cast, 'hash') && Object.hasOwn(prefetched.$cast, 'fid') && Object.hasOwn(prefetched.$cast, 'timestamp')}
			{@const farcasterCast0 = pendingEntity.$cast}
			{#if farcasterCast0 != null && selection.entitySelector.$cast != null}
				<FarcasterCastView
					selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast, { sources: selection.sources })}
					prefetched={farcasterCast0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterCastTimestamp}>
				{#snippet children(entity)}
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$cast') && prefetched.$cast != null && Object.hasOwn(prefetched.$cast, 'text') && Object.hasOwn(prefetched.$cast, 'hash') && Object.hasOwn(prefetched.$cast, 'fid') && Object.hasOwn(prefetched.$cast, 'timestamp')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterCastTimestamp}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Cast</dt>
				<dd>
					<FarcasterCastView
						selection={select(EntityType.FarcasterCast, selection.entitySelector.$cast)}
						href={
							(
								selection.entitySelector.$cast != null && 'fid' in selection.entitySelector.$cast
								&& selection.entitySelector.$cast.fid != null
								&& selection.entitySelector.$cast != null && 'hash' in selection.entitySelector.$cast
								&& selection.entitySelector.$cast.hash != null ?
									resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
								fid: String(selection.entitySelector.$cast.fid ?? ''),
								hash: String(selection.entitySelector.$cast.hash ?? ''),
							})
							:
									selection.entitySelector.$cast != null && 'username' in selection.entitySelector.$cast
									&& selection.entitySelector.$cast.username != null
									&& selection.entitySelector.$cast != null && 'hashPrefix' in selection.entitySelector.$cast
									&& selection.entitySelector.$cast.hashPrefix != null ?
										resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
									fname: String(selection.entitySelector.$cast.username ?? ''),
									hash: String(selection.entitySelector.$cast.hashPrefix ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							likeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const likeCount = resolvedEntity.likeCount}
					{#if likeCount !== undefined && likeCount !== null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue
									value={likeCount}
								/>
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
						sources: selection.sources,
						fields: {
							recastCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recastCount = resolvedEntity.recastCount}
					{#if recastCount !== undefined && recastCount !== null}
						<div>
							<dt>Recasts</dt>
							<dd>
								<NumberValue
									value={recastCount}
								/>
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
						sources: selection.sources,
						fields: {
							replyCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replyCount = resolvedEntity.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue
									value={replyCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
