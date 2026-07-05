<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
	const titleFallback = $derived([String((prefetched.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel')
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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
			networkSlug: String(pendingEntity.$network.slug ?? ''),
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
				{[String((prefetched.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'}
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
					resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<LightningNodeView
								selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
								prefetched={lightningNode}
								href={
									(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
										networkSlug: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug ?? ''),
										pubkey: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey ?? ''),
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
					resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<LightningNodeView
								selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
								prefetched={lightningNode}
								href={
									(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
										networkSlug: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug ?? ''),
										pubkey: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey ?? ''),
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
							{@const channelId = selection.entitySelector.channelId ?? prefetched.channelId}
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
					{@const shortChannelId = prefetched.shortChannelId}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
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
										(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug !== undefined && ({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).$network.slug ?? ''),
											pubkey: String(({ ...lightningNode[EntityMetaKey.Selector], ...lightningNode }).publicKey ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
					{@const fundingTransactionId = prefetched.fundingTransactionId}
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
					{@const fundingOutputIndex = prefetched.fundingOutputIndex}
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
					{@const openedAtMs = prefetched.openedAtMs}
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
				selection={selection[EntityProxyField]<EntityType.LightningChannel_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No observations yet.'
				id='LightningChannel_TimestampsView-$$timestamps'
			/>

			<BlockheadLightningChannelStatesView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningChannelState>('$$localStates')}
				title='Local states'
				emptyText='No local channel states.'
				id='BlockheadLightningChannelStatesView-$$localStates'
			/>
		{/if}
	{/snippet}
</EntityView>
