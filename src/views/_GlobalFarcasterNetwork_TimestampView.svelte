<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalFarcasterNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalFarcasterNetwork_Timestamp>>
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
	const globalFarcasterNetworkTimestamp = $derived(selection({
		sources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	}))
	const titleFallback = $derived('global Farcaster network timestamp')
	const viewDomId = $derived('-global-farcaster-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalFarcasterNetworkView from '$/views/_GlobalFarcasterNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalFarcasterNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalFarcasterNetworkTimestamp}>
			{#snippet Pending()}
				<GlobalFarcasterNetworkView
					selection={select(EntityType._GlobalFarcasterNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalFarcasterNetworkView
					selection={select(EntityType._GlobalFarcasterNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalFarcasterNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
				<dt>hub</dt>
				<dd>
					<GlobalFarcasterNetworkView
						selection={select(EntityType._GlobalFarcasterNetwork, selection.entitySelector.$hub)}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							feedVariant: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feedVariant = prefetched.feedVariant}
					{#if feedVariant !== undefined && feedVariant !== null}
						<div>
							<dt>feed variant</dt>
							<dd>
								{String((feedVariant) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feedVariant = resolvedEntity.feedVariant}
					{#if feedVariant !== undefined && feedVariant !== null}
						<div>
							<dt>feed variant</dt>
							<dd>
								{String((feedVariant) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fid = prefetched.fid}
					{#if fid !== undefined && fid !== null}
						<div>
							<dt>FID</dt>
							<dd>
								<NumberValue value={Number(fid)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fid = resolvedEntity.fid}
					{#if fid !== undefined && fid !== null}
						<div>
							<dt>FID</dt>
							<dd>
								<NumberValue value={Number(fid)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							channelId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const channelId = prefetched.channelId}
					{#if channelId !== undefined && channelId !== null}
						<div>
							<dt>channel ID</dt>
							<dd>
								{String((channelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelId = resolvedEntity.channelId}
					{#if channelId !== undefined && channelId !== null}
						<div>
							<dt>channel ID</dt>
							<dd>
								{String((channelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							viewerFid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewerFid = prefetched.viewerFid}
					{#if viewerFid !== undefined && viewerFid !== null}
						<div>
							<dt>viewer FID</dt>
							<dd>
								<NumberValue value={Number(viewerFid)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewerFid = resolvedEntity.viewerFid}
					{#if viewerFid !== undefined && viewerFid !== null}
						<div>
							<dt>viewer FID</dt>
							<dd>
								<NumberValue value={Number(viewerFid)} />
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
							sourceWindowCastCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowCastCount = prefetched.sourceWindowCastCount}
					{#if sourceWindowCastCount !== undefined && sourceWindowCastCount !== null}
						<div>
							<dt>source window cast count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowCastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowCastCount = resolvedEntity.sourceWindowCastCount}
					{#if sourceWindowCastCount !== undefined && sourceWindowCastCount !== null}
						<div>
							<dt>source window cast count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowCastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowUserCount = prefetched.sourceWindowUserCount}
					{#if sourceWindowUserCount !== undefined && sourceWindowUserCount !== null}
						<div>
							<dt>source window user count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowUserCount = resolvedEntity.sourceWindowUserCount}
					{#if sourceWindowUserCount !== undefined && sourceWindowUserCount !== null}
						<div>
							<dt>source window user count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowChannelCount = prefetched.sourceWindowChannelCount}
					{#if sourceWindowChannelCount !== undefined && sourceWindowChannelCount !== null}
						<div>
							<dt>source window channel count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowChannelCount = resolvedEntity.sourceWindowChannelCount}
					{#if sourceWindowChannelCount !== undefined && sourceWindowChannelCount !== null}
						<div>
							<dt>source window channel count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowChannelCount)} />
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
							localCatalogFeedVariantCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogFeedVariantCount = prefetched.localCatalogFeedVariantCount}
					{#if localCatalogFeedVariantCount !== undefined && localCatalogFeedVariantCount !== null}
						<div>
							<dt>local catalog feed variant count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedVariantCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogFeedVariantCount = resolvedEntity.localCatalogFeedVariantCount}
					{#if localCatalogFeedVariantCount !== undefined && localCatalogFeedVariantCount !== null}
						<div>
							<dt>local catalog feed variant count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedVariantCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogChannelCount = prefetched.localCatalogChannelCount}
					{#if localCatalogChannelCount !== undefined && localCatalogChannelCount !== null}
						<div>
							<dt>local catalog channel count</dt>
							<dd>
								<NumberValue value={Number(localCatalogChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogChannelCount = resolvedEntity.localCatalogChannelCount}
					{#if localCatalogChannelCount !== undefined && localCatalogChannelCount !== null}
						<div>
							<dt>local catalog channel count</dt>
							<dd>
								<NumberValue value={Number(localCatalogChannelCount)} />
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
							hubHost: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hubHost = prefetched.hubHost}
					{#if hubHost !== undefined && hubHost !== null}
						<div>
							<dt>hub host</dt>
							<dd>
								{String((hubHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hubHost = resolvedEntity.hubHost}
					{#if hubHost !== undefined && hubHost !== null}
						<div>
							<dt>hub host</dt>
							<dd>
								{String((hubHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							snapchainHost: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const snapchainHost = prefetched.snapchainHost}
					{#if snapchainHost !== undefined && snapchainHost !== null}
						<div>
							<dt>snapchain host</dt>
							<dd>
								{String((snapchainHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const snapchainHost = resolvedEntity.snapchainHost}
					{#if snapchainHost !== undefined && snapchainHost !== null}
						<div>
							<dt>snapchain host</dt>
							<dd>
								{String((snapchainHost) ?? '')}
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cursor: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cursor = prefetched.cursor}
					{#if cursor !== undefined && cursor !== null}
						<div>
							<dt>cursor</dt>
							<dd>
								<TruncatedValue value={String((cursor) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cursor = resolvedEntity.cursor}
					{#if cursor !== undefined && cursor !== null}
						<div>
							<dt>cursor</dt>
							<dd>
								<TruncatedValue value={String((cursor) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
