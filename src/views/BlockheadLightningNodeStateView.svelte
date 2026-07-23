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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLightningNodeState>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadLightningNodeState>
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
	const blockheadLightningNodeState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			alias: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			alias: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.alias) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state')
	const viewDomId = $derived('blockhead-lightning-node-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet children(entity)}
				<LightningNetworkView
					selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
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
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-lightning-node-channels'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lightning-node-channel-states',
						label: 'Channel states',
						ownsSection: true,
					},
					{
						id: 'lightning-node-channels',
						label: 'Channels',
						ownsSection: true,
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

			{#snippet MarkerLightningNodeChannelStates(_context, Content)}
				{@const lightningNodeChannelsLightningNodeChannelStatesResource = selection.$$channelStates}
				<ResourceBoundary
					resource={lightningNodeChannelsLightningNodeChannelStatesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningNodeChannelStates({ id, label, open, active })}
				{@const lightningNodeChannelsLightningNodeChannelStatesResource = selection.$$channelStates}
				<ResourceBoundary
					resource={lightningNodeChannelsLightningNodeChannelStatesResource}
				>
					{#snippet children(blockheadLightningChannelState)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BlockheadLightningChannelStatesView
								selection={lightningNodeChannelsLightningNodeChannelStatesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No local channel states.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerLightningNodeChannels(_context, Content)}
				{@const lightningNodeChannelsLightningNodeChannelsResource = selection.$$channels}
				<ResourceBoundary
					resource={lightningNodeChannelsLightningNodeChannelsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningNodeChannels({ id, label, open, active })}
				{@const lightningNodeChannelsLightningNodeChannelsResource = selection.$$channels}
				<ResourceBoundary
					resource={lightningNodeChannelsLightningNodeChannelsResource}
				>
					{#snippet children(lightningChannel)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<LightningChannelsView
								selection={lightningNodeChannelsLightningNodeChannelsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No public channel refs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
					},
					{
						id: 'lightning-node-payment-list',
						label: 'Payments',
						ownsSection: true,
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

			{#snippet MarkerLightningNodeInvoices(_context, Content)}
				{@const lightningNodePaymentsLightningNodeInvoicesResource = selection.$$invoices}
				<ResourceBoundary
					resource={lightningNodePaymentsLightningNodeInvoicesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningNodeInvoices({ id, label, open, active })}
				{@const lightningNodePaymentsLightningNodeInvoicesResource = selection.$$invoices}
				<ResourceBoundary
					resource={lightningNodePaymentsLightningNodeInvoicesResource}
				>
					{#snippet children(blockheadLightningInvoice)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BlockheadLightningInvoicesView
								selection={lightningNodePaymentsLightningNodeInvoicesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No invoices.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerLightningNodePaymentList(_context, Content)}
				{@const lightningNodePaymentsLightningNodePaymentListResource = selection.$$payments}
				<ResourceBoundary
					resource={lightningNodePaymentsLightningNodePaymentListResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningNodePaymentList({ id, label, open, active })}
				{@const lightningNodePaymentsLightningNodePaymentListResource = selection.$$payments}
				<ResourceBoundary
					resource={lightningNodePaymentsLightningNodePaymentListResource}
				>
					{#snippet children(blockheadLightningPayment)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BlockheadLightningPaymentsView
								selection={lightningNodePaymentsLightningNodePaymentListResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No payments.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
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

			{#snippet MarkerLightningNodeTimestamps(_context, Content)}
				{@const lightningNodeObservationsLightningNodeTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={lightningNodeObservationsLightningNodeTimestampsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLightningNodeTimestamps({ id, label, open, active })}
				{@const lightningNodeObservationsLightningNodeTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={lightningNodeObservationsLightningNodeTimestampsResource}
				>
					{#snippet children(blockheadLightningNodeStateTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BlockheadLightningNodeState_TimestampsView
								selection={lightningNodeObservationsLightningNodeTimestampsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No node-state observations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
