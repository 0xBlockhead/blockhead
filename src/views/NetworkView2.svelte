<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { hasBeaconDataForChainId } from '$/constants/BeaconConsensus.ts'
	import { ethereumExecutionForks } from '$/constants/EthereumExecutionForks.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { type EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	

	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { schema } from '$/schema/index.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		Title,
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.Network>
		href: string
		layout?: EntityLayout
		open?: boolean
		Title?: Snippet
	} = $props()

	const networkIdKey = $derived(
		stringify(entityId),
	)
	const hasCatalogedForksForChain = $derived(
		ethereumExecutionForks.some((row) => (
			row[EntityMetaKey.Id].$network.chainId === entityId.chainId
		)),
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<QueryBoundary
	placeholderText="Loading…"
	query={useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
			name: {},
			nativeCurrencies: {},
			blockExplorers: {},
			executionEndpoints: {},
			environment: {},
			parentLayer: {},
			rollupLayerNumber: {},
			childLayerChainIds: {},
			correspondingChainIds: {},
			siblingShardChainIds: {},
			shortName: {},
			registryStatus: {},
			peeringId: {},
			faucets: {},
			slip44: {},
			$icon: {
				$: [
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				],
			},
			$$forks: {
				$: [
					Source.Constants_Internal,
				],
			},
			blockHeight: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			gasPrice: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
		},
	)}
>
	{#snippet children(network)}
		<EntityView
			entityType={EntityType.Network}
			{entityId}
			{href}
			title={network.name}
			{layout}
			{open}
		>
			{#snippet Heading()}
				<div data-row="inline wrap gap-2 align-center">
					<HeadingComponent>
						{#if href}
							<a href={resolve(href as `/${string}`)}>
								{#if Title}
									{@render Title()}
								{:else}
									{network.name}
								{/if}
							</a>
						{:else if Title}
							{@render Title()}
						{:else}
							{network.name}
						{/if}
					</HeadingComponent>
				</div>
			{/snippet}

			{#snippet Content()}
				<dl>
					<div>
						<dt>Chain ID</dt>
						<dd>{String(entityId.chainId)}</dd>
					</div>

					{#if layout === EntityLayout.SummaryDetails}
						<div>
							<dt>Head block</dt>
							<dd
								data-row="inline wrap"
								data-e2e="network-summary-head-block"
							>
								<EvmBlockView
									entityId={{
										$network: { chainId: entityId.chainId },
										blockNumber: network.blockHeight,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.chainId),
											blockNumber: String(network.blockHeight),
										},
									)}
									layout={EntityLayout.Id}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}

			{#snippet Details({ open: _open })}
				<EntityDetails
					entityType={EntityType.Network}
					{entityId}
				>
					<dl>
						<div>
							<dt>CAIP-2</dt>
							<dd data-row="inline wrap"><code>eip155:{String(entityId.chainId)}</code></dd>
						</div>
					</dl>
				</EntityDetails>

				<div data-column="gap-3" data-e2e="network-carousel-groups">
					<Collapsible id={`${networkIdKey}:carousel-topology`} {...{ 'data-card': '' }} data-e2e="network-collapsible-topology">
						{#snippet Summary({ open: _open })}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Topology</HeadingComponent></header>{/snippet}
						{#snippet children(_ctx)}
							<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-topology">

								{#if hasCatalogedForksForChain}<section data-e2e="network-topology-forks" data-scroll-marker-label="Forks"><NetworkForksView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$forks' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:topology-forks`} /></section>{/if}
								{#if entityId.chainId === 1}<section data-e2e="network-topology-children" data-scroll-marker-label="Layer-2 networks"><NetworksView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$childNetworks' }} href={resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:topology-children`} open={false} title="Layer-2 networks" /></section>{/if}
							</div>
						{/snippet}
					</Collapsible>

					<Collapsible id={`${networkIdKey}:carousel-economics`} {...{ 'data-card': '' }} data-e2e="network-collapsible-economics">
						{#snippet Summary({ open: _open })}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Economics</HeadingComponent></header>{/snippet}
						{#snippet children(_ctx)}
							<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-economics">
								{#if layout === EntityLayout.SummaryDetails}<section data-e2e="network-economics-gas" data-scroll-marker-label="Gas"><div class="entity-details"><dl><div><dt>Gas price</dt><dd><NumberValue value={network.gasPrice} /> wei</dd></div></dl></div></section>{/if}
							</div>
						{/snippet}
					</Collapsible>

					<Collapsible id={`${networkIdKey}:carousel-execution`} {...{ 'data-card': '' }} data-e2e="network-collapsible-execution">
						{#snippet Summary({ open: _open })}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Execution</HeadingComponent></header>{/snippet}
						{#snippet children(_ctx)}<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-execution"><section data-e2e="network-carousel-blocks" data-scroll-marker-label="Blocks"><EvmBlocksView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$blocks' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:blocks`} /></section><section data-e2e="network-carousel-transactions" data-scroll-marker-label="Transactions"><EvmTransactionsView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$transactions' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:transactions`} /></section><section data-e2e="network-carousel-contracts" data-scroll-marker-label="Contracts"><EvmContractsView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$contracts' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:contracts`} /></section></div>{/snippet}
					</Collapsible>

					{#if hasBeaconDataForChainId(entityId.chainId)}
						<Collapsible id={`${networkIdKey}:carousel-consensus`} {...{ 'data-card': '' }} data-e2e="network-collapsible-consensus">
							{#snippet Summary({ open: _open })}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Consensus</HeadingComponent></header>{/snippet}
							{#snippet children(_ctx)}<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-consensus"><section data-e2e="network-carousel-beacon-epochs" data-scroll-marker-label="Epochs"><BeaconEpochsView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$beaconEpochs' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-epochs', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:beacon-epochs`} /></section><section data-e2e="network-carousel-beacon-slots" data-scroll-marker-label="Slots"><BeaconSlotsView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$beaconSlots' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-slots', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:beacon-slots`} /></section></div>{/snippet}
						</Collapsible>
					{/if}

					<Collapsible id={`${networkIdKey}:carousel-data-storage`} {...{ 'data-card': '' }} data-e2e="network-collapsible-data-storage">
						{#snippet Summary({ open: _open })}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Data</HeadingComponent></header>{/snippet}
						{#snippet children(_ctx)}<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-data-storage"><section data-e2e="network-data-storage-blobs-list" data-scroll-marker-label="Recent EIP-4844 blobs"><EvmBlobsView collapsible={false} entityFieldReference={{ entityType: EntityType.Network, entityId, fieldName: '$$blobs' }} href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blobs', { networkId: String(entityId.chainId) })} id={`${networkIdKey}:data-storage-blobs`} title="Recent EIP-4844 blobs" /></section></div>{/snippet}
					</Collapsible>
				</div>

				{#if children}
					{@render children()}
				{/if}
			{/snippet}
		</EntityView>
	{/snippet}
</QueryBoundary>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
