<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.CosmosNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = $derived(
		proxy(
			EntityType.Network,
			selector.$network,
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

	


	// (Derived)
	const networkSelectorKey = $derived(
		stringify(selector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import NetworkTransportEndpointsView from '$/views/NetworkTransportEndpointsView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import CosmosNetwork_TimestampsView from '$/views/CosmosNetwork_TimestampsView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selector.$network}
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
		<p>Cosmos SDK models CometBFT consensus blocks, SDK module messages, validators, staking, governance, and IBC.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={proxy(
							EntityType.CosmosNetwork,
							selector,
							{
								sources: [
									Source.CosmosSdk_Rest,
									Source.CometBft_Rest,
								],
								fields: {
									$$blocks: {
										limit: 1,
									},
									$$timestamps: {
										limit: 1,
									},
									restEndpoints: true,
								},
							},
						)}>
						{#snippet children(cosmosNetwork)}
							{@const block = cosmosNetwork.fields.$$blocks?.values.at(0)}
							{#if block != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<CosmosBlockView
											selector={block[EntityMetaKey.Selector]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

					{#if (network.fields.$$nativeAssets?.values.length ?? 0) > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{network.fields.$$nativeAssets?.values.length ?? 0}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-cosmos`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'cosmos-blocks', label: 'Blocks' },
				{ id: 'cosmos-snapshots', label: 'Network snapshots' },
				{ id: 'cosmos-endpoints', label: 'Endpoints' },
			]}
			data-card
			class="network-view-collapsible-execution"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCosmosBlocks({ id, label }: { id: string, label: string })}
				<CosmosBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						selector,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionCosmosSnapshots({ id, label }: { id: string, label: string })}
				<CosmosNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						selector,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionCosmosEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['restEndpoints']}
					emptyText="No REST endpoints listed for this network yet."
					fieldSources={[
						Source.CosmosSdk_Rest,
						Source.CometBft_Rest,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.CosmosNetwork}
					parentEntitySelector={selector}
					parentEntityType={EntityType.CosmosNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-consensus`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'cosmos-validators', label: 'Validators' },
				{ id: 'cosmos-governance', label: 'Governance' },
			]}
			data-card
			class="network-view-collapsible-consensus"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus &amp; Governance</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCosmosValidators({ id, label }: { id: string, label: string })}
				<CosmosValidatorsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						selector,
						fieldName: '$$validators',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionCosmosGovernance({ id, label }: { id: string, label: string })}
				<CosmosGovernanceProposalsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						selector,
						fieldName: '$$governanceProposals',
					}}
					href={href == null ? '' : `${href}/governance`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-assets`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'cosmos-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCosmosAssetsNative({ id, label }: { id: string, label: string })}
				<AssetInstancesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.Network,
						selector: selector.$network,
						fieldName: '$$nativeAssets',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-resources`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'cosmos-resources-faucets', label: 'Faucets' },
				{ id: 'cosmos-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCosmosResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						selector: selector.$network,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionCosmosResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						selector: selector.$network,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
						Source.CosmosChainRegistry_Github,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
