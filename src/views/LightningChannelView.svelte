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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.LightningChannel>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LightningChannel>
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
	const lightningChannel = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			shortChannelId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			shortChannelId: true,
			fundingTransactionId: true,
			fundingOutputIndex: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel')
	const viewDomId = $derived('lightning-channel-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LightningChannel_TimestampsView from '$/views/LightningChannel_TimestampsView.svelte'
	import BlockheadLightningChannelStatesView from '$/views/BlockheadLightningChannelStatesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'channelId' in selection.entitySelector
			&& selection.entitySelector.channelId != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
				channelId: String(selection.entitySelector.channelId ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
					channelId: String(selection.entitySelector.channelId ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningChannel}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningChannel}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$node1}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<LightningNodeView
								selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
								prefetched={lightningNode}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Channel ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									channelId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const channelId = resolvedEntity.channelId}
							{#if channelId !== undefined && channelId !== null}
								<TruncatedValue value={String((channelId) ?? '')} />
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
							shortChannelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shortChannelId = resolvedEntity.shortChannelId}
					{#if shortChannelId !== undefined && shortChannelId !== null}
						<div>
							<dt>Short channel ID</dt>
							<dd>
								{String((shortChannelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
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
			<ResourceBoundary
				resource={selection.$node1}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
						<div>
							<dt>Peer node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
										(
											lightningNode[EntityMetaKey.Selector] != null && 'publicKey' in lightningNode[EntityMetaKey.Selector]
											&& lightningNode[EntityMetaKey.Selector].publicKey != null
											&& lightningNode[EntityMetaKey.Selector] != null && '$network' in lightningNode[EntityMetaKey.Selector] ?
												lightningNode[EntityMetaKey.Selector].$network != null && 'caip2' in lightningNode[EntityMetaKey.Selector].$network
												&& lightningNode[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
												pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
												network: String(caip2StringFromValue(lightningNode[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													lightningNode[EntityMetaKey.Selector].$network != null && 'slug' in lightningNode[EntityMetaKey.Selector].$network
													&& lightningNode[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
													pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
													network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
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
							fundingTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundingTransactionId = resolvedEntity.fundingTransactionId}
					{#if fundingTransactionId !== undefined && fundingTransactionId !== null}
						<div>
							<dt>Funding transaction ID</dt>
							<dd>
								{String((fundingTransactionId) ?? '')}
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
							fundingOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundingOutputIndex = resolvedEntity.fundingOutputIndex}
					{#if fundingOutputIndex !== undefined && fundingOutputIndex !== null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue
									value={fundingOutputIndex}
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
							openedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const openedAtMs = resolvedEntity.openedAtMs}
					{#if openedAtMs !== undefined && openedAtMs !== null}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp timestamp={Number(openedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const lightningChannelLightningChannelTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={lightningChannelLightningChannelTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<LightningChannel_TimestampsView
					selection={lightningChannelLightningChannelTimestampsViewTimestampsResource}
					countResource={lightningChannelLightningChannelTimestampsViewTimestampsResource.count}
					title='Observations'
					id='LightningChannel_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const lightningChannelBlockheadLightningChannelStatesViewLocalStatesResource = selection.$$localStates}
		<ResourceBoundary
			resource={lightningChannelBlockheadLightningChannelStatesViewLocalStatesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadLightningChannelStatesView
					selection={lightningChannelBlockheadLightningChannelStatesViewLocalStatesResource}
					countResource={lightningChannelBlockheadLightningChannelStatesViewLocalStatesResource.count}
					title='Local states'
					id='BlockheadLightningChannelStatesView-local-states'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
