<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
	}: EntitySelectionViewProps<EntityType.MagnetLink> = $props()

	const magnetLink = $derived(selection({
		fields: {
			displayName: true,
			infoHash: true,
		},
	}))
	const titleFallback = $derived((prefetched.displayName ?? '') || selection.entitySelector.magnetUri || 'magnet link')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MagnetResolution_TimestampsView from '$/views/MagnetResolution_TimestampsView.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.MagnetLink}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/magnet/[magnetUri=stringSegment]',
				{
					magnetUri: selection.entitySelector.magnetUri,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={magnetLink}>
			{#snippet children(entity)}
				{(entity.displayName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={magnetLink}>
			{#snippet children(entity)}
				{@const infoHash = entity.infoHash}
				{#if infoHash != null}
					<TruncatedValue value={infoHash} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>magnet URI</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.magnetUri} />
				</dd>
			</div>

			<ResourceBoundary
				resource={magnetLink}
			>
				{#snippet children(entity)}
					{@const infoHash = entity.infoHash}
					{#if infoHash != null}
						<div>
							<dt>info hash</dt>
							<dd>
								<TruncatedValue value={infoHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={magnetLink}
			>
				{#snippet children(entity)}
					{@const displayName = entity.displayName}
					{#if displayName != null}
						<div>
							<dt>display name</dt>
							<dd>
								{displayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exactLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exactLength = entity.exactLength}
					{#if exactLength != null}
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
								fields: {
									trackers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.trackers.values.join(', ')}
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
								fields: {
									webSeeds: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.webSeeds.values.join(', ')}
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
								fields: {
									acceptableSources: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.acceptableSources.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$torrent}
			>
				{#snippet children(bitTorrentMetainfo)}
					{#if bitTorrentMetainfo != null}
						{@const bitTorrentMetainfoInitial = untrack(() => bitTorrentMetainfo)}
						<div>
							<dt>torrent</dt>
							<dd>
								<BitTorrentMetainfoView
									selection={select(EntityType.BitTorrentMetainfo, (bitTorrentMetainfo ?? bitTorrentMetainfoInitial)[EntityMetaKey.Selector])}
									prefetched={bitTorrentMetainfo ?? bitTorrentMetainfoInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const resolutionTimestampsResource = selection.$$resolutionTimestamps}
		<ResourceBoundary
			resource={resolutionTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MagnetResolution_TimestampsView
						selection={resolutionTimestampsResource}
						countResource={resolutionTimestampsResource.count}
						title='resolution timestamps'
						id='resolution-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
