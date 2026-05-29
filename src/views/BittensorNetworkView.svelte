<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


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
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
	import BittensorNetwork_TimestampView from '$/views/BittensorNetwork_TimestampView.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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
				{@render Value()}
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>Bittensor is modeled around Subtensor, subnets, neurons, Dynamic TAO assets, and Yuma Consensus.</p>
	{/snippet}

	{#snippet Content({
		open,
	})}
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
						<dd>{network.environment}</dd>
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
							<dd>{network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</dd>
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

							{#each bittensorNetwork.$$timestamps as timestamp (stringify(timestamp[EntityMetaKey.Id]))}
								<BittensorNetwork_TimestampView
									entityId={timestamp[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
								/>
							{/each}

							<EntitiesList
								collapsible={false}
								entityType={EntityType.BittensorBlock}
								getKey={(blockLine) => stringify(blockLine.value[EntityMetaKey.Id])}
								id={`${networkIdKey}:bittensor-blocks`}
								items={(bittensorNetwork.$$blocks ?? []).map((value) => ({ value }))}
								open={true}
								showSummary={false}
								title="Recent blocks"
								UnorderedListProps={{ orientation: ListOrientation.Column }}
							>
								{#snippet Item({ item: blockLine })}
									<BittensorBlockView
										entityId={blockLine.value[EntityMetaKey.Id]}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBittensorSubnets()}
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.BittensorSubnet}
							getKey={(subnetLine) => stringify(subnetLine.value[EntityMetaKey.Id])}
							id={`${networkIdKey}:bittensor-subnets`}
							items={bittensorNetwork.$$subnets.map((value) => ({ value }))}
							open={true}
							showSummary={false}
							title="Subnets"
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Item({ item: subnetLine })}
								<BittensorSubnetView
									entityId={subnetLine.value[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
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
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.BittensorSubnet}
							getKey={(subnetLine) => stringify(subnetLine.value[EntityMetaKey.Id])}
							id={`${networkIdKey}:bittensor-neuron-subnets`}
							items={bittensorNetwork.$$subnets.slice(0, 8).map((value) => ({ value }))}
							open={true}
							showSummary={false}
							title="Neuron subnets"
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Item({ item: subnetLine })}
								<BittensorSubnetView
									entityId={subnetLine.value[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
								/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBittensorConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<div>
							{#if network.$$consensusMechanisms.length > 0}
								<p><strong>Consensus:</strong> {network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</p>
							{/if}

							<ResourceBoundary resource={bittensorNetwork}>
								{#snippet children(bittensorNetwork)}
									{#each bittensorNetwork.$$timestamps as timestamp (stringify(timestamp[EntityMetaKey.Id]))}
										<BittensorNetwork_TimestampView
											entityId={timestamp[EntityMetaKey.Id]}
											layout={EntityLayout.SummaryInline}
										/>
									{/each}
								{/snippet}
							</ResourceBoundary>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-economics`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{
					id: 'bittensor-assets',
					label: 'Assets',
				},
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

			{#snippet SectionBittensorAssets()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<div>
							{#if network.$$nativeAssets.length > 0}
								<p><strong>Native asset:</strong> {network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</p>
							{/if}

							<ResourceBoundary resource={bittensorNetwork}>
								{#snippet children(bittensorNetwork)}
									<p><strong>Subnet assets:</strong> {bittensorNetwork.$$subnets.length} alpha-token markets are represented by subnet identities and DynamicInfo wire snapshots.</p>
								{/snippet}
							</ResourceBoundary>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-infrastructure`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{
					id: 'bittensor-infrastructure',
					label: 'Infrastructure',
				},
			]}
			data-card
			class="network-view-collapsible-infrastructure"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Infrastructure</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittensorInfrastructure()}
				<ResourceBoundary resource={bittensorNetwork}>
					{#snippet children(bittensorNetwork)}
						<div>
							<p><strong>JSON-RPC:</strong> https://entrypoint-finney.opentensor.ai</p>

							{#each bittensorNetwork.$$timestamps as timestamp (stringify(timestamp[EntityMetaKey.Id]))}
								<BittensorNetwork_TimestampView
									entityId={timestamp[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryInline}
								/>
							{/each}
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
