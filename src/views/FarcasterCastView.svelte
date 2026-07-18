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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.FarcasterCast>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FarcasterCast>>
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
	const farcasterCast = $derived(selection({
		sources: selection.sources,
		fields: {
			text: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.text) ?? ''), String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast')
	const viewDomId = $derived('farcaster-cast-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterCastEmbedsView from '$/views/FarcasterCastEmbedsView.svelte'
	import FarcasterCast_TimestampsView from '$/views/FarcasterCast_TimestampsView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.fid !== undefined && pendingEntity.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
			fid: String(pendingEntity.fid ?? ''),
			hash: String(pendingEntity.hash ?? ''),
		}) : pendingEntity.username !== undefined && pendingEntity.hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
			fname: String(pendingEntity.username ?? ''),
			hash: String(pendingEntity.hashPrefix ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.text) ?? ''), String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.text) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.fid) ?? ''), String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.text) ?? ''), String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.fid) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.text) ?? ''), String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const timestamp0 = pendingEntity.timestamp}
			{#if timestamp0 !== undefined && timestamp0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestamp0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterCast}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp0 = resolvedEntity.timestamp}
					{#if timestamp0 !== undefined && timestamp0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestamp0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
									prefetched={farcasterUser}
									href={
										(farcasterUser[EntityMetaKey.Selector].fid !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]', {
											userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
							timestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp = resolvedEntity.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$channel}
			>
				{#snippet children(farcasterChannel)}
					{#if farcasterChannel != null && farcasterChannel[EntityMetaKey.Selector] != null}
						<div>
							<dt>Channel</dt>
							<dd>
								<FarcasterChannelView
									selection={select(EntityType.FarcasterChannel, farcasterChannel[EntityMetaKey.Selector])}
									prefetched={farcasterChannel}
									href={
										(farcasterChannel[EntityMetaKey.Selector].id !== undefined ? resolve('/farcaster/channel/[channelId=stringSegment]', {
											channelId: String(farcasterChannel[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$parentCast}
			>
				{#snippet children(farcasterCast)}
					{#if farcasterCast != null && farcasterCast[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent cast</dt>
							<dd>
								<FarcasterCastView
									selection={select(EntityType.FarcasterCast, farcasterCast[EntityMetaKey.Selector])}
									prefetched={farcasterCast}
									href={
										(farcasterCast[EntityMetaKey.Selector].fid !== undefined && farcasterCast[EntityMetaKey.Selector].hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
											fid: String(farcasterCast[EntityMetaKey.Selector].fid ?? ''),
											hash: String(farcasterCast[EntityMetaKey.Selector].hash ?? ''),
										}) : farcasterCast[EntityMetaKey.Selector].username !== undefined && farcasterCast[EntityMetaKey.Selector].hashPrefix !== undefined ? resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
											fname: String(farcasterCast[EntityMetaKey.Selector].username ?? ''),
											hash: String(farcasterCast[EntityMetaKey.Selector].hashPrefix ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
							parentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentUrl = resolvedEntity.parentUrl}
					{#if parentUrl !== undefined && parentUrl !== null}
						<div>
							<dt>Parent URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(parentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(parentUrl)} />
								</svelte:element>
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
							rootParentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rootParentUrl = resolvedEntity.rootParentUrl}
					{#if rootParentUrl !== undefined && rootParentUrl !== null}
						<div>
							<dt>Root parent URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(rootParentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(rootParentUrl)} />
								</svelte:element>
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
							threadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threadHash = resolvedEntity.threadHash}
					{#if threadHash !== undefined && threadHash !== null}
						<div>
							<dt>Thread hash</dt>
							<dd>
								<TruncatedValue value={String((threadHash) ?? '')} />
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
							clientUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientUrl = resolvedEntity.clientUrl}
					{#if clientUrl !== undefined && clientUrl !== null}
						<div>
							<dt>Client URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(clientUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(clientUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text = resolvedEntity.text}
				{#if text !== undefined && text !== null && text !== ''}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<FarcasterCastEmbedsView
				selection={
						selection.$$embeds({
							count: true,
						})
					}
				title='Embeds'
				emptyText='No Farcaster cast embeds.'
				id='FarcasterCastEmbedsView-embeds'
			/>

			<FarcasterCast_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No Farcaster cast observations yet.'
				id='FarcasterCast_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
