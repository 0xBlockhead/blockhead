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
				<dt>hub</dt>
				<dd>
					<GlobalFarcasterNetworkView
						selection={select(EntityType._GlobalFarcasterNetwork, selection.entitySelector.$hub, {})}
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
					{@const feedVariant = pendingEntity.feedVariant}
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
					{@const fid = pendingEntity.fid}
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
					{@const channelId = pendingEntity.channelId}
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
					{@const viewerFid = pendingEntity.viewerFid}
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
							observedCastCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedCastCount = pendingEntity.observedCastCount}
					{#if observedCastCount !== undefined && observedCastCount !== null}
						<div>
							<dt>observed cast count</dt>
							<dd>
								<NumberValue value={Number(observedCastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedCastCount = resolvedEntity.observedCastCount}
					{#if observedCastCount !== undefined && observedCastCount !== null}
						<div>
							<dt>observed cast count</dt>
							<dd>
								<NumberValue value={Number(observedCastCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedUserCount = pendingEntity.observedUserCount}
					{#if observedUserCount !== undefined && observedUserCount !== null}
						<div>
							<dt>observed user count</dt>
							<dd>
								<NumberValue value={Number(observedUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedUserCount = resolvedEntity.observedUserCount}
					{#if observedUserCount !== undefined && observedUserCount !== null}
						<div>
							<dt>observed user count</dt>
							<dd>
								<NumberValue value={Number(observedUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedChannelCount = pendingEntity.observedChannelCount}
					{#if observedChannelCount !== undefined && observedChannelCount !== null}
						<div>
							<dt>observed channel count</dt>
							<dd>
								<NumberValue value={Number(observedChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedChannelCount = resolvedEntity.observedChannelCount}
					{#if observedChannelCount !== undefined && observedChannelCount !== null}
						<div>
							<dt>observed channel count</dt>
							<dd>
								<NumberValue value={Number(observedChannelCount)} />
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
							seededFeedVariantCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededFeedVariantCount = pendingEntity.seededFeedVariantCount}
					{#if seededFeedVariantCount !== undefined && seededFeedVariantCount !== null}
						<div>
							<dt>seeded feed variant count</dt>
							<dd>
								<NumberValue value={Number(seededFeedVariantCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededFeedVariantCount = resolvedEntity.seededFeedVariantCount}
					{#if seededFeedVariantCount !== undefined && seededFeedVariantCount !== null}
						<div>
							<dt>seeded feed variant count</dt>
							<dd>
								<NumberValue value={Number(seededFeedVariantCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededChannelCount = pendingEntity.seededChannelCount}
					{#if seededChannelCount !== undefined && seededChannelCount !== null}
						<div>
							<dt>seeded channel count</dt>
							<dd>
								<NumberValue value={Number(seededChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededChannelCount = resolvedEntity.seededChannelCount}
					{#if seededChannelCount !== undefined && seededChannelCount !== null}
						<div>
							<dt>seeded channel count</dt>
							<dd>
								<NumberValue value={Number(seededChannelCount)} />
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
					{@const hubHost = pendingEntity.hubHost}
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
					{@const snapchainHost = pendingEntity.snapchainHost}
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
					{@const reachable = pendingEntity.reachable}
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
					{@const cursor = pendingEntity.cursor}
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
