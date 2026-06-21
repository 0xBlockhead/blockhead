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
		selection: EntityProxyResource<typeof schema, EntityType.BittensorNetwork>
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
					name: true,
					environment: true,
					$networkStack: true,
					$$executionEnvironments: true,
					$$consensusMechanisms: true,
					$$nativeAssets: true,
				},
			},
		),
	)

	const bittensorNetwork = $derived(
		selection({
				sources: [
					Source.Bittensor_JsonRpc,
				],
				fields: {
					$$timestamps: {
						limit: 1,
					},
					$$blocks: {
						limit: open ? 12 : 1,
					},
					$$subnets: {
						limit: 24,
					},
				},
			},
		),
	)


	// (Derived)
	const networkSelectorKey = $derived(stringify(selection.entitySelector))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
	import BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
	import BittensorNetwork_TimestampsView from '$/views/BittensorNetwork_TimestampsView.svelte'
	import BittensorSubnetsView from '$/views/BittensorSubnetsView.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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
		<span>bittensor</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>Bittensor is modeled around Subtensor, subnets, neurons, Dynamic TAO assets, and Yuma Consensus.</p>
	{/snippet}

	{#snippet Content({ open })}
		<dl class="network-summary-head" data-column-item="center">
			<ResourceBoundary resource={bittensorNetwork}>
				{#snippet children(bittensorNetwork)}
						{@const subnetCount = bittensorNetwork.$$subnets?.values.length ?? 0}
						{@const block = bittensorNetwork.$$blocks?.values[0]}
					{#if block !== undefined}
						<div>
							<dt>Finalized block</dt>
							<dd id="network-summary-head-block">
								<BittensorBlockView
									selection={select(EntityType.BittensorBlock, block[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if subnetCount > 0}
						<div>
							<dt>Subnets</dt>
							<dd><NumberValue value={subnetCount} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
						{@const nativeAssetCount = network.$$nativeAssets?.values.length ?? 0}
						<div>
							<dt>Environment</dt>
							<dd>
								{#if network.environment !== undefined}
									{networkEnvironmentByEnvironment[network.environment].label}
								{/if}
							</dd>
						</div>

					{#if open && network.$networkStack != null}
						<div>
							<dt>Stack</dt>
							<dd>
								<NetworkStackView
									selection={select(EntityType.NetworkStack, network.$networkStack[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if open && nativeAssetCount > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{nativeAssetCount}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-execution`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{
					id: 'bittensor-subtensor',
					label: 'Subtensor',
				},
				{
					id: 'bittensor-blocks',
					label: 'Blocks',
				},
				{
					id: 'bittensor-subnets',
					label: 'Subnets',
				},
			]}
			data-card
			class="network-view-collapsible-execution"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorSubtensor()}
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
							{@const block = bittensorNetwork.$$blocks?.values.at(0)}
						<div>
							{#if block != null}
								<BittensorBlockView
									selection={select(EntityType.BittensorBlock, block[EntityMetaKey.Selector])}
									layout={EntityLayout.SummaryDetails}
								/>
							{/if}
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBittensorBlocks()}
				<BittensorBlocksView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$blocks}
					href={href == null ? '' : `${href}/blocks`}
					id={`${networkSelectorKey}:bittensor-blocks-bittensorNetworks`}
					title="Blocks"
				/>
			{/snippet}

			{#snippet SectionBittensorSubnets()}
				<BittensorSubnetsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$subnets}
					id={`${networkSelectorKey}:bittensor-subnets-bittensorNetworks`}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-consensus`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{
					id: 'bittensor-neurons',
					label: 'Neurons',
				},
				{
					id: 'bittensor-consensus',
					label: 'Yuma Consensus',
				},
			]}
			data-card
			class="network-view-collapsible-consensus"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus &amp; Neurons</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorNeurons()}
				<BittensorSubnetsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$subnets}
					id={`${networkSelectorKey}:bittensor-neuron-subnets-bittensorNetworks`}
					title="Neuron subnets"
				/>
			{/snippet}

			{#snippet SectionBittensorConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
							{@const consensusMechanismCount = network.$$consensusMechanisms?.values.length ?? 0}
						<div>
							{#if consensusMechanismCount > 0}
								<p><strong>Consensus:</strong> {consensusMechanismCount}</p>
							{/if}

							<BittensorNetwork_TimestampsView
								CollapsibleProps={{ canToggle: false }}
								selection={selection.$$timestamps}
								id={`${networkSelectorKey}:bittensor-consensus-snapshots`}
								title="Network snapshots"
							/>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-economics`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'bittensor-assets-native', label: 'Native coin' },
				{ id: 'bittensor-assets-subnets', label: 'Subnets' },
			]}
			data-card
			class="network-view-collapsible-economics"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorAssetsNative({ id, label }: { id: string, label: string })}
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

			{#snippet SectionBittensorAssetsSubnets()}
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
							<p><strong>Subnet assets:</strong> {bittensorNetwork.$$subnets?.values.length ?? 0} alpha-token markets are represented by subnet identities and DynamicInfo wire snapshots.</p>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-resources`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{
					id: 'bittensor-resources-faucets',
					label: 'Faucets',
				},
				{
					id: 'bittensor-resources-block-explorers',
					label: 'Block explorers',
				},
			]}
			data-card
			class="network-view-collapsible-resources"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorResourcesFaucets()}
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
					id={`${networkSelectorKey}:bittensor-resources-faucets-bittensorNetworks`}
					title="Faucets"
				/>
			{/snippet}

			{#snippet SectionBittensorResourcesBlockExplorers()}
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
					id={`${networkSelectorKey}:bittensor-resources-block-explorers-bittensorNetworks`}
					title="Block explorers"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
