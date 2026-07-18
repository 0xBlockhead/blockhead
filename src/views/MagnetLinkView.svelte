<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.MagnetLink>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.MagnetLink>>
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
	const magnetLink = $derived(selection({
		sources: selection.sources,
		fields: {
			displayName: true,
			infoHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.magnetUri) ?? '')].filter(Boolean).join(' ') || 'magnet link')
	const viewDomId = $derived('magnet-link-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MagnetResolution_TimestampsView from '$/views/MagnetResolution_TimestampsView.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.MagnetLink}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.displayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={magnetLink}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.displayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const infoHash0 = pendingEntity.infoHash}
					{#if infoHash0 !== undefined && infoHash0 !== null}
						<TruncatedValue value={String((infoHash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={magnetLink}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const infoHash0 = resolvedEntity.infoHash}
					{#if infoHash0 !== undefined && infoHash0 !== null}
						<TruncatedValue value={String((infoHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>magnet URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									magnetUri: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const magnetUri = resolvedEntity.magnetUri}
							{#if magnetUri !== undefined && magnetUri !== null}
								<TruncatedValue value={String((magnetUri) ?? '')} />
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
							infoHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const infoHash = resolvedEntity.infoHash}
					{#if infoHash !== undefined && infoHash !== null}
						<div>
							<dt>info hash</dt>
							<dd>
								<TruncatedValue value={String((infoHash) ?? '')} />
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
							displayName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const displayName = resolvedEntity.displayName}
					{#if displayName !== undefined && displayName !== null}
						<div>
							<dt>display name</dt>
							<dd>
								{String((displayName) ?? '')}
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
							exactLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const exactLength = resolvedEntity.exactLength}
					{#if exactLength !== undefined && exactLength !== null}
						<div>
							<dt>exact length</dt>
							<dd>
								<NumberValue
									value={exactLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>trackers</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									trackers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const trackers = resolvedEntity.trackers}
							{#if trackers !== undefined && trackers !== null}
								{trackers.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Web seeds</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									webSeeds: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const webSeeds = resolvedEntity.webSeeds}
							{#if webSeeds !== undefined && webSeeds !== null}
								{webSeeds.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>acceptable sources</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									acceptableSources: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const acceptableSources = resolvedEntity.acceptableSources}
							{#if acceptableSources !== undefined && acceptableSources !== null}
								{acceptableSources.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$torrent}
			>
				{#snippet children(bitTorrentMetainfo)}
					{#if bitTorrentMetainfo != null && bitTorrentMetainfo[EntityMetaKey.Selector] != null}
						<div>
							<dt>torrent</dt>
							<dd>
								<BitTorrentMetainfoView
									selection={select(EntityType.BitTorrentMetainfo, bitTorrentMetainfo[EntityMetaKey.Selector])}
									prefetched={bitTorrentMetainfo}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MagnetResolution_TimestampsView
				selection={
						selection.$$resolutionTimestamps({
							count: true,
						})
					}
				title='resolution timestamps'
				emptyText='No resolution observations yet.'
				id='MagnetResolution_TimestampsView-resolution-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
