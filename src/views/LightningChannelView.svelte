<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningChannel>>
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
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			shortChannelId: true,
			$node1: true,
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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.channelId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			channelId: String(pendingEntity.channelId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningChannel}>
			{#snippet Pending()}
				{[String((pendingEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningChannel}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$node1}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<LightningNodeView
								selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
								prefetched={lightningNode}
								href={
									(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
									(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
										network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
										pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
									}) : undefined)
								}
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
								fields: {
									channelId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const channelId = pendingEntity.channelId}
							{#if channelId !== undefined && channelId !== null}
								<TruncatedValue value={String((channelId) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							shortChannelId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shortChannelId = pendingEntity.shortChannelId}
					{#if shortChannelId !== undefined && shortChannelId !== null}
						<div>
							<dt>Short channel ID</dt>
							<dd>
								{String((shortChannelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(lightningNode)}
					{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
						<div>
							<dt>Peer node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
										(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
											network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
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
						fields: {
							fundingTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fundingTransactionId = pendingEntity.fundingTransactionId}
					{#if fundingTransactionId !== undefined && fundingTransactionId !== null}
						<div>
							<dt>Funding transaction ID</dt>
							<dd>
								{String((fundingTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							fundingOutputIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fundingOutputIndex = pendingEntity.fundingOutputIndex}
					{#if fundingOutputIndex !== undefined && fundingOutputIndex !== null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue value={Number(fundingOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundingOutputIndex = resolvedEntity.fundingOutputIndex}
					{#if fundingOutputIndex !== undefined && fundingOutputIndex !== null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue value={Number(fundingOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							openedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const openedAtMs = pendingEntity.openedAtMs}
					{#if openedAtMs !== undefined && openedAtMs !== null}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp timestamp={Number(openedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
