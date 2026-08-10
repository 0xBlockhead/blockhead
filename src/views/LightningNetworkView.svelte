<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LightningNetwork> = $props()

	const titleFallback = $derived((prefetched.name ?? '') || 'Lightning network')
	const viewDomId = $derived('lightning-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LightningNetwork_TimestampsView from '$/views/LightningNetwork_TimestampsView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.LightningMempoolSpace_Rest,
						Source.LightningLnd_Rest,
					],
					fields: {
						name: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		Lightning
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$settlementNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
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
			id={viewDomId + '-carousel-lightning-network-graph'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lightning-observations',
						label: 'Observations',
					},
					{
						id: 'lightning-nodes',
						label: 'Nodes',
					},
					{
						id: 'lightning-channels',
						label: 'Channels',
					},
				]
			}
			data-card
			class='network-view-collapsible-network-graph'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Network graph</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningObservations({ id, label })}
				<LightningNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLightningNodes({ id, label })}
				<LightningNodesView
					selection={selection.$$nodes}
					collapsible={false}
					title={label}
					emptyText='No nodes yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLightningChannels({ id, label })}
				<LightningChannelsView
					selection={selection.$$channels}
					collapsible={false}
					title={label}
					emptyText='No channels yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-lightning-payments'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lightning-invoices',
						label: 'Invoices',
					},
					{
						id: 'lightning-payment-list',
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

			{#snippet SectionLightningInvoices({ id, label })}
				<BlockheadLightningInvoicesView
					selection={selection.$$invoices}
					collapsible={false}
					title={label}
					emptyText='No invoices yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLightningPaymentList({ id, label })}
				<BlockheadLightningPaymentsView
					selection={selection.$$payments}
					collapsible={false}
					title={label}
					emptyText='No payments yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
