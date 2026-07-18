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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLightningNodeState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadLightningNodeState>>
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
	const blockheadLightningNodeState = $derived(selection({
		sources: selection.sources,
		fields: {
			alias: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.alias) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state')
	const viewDomId = $derived('blockhead-lightning-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import BlockheadLightningChannelStatesView from '$/views/BlockheadLightningChannelStatesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
	import BlockheadLightningNodeState_TimestampsView from '$/views/BlockheadLightningNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningNodeState}
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
			{[String((pendingEntity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadLightningNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={blockheadLightningNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$node}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
						<span data-text="muted">
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
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={blockheadLightningNodeState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$node}
					>
						{#snippet children(lightningNode)}
							{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
								<span data-text="muted">
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
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
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
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							lndPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lndPubkey = resolvedEntity.lndPubkey}
					{#if lndPubkey !== undefined && lndPubkey !== null}
						<div>
							<dt>lnd public key</dt>
							<dd>
								{String((lndPubkey) ?? '')}
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
							alias: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const alias = resolvedEntity.alias}
					{#if alias !== undefined && alias !== null}
						<div>
							<dt>alias</dt>
							<dd>
								{String((alias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$node}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
						<div>
							<dt>node</dt>
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-lightning-node-channels'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lightning-node-channel-states',
							label: 'Channel states',
						},
						{
							id: 'lightning-node-channels',
							label: 'Channels',
						},
					]
				}
				data-card
				class='network-view-collapsible-channels'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Channels</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLightningNodeChannelStates({ id, label, open })}
					<BlockheadLightningChannelStatesView
						selection={selection.$$channelStates}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No local channel states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionLightningNodeChannels({ id, label, open })}
					<LightningChannelsView
						selection={selection.$$channels}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No public channel refs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lightning-node-payments'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lightning-node-invoices',
							label: 'Invoices',
						},
						{
							id: 'lightning-node-payment-list',
							label: 'Payments',
						},
					]
				}
				data-card
				class='network-view-collapsible-payments'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Payments</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLightningNodeInvoices({ id, label, open })}
					<BlockheadLightningInvoicesView
						selection={selection.$$invoices}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No invoices.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionLightningNodePaymentList({ id, label, open })}
					<BlockheadLightningPaymentsView
						selection={selection.$$payments}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No payments.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lightning-node-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lightning-node-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLightningNodeTimestamps({ id, label, open })}
					<BlockheadLightningNodeState_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No node-state observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
