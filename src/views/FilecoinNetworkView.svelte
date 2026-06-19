<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.FilecoinNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const network = $derived(
		select(
			EntityType.Network,
			selection.entitySelector.$network,
			{
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					slug: true,
					name: true,
					environment: true,
					$$nativeAssets: true,
				},
			},
		),
	)

	const filecoinNetwork = $derived(
		selection({
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
				fields: {
					$$timestamps: {
						limit: 1,
						fields: {
							$headTipset: true,
						},
					},
					rpcEndpoints: true,
				},
			},
		),
	)


	// (Derived)
	const networkSelectorKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import NetworkTransportEndpointsView from '$/views/NetworkTransportEndpointsView.svelte'
	import FilecoinMinersView from '$/views/FilecoinMinersView.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector.$network}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				<span>{network.fields.slug}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.fields.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>Filecoin models Expected Consensus tipsets, actors, miners, and storage-sector state.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={filecoinNetwork}>
						{#snippet children(filecoinNetwork)}
							{@const latestTimestamp = filecoinNetwork.fields.$$timestamps.values[0]}
							{#if latestTimestamp !== undefined}
								<div>
									<dt>Head tipset</dt>
									<dd id="network-summary-head-block">
										<ResourceBoundary
											resource={latestTimestamp}
											placeholderText="Loading Filecoin timestamp…"
										>
											{#snippet children(latestTimestamp)}
												{#if latestTimestamp.fields.$headTipset != null}
													<FilecoinTipsetView
														selection={select(EntityType.FilecoinTipset, latestTimestamp.fields.$headTipset[EntityMetaKey.Selector])}
														layout={EntityLayout.Value}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

					{#if (network.fields.$$nativeAssets.values.length ) > 0}
						<div>
							<dt>Native assets</dt>
							<dd>{network.fields.$$nativeAssets.values.length }</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-filecoin-chain`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'filecoin-tipsets', label: 'Tipsets' },
				{ id: 'filecoin-network-snapshots', label: 'Network snapshots' },
				{ id: 'filecoin-endpoints', label: 'Endpoints' },
			]}
			data-card
			class="network-view-collapsible-execution"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinTipsets({ id, label }: { id: string, label: string })}
				<FilecoinTipsetsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$tipsets}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionFilecoinNetworkSnapshots({ id, label }: { id: string, label: string })}
				<FilecoinNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$timestamps}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionFilecoinEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Lotus_JsonRpc,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.FilecoinNetwork}
					parentEntitySelector={selection.entitySelector}
					parentEntityType={EntityType.FilecoinNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-consensus`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'filecoin-miners', label: 'Miners' },
			]}
			data-card
			class="network-view-collapsible-consensus"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus &amp; Storage Power</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinMiners({ id, label }: { id: string, label: string })}
				<ResourceBoundary resource={filecoinNetwork}>
					{#snippet children(filecoinNetwork)}
						{@const latestTimestamp = filecoinNetwork.fields.$$timestamps.values.at(0)}
						{#if latestTimestamp != null}
							<FilecoinMinersView
								CollapsibleProps={{ canToggle: false }}
								selection={select(
			EntityType.FilecoinNetwork_Timestamp,
			latestTimestamp[EntityMetaKey.Selector]
		).$$headMiners}
								id={`${id}-list`}
								title={label}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-assets`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'filecoin-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinAssetsNative({ id, label }: { id: string, label: string })}
				<AssetInstancesView
					CollapsibleProps={{ canToggle: false }}
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
			id={`${networkSelectorKey}:carousel-resources`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'filecoin-resources-faucets', label: 'Faucets' },
				{ id: 'filecoin-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionFilecoinResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
