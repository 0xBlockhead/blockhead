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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LightningChannel>>
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
	const lightningChannel = $derived(selection({
		sources: selection.sources,
		fields: {
			shortChannelId: true,
			fundingTransactionId: true,
			fundingOutputIndex: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel')
	const viewDomId = $derived('lightning-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.channelId !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
			channelId: String(pendingEntity.channelId ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.channelId !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
			channelId: String(pendingEntity.channelId ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={lightningChannel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$node1}
					>
						{#snippet children(lightningNode)}
							{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
									(lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										network: String(caip2StringFromValue(lightningNode[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={lightningChannel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$node1}
					>
						{#snippet children(lightningNode)}
							{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
									(lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										network: String(caip2StringFromValue(lightningNode[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
										(lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
											network: String(caip2StringFromValue(lightningNode[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : lightningNode[EntityMetaKey.Selector].publicKey !== undefined && lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
											network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
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
		{#if detailsOpen}
			<LightningChannel_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No observations yet.'
				id='LightningChannel_TimestampsView-timestamps'
			/>

			<BlockheadLightningChannelStatesView
				selection={
						selection.$$localStates({
							count: true,
						})
					}
				title='Local states'
				emptyText='No local channel states.'
				id='BlockheadLightningChannelStatesView-local-states'
			/>
		{/if}
	{/snippet}
</EntityView>
