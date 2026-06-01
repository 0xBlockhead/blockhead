<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			environment: {},
			$networkStack: {},
			$$executionEnvironments: {},
			$$consensusMechanisms: {},
			$$nativeAssets: {},
		},
	)
	const bittensorNetwork = useEntity(
		EntityType.BittensorNetwork,
		entityId,
		{
			$: [
				Source.Bittensor_JsonRpc,
			],
			$headBlock: {},
			$$timestamps: {
				$limit: 1,
			},
			...(open && {
				$$blocks: {
					$limit: 12,
				},
			}),
			$$subnets: {
				$limit: 24,
			},
		},
	)
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
					{#if bittensorNetwork.$headBlock != null}
						<div>
							<dt>Finalized block</dt>
							<dd id="network-summary-head-block">
								<BittensorBlockView
									entityId={bittensorNetwork.$headBlock[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if bittensorNetwork.$$subnets.length > 0}
						<div>
							<dt>Subnets</dt>
							<dd><NumberValue value={bittensorNetwork.$$subnets.length} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
					</div>

					{#if open && network.$networkStack != null}
						<div>
							<dt>Stack</dt>
							<dd>
								<NetworkStackView
									entityId={network.$networkStack[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if open && network.$$nativeAssets.length > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{network.$$nativeAssets.length}</dd>
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
						<div>
							{#if bittensorNetwork.$headBlock != null}
								<BittensorBlockView
									entityId={bittensorNetwork.$headBlock[EntityMetaKey.Id]}
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
					id={`${networkIdKey}:bittensor-blocks-list`}
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
					id={`${networkIdKey}:bittensor-subnets-list`}
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
					id={`${networkIdKey}:bittensor-neuron-subnets-list`}
					title="Neuron subnets"
				/>
			{/snippet}

			{#snippet SectionBittensorConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<div>
							{#if network.$$consensusMechanisms.length > 0}
								<p><strong>Consensus:</strong> {network.$$consensusMechanisms.length}</p>
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
						<p><strong>Subnet assets:</strong> {bittensorNetwork.$$subnets.length} alpha-token markets are represented by subnet identities and DynamicInfo wire snapshots.</p>
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
					limit={undefined}
					id={`${networkIdKey}:bittensor-resources-faucets-list`}
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
					limit={undefined}
					id={`${networkIdKey}:bittensor-resources-block-explorers-list`}
					title="Block explorers"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
