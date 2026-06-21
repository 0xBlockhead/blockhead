<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const lightningNetwork = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			name: true,
			$settlementNetwork: true,
			$$timestamps: {
				limit: 1,
			},
		},
	}))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import LightningInvoicesView from '$/views/LightningInvoicesView.svelte'
	import LightningNetwork_TimestampView from '$/views/LightningNetwork_TimestampView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningPaymentsView from '$/views/LightningPaymentsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector}
	{href}
	title="Lightning Network"
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={lightningNetwork}
		>
			{#snippet children(row)}
				{row.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			The Lightning Network is a Bitcoin payment-channel network and protocol; it is not a base-layer chain.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lightningNetwork}
			placeholderText="Loading Lightning Network…"
		>
			{#snippet children(row)}
				{@const timestamp = row.$$timestamps?.values.at(0)}
				<dl>
					{#if row.$settlementNetwork != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, row.$settlementNetwork.entitySelector)}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if timestamp != null}
						<div>
							<dt>Latest snapshot</dt>
							<dd>
								<LightningNetwork_TimestampView
									selection={select(EntityType.LightningNetwork_Timestamp, timestamp[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${stringify(selection.entitySelector)}:carousel-lightning`}
			sectionIdPrefix={stringify(selection.entitySelector)}
			sections={[
				{ id: 'lightning-graph-nodes', label: 'Nodes' },
				{ id: 'lightning-graph-channels', label: 'Channels' },
				{ id: 'lightning-local-payments', label: 'Local payments' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Graph</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningGraphNodes()}
				<LightningNodesView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$nodes}
					href={href == null ? '' : `${href}/nodes`}
					id={`${stringify(selection.entitySelector)}:lightning-nodes-lightningNetworks`}
				/>
			{/snippet}

			{#snippet SectionLightningGraphChannels()}
				<LightningChannelsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$channels}
					href={href == null ? '' : `${href}/channels`}
					id={`${stringify(selection.entitySelector)}:lightning-channels-lightningNetworks`}
				/>
			{/snippet}

			{#snippet SectionLightningLocalPayments()}
				<div data-column="gap-3">
					<LightningInvoicesView
						CollapsibleProps={{ canToggle: false }}
						selection={selection.$$invoices}
						href={href == null ? '' : `${href}/invoices`}
						id={`${stringify(selection.entitySelector)}:lightning-invoices-lightningNetworks`}
					/>

					<LightningPaymentsView
						CollapsibleProps={{ canToggle: false }}
						selection={selection.$$payments}
						href={href == null ? '' : `${href}/payments`}
						id={`${stringify(selection.entitySelector)}:lightning-payments-lightningNetworks`}
					/>
				</div>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${stringify(selection.entitySelector)}:carousel-lightning-assets`}
			sectionIdPrefix={stringify(selection.entitySelector)}
			sections={[
				{ id: 'lightning-assets-settlement', label: 'Settlement asset' },
			]}
			data-card
			class="network-view-collapsible-assets"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningAssetsSettlement({ id, label }: { id: string, label: string })}
				<AssetInstancesView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No settlement asset mapped for this network yet."
					selection={select(
						EntityType.Network,
						selection.entitySelector.$network
					).$$nativeAssets}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${stringify(selection.entitySelector)}:carousel-lightning-resources`}
			sectionIdPrefix={stringify(selection.entitySelector)}
			sections={[
				{ id: 'lightning-resources-faucets', label: 'Faucets' },
				{ id: 'lightning-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLightningResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					selection={select(
						EntityType.Network,
						selection.entitySelector.$network
					).$$faucetUrls}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionLightningResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					selection={select(
						EntityType.Network,
						selection.entitySelector.$network
					).$$blockExplorerUrls}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
