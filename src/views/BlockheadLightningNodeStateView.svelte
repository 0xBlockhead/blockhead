<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningNodeState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningNodeState = $derived(viewSelection({
		fields: {
			alias: true,
		},
	}))
	const titleFallback = $derived((prefetched.alias ?? '') || selection.entitySelector.connectionId || 'local LND node state')
	const viewDomId = $derived('blockhead-lightning-node-state-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					connectionId: selection.entitySelector.connectionId,
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
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet children(entity)}
				{(entity.alias ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<LightningNetworkView
			selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$node}
		>
			{#snippet children(lightningNode)}
				{#if lightningNode != null}
					{@const lightningNodeInitial = untrack(() => lightningNode)}
					<span data-text="muted">
						<LightningNodeView
							selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>local LND connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>Lightning network graph</dt>
				<dd>
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lndPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lndPubkey = entity.lndPubkey}
					{#if lndPubkey != null}
						<div>
							<dt>lnd public key</dt>
							<dd>
								{lndPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadLightningNodeState}
			>
				{#snippet children(entity)}
					{@const alias = entity.alias}
					{#if alias != null}
						<div>
							<dt>alias</dt>
							<dd>
								{alias}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$node}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null}
						{@const lightningNodeInitial = untrack(() => lightningNode)}
						<div>
							<dt>node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-lightning-node-channels'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lightning-node-channel-states',
						label: 'Local directional balances',
					},
					{
						id: 'lightning-node-channels',
						label: 'Public graph channel refs',
					},
				]
			}
			data-card
			class='network-view-collapsible-channels'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Local LND channels</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningNodeChannelStates({ id, label })}
				<BlockheadLightningChannelStatesView
					selection={selection.$$channelStates}
					collapsible={false}
					title={label}
					emptyText='No local LND channel states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLightningNodeChannels({ id, label })}
				<LightningChannelsView
					selection={selection.$$channels}
					collapsible={false}
					title={label}
					emptyText='No public graph channel refs.'
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
						label: 'Local LND invoices',
					},
					{
						id: 'lightning-node-payment-list',
						label: 'Local LND payments',
					},
				]
			}
			data-card
			class='network-view-collapsible-payments'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Local LND payment history</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningNodeInvoices({ id, label })}
				<BlockheadLightningInvoicesView
					selection={selection.$$invoices}
					collapsible={false}
					title={label}
					emptyText='No local LND invoices.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLightningNodePaymentList({ id, label })}
				<BlockheadLightningPaymentsView
					selection={selection.$$payments}
					collapsible={false}
					title={label}
					emptyText='No local LND payments.'
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
						label: 'Local LND observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Local LND observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningNodeTimestamps({ id, label })}
				<BlockheadLightningNodeState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No local LND node-state observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
