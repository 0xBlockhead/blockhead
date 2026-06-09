<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = useEntity(entityCollectionsContext, EntityType.Network,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, environment: true, $networkStack: true, $$executionEnvironments: true, $$consensusMechanisms: true, $$nativeAssets: true } }),
	)

	const bittensorNetwork = useEntity(entityCollectionsContext, EntityType.BittensorNetwork,
		entityId,
		({ sources: [
				Source.Bittensor_JsonRpc,
			], fields: { $$timestamps: ({ limit: 1 }), $$blocks: ({ limit: open ? 12 : 1 }), $$subnets: ({ limit: 24 }) } }),
	)


	// (Derived)
	const networkIdKey = $derived(stringify(entityId))


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
	{entityId}
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
				{network.fields.name}
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
						{@const block = bittensorNetwork.fields.$$blocks?.values.at(0)}
						{@const subnetCount = bittensorNetwork.fields.$$subnets?.values.length ?? 0}
						{#if block != null}
							<div>
								<dt>Finalized block</dt>
								<dd id="network-summary-head-block">
									<BittensorBlockView
										entityId={block[EntityMetaKey.Id]}
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
						{@const nativeAssetCount = network.fields.$$nativeAssets?.values.length ?? 0}
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
						</div>

					{#if open && network.fields.$networkStack != null}
						<div>
							<dt>Stack</dt>
							<dd>
								<NetworkStackView
									entityId={network.fields.$networkStack[EntityMetaKey.Id]}
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
			id={`${networkIdKey}:carousel-execution`}
			sectionIdPrefix={networkIdKey}
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
						{@const block = bittensorNetwork.fields.$$blocks?.values.at(0)}
						<div>
							{#if block != null}
								<BittensorBlockView
									entityId={block[EntityMetaKey.Id]}
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
					entityFieldReference={{
						entityType: EntityType.BittensorNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${networkIdKey}:bittensor-blocks-bittensorNetworks`}
					title="Blocks"
				/>
			{/snippet}

			{#snippet SectionBittensorSubnets()}
				<BittensorSubnetsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.BittensorNetwork,
						entityId,
						fieldName: '$$subnets',
					}}
					id={`${networkIdKey}:bittensor-subnets-bittensorNetworks`}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-consensus`}
			sectionIdPrefix={networkIdKey}
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
					entityFieldReference={{
						entityType: EntityType.BittensorNetwork,
						entityId,
						fieldName: '$$subnets',
					}}
					id={`${networkIdKey}:bittensor-neuron-subnets-bittensorNetworks`}
					title="Neuron subnets"
				/>
			{/snippet}

			{#snippet SectionBittensorConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						{@const consensusMechanismCount = network.fields.$$consensusMechanisms?.values.length ?? 0}
						<div>
							{#if consensusMechanismCount > 0}
								<p><strong>Consensus:</strong> {consensusMechanismCount}</p>
							{/if}

							<BittensorNetwork_TimestampsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.BittensorNetwork,
									entityId,
									fieldName: '$$timestamps',
								}}
								id={`${networkIdKey}:bittensor-consensus-snapshots`}
								title="Network snapshots"
						/>
					</div>
				{/snippet}
			</ResourceBoundary>
		{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-economics`}
			sectionIdPrefix={networkIdKey}
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
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$nativeAssets',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionBittensorAssetsSubnets()}
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
						<p><strong>Subnet assets:</strong> {bittensorNetwork.fields.$$subnets?.values.length ?? 0} alpha-token markets are represented by subnet identities and DynamicInfo wire snapshots.</p>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-resources`}
			sectionIdPrefix={networkIdKey}
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
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${networkIdKey}:bittensor-resources-faucets-bittensorNetworks`}
					title="Faucets"
				/>
			{/snippet}

			{#snippet SectionBittensorResourcesBlockExplorers()}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${networkIdKey}:bittensor-resources-block-explorers-bittensorNetworks`}
					title="Block explorers"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
