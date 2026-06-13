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
	import { subscribe } from '$/routes/+layout.svelte'
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

	const network = subscribe(EntityType.Network,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, environment: true, $networkStack: true, $$nativeAssets: true, $$executionEnvironments: true, $$consensusMechanisms: true } }),
	)

	const hyperliquidNetwork = subscribe(EntityType.HyperliquidNetwork,
		entityId,
		({ sources: [
				Source.Hyperliquid_JsonRpc,
				Source.Hyperliquid_Rest,
			], fields: { rpcEndpoints: true, restEndpoints: true, $$blocks: ({ limit: 1 }), $$timestamps: ({ limit: 1 }) } }),
	)


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import NetworkTransportEndpointsView from '$/views/NetworkTransportEndpointsView.svelte'
	import HyperliquidBlockView from '$/views/HyperliquidBlockView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
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
				<span>{network.fields.name}</span>
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
		<p>Hyperliquid combines HyperBFT consensus, HyperCore exchange state, and HyperEVM execution.</p>
	{/snippet}

	{#snippet Content({
		open,
	})}
		<dl class="network-summary-head" data-column-item="center">
				<ResourceBoundary resource={hyperliquidNetwork} placeholderText="Loading head block…">
					{#snippet children(hyperliquidNetwork)}
						{@const block = hyperliquidNetwork.fields.$$blocks?.values.at(0)}
						{#if block != null}
							<div>
								<dt>Head block</dt>
								<dd id="network-summary-head-block">
									<HyperliquidBlockView
										entityId={block[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
									/>
								</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					{#if open}
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
						</div>
					{/if}

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
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-hyperliquid`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'hyperliquid-blocks', label: 'Blocks' },
				{ id: 'hyperliquid-transactions', label: 'Transactions' },
				{ id: 'hyperliquid-snapshots', label: 'Network snapshots' },
				{ id: 'hyperliquid-validators', label: 'Validators' },
				{ id: 'hyperliquid-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidBlocks({ id, label }: { id: string, label: string })}
				<HyperliquidBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidTransactions({ id, label }: { id: string, label: string })}
				<HyperliquidTransactionsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$transactions',
					}}
					href={href == null ? '' : `${href}/transactions`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidSnapshots({ id, label }: { id: string, label: string })}
				<HyperliquidNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidValidators({ id, label }: { id: string, label: string })}
				<HyperliquidValidatorsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$validators',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={[
						'rpcEndpoints',
						'restEndpoints',
					]}
					fieldSources={[
						Source.Hyperliquid_JsonRpc,
						Source.Hyperliquid_Rest,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.HyperliquidNetwork}
					parentEntityId={entityId}
					parentEntityType={EntityType.HyperliquidNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-hyperliquid-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'hyperliquid-assets-native', label: 'Native coin' },
				{ id: 'hyperliquid-assets-perps', label: 'Perp markets' },
				{ id: 'hyperliquid-assets-spot', label: 'Spot assets' },
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

			{#snippet SectionHyperliquidAssetsNative({ id, label }: { id: string, label: string })}
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

			{#snippet SectionHyperliquidAssetsPerps({ id, label }: { id: string, label: string })}
				<HyperliquidPerpMarketsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$perpMarkets',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAssetsSpot({ id, label }: { id: string, label: string })}
				<HyperliquidSpotAssetsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId,
						fieldName: '$$spotAssets',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-hyperliquid-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'hyperliquid-resources-faucets', label: 'Faucets' },
				{ id: 'hyperliquid-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionHyperliquidResourcesFaucets({ id, label }: { id: string, label: string })}
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
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionHyperliquidResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
