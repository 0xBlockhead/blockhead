<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
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
			slug: {},
			name: {},
			environment: {},
			$$nativeAssets: {},
		},
	)

	const cosmosNetwork = useEntity(
		EntityType.CosmosNetwork,
		entityId,
		{
			$: [
				Source.CosmosSdk_Rest,
				Source.CometBft_Rest,
			],
			$headBlock: {},
			$$timestamps: {
				$limit: 1,
			},
			restEndpoints: {},
		},
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import CosmosNetwork_TimestampsView from '$/views/CosmosNetwork_TimestampsView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
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
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				<span>{network.slug}</span>
			{/snippet}
		</ResourceBoundary>
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
		<p>Cosmos SDK models CometBFT consensus blocks, SDK module messages, validators, staking, governance, and IBC.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={cosmosNetwork}>
						{#snippet children(cosmosNetwork)}
							{#if cosmosNetwork.$headBlock != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<CosmosBlockView
											entityId={cosmosNetwork.$headBlock[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{network.environment}</dd>
					</div>

					{#if network.$$nativeAssets.length > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{network.$$nativeAssets.length}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
				id={`${networkIdKey}:carousel-cosmos`}
				sectionIdPrefix={networkIdKey}
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
							entityId,
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
							entityId,
							fieldName: '$$timestamps',
						}}
						id={`${id}-list`}
						title={label}
					/>
				{/snippet}

				{#snippet SectionCosmosEndpoints()}
					<ResourceBoundary resource={cosmosNetwork}>
						{#snippet children(cosmosNetwork)}
							{#if cosmosNetwork.restEndpoints.length > 0}
								<p><strong>REST endpoints:</strong> {cosmosNetwork.restEndpoints.length}</p>
							{:else}
								<p data-text="muted">No REST endpoints listed for this network yet.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-consensus`}
			sectionIdPrefix={networkIdKey}
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
						entityId,
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
						entityId,
						fieldName: '$$governanceProposals',
					}}
					href={href == null ? '' : `${href}/governance`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-assets`}
			sectionIdPrefix={networkIdKey}
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

			{#snippet SectionCosmosAssetsNative()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						{#if network.$$nativeAssets.length > 0}
							<p><strong>Native asset:</strong> {network.$$nativeAssets.length}</p>
						{:else}
							<p data-text="muted">No native asset mapped for this network yet.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-resources`}
			sectionIdPrefix={networkIdKey}
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
						entityId,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					limit={undefined}
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
						entityId,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
						Source.CosmosChainRegistry_Github,
					]}
					href={href ?? ''}
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
