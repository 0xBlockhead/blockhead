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
		selection: EntityProxyResource<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const network = $derived(selection( { sources: [
				Source.Constants_Internal,
			], fields: { name: true, environment: true, $$executionEnvironments: true, $$consensusMechanisms: true, $$nativeAssets: true } }))

	const zeroGNetwork = $derived(select(EntityType.ZeroGNetwork, {
			slug: '0g',
		}, { sources: [
				Source.Constants_Internal,
			], fields: { rpcEndpoints: true, storageEndpoints: true, $consensusNetwork: true } }))


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
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import ZeroGBlocksView from '$/views/ZeroGBlocksView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
	import ZeroGDataBlobsView from '$/views/ZeroGDataBlobsView.svelte'
	import ZeroGNetwork_TimestampsView from '$/views/ZeroGNetwork_TimestampsView.svelte'
	import ZeroGStorageNodesView from '$/views/ZeroGStorageNodesView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector}
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
				<span>{network.name}</span>
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
		<p>0G combines an EVM-compatible execution chain with consensus, data availability, storage, key-value, and serving layers.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					{#if network.environment !== undefined}
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
						</div>
					{/if}

						{#if (network.$$nativeAssets?.values.length ?? 0) > 0}
							<div>
								<dt>Native asset</dt>
								<dd>{network.$$nativeAssets?.values.length ?? 0}</dd>
							</div>
						{/if}
					</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-0g`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: '0g-blocks', label: 'Blocks' },
				{ id: '0g-snapshots', label: 'Network snapshots' },
				{ id: '0g-consensus', label: 'Consensus' },
				{ id: '0g-endpoints', label: 'Endpoints' },
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

			{#snippet Section0gBlocks({ id, label }: { id: string, label: string })}
				<ZeroGBlocksView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.ZeroGNetwork,
			{
							slug: '0g',
						}
		).$$blocks}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gSnapshots({ id, label }: { id: string, label: string })}
				<ZeroGNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.ZeroGNetwork,
			{
							slug: '0g',
						}
		).$$timestamps}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gConsensus()}
				<ResourceBoundary resource={zeroGNetwork}>
					{#snippet children(zeroGNetwork)}
						{#if zeroGNetwork.$consensusNetwork != null}
							<ZeroGConsensusNetworkView
								selection={select(EntityType.ZeroGConsensusNetwork, zeroGNetwork.$consensusNetwork[EntityMetaKey.Selector])}
								layout={EntityLayout.SummaryDetails}
							/>
						{:else}
							<p data-text="muted">No consensus network mapped yet.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet Section0gEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={[
						'rpcEndpoints',
						'storageEndpoints',
					]}
					fieldSources={[
						Source.Constants_Internal,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.ZeroGNetwork}
					parentEntitySelector={{
						slug: '0g',
					}}
					parentEntityType={EntityType.ZeroGNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-0g-data`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: '0g-data-blobs', label: 'Data blobs' },
				{ id: '0g-storage-nodes', label: 'Storage nodes' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Data & Storage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet Section0gDataBlobs({ id, label }: { id: string, label: string })}
				<ZeroGDataBlobsView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.ZeroGNetwork,
			{
							slug: '0g',
						}
		).$$dataBlobs}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gStorageNodes({ id, label }: { id: string, label: string })}
				<ZeroGStorageNodesView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.ZeroGNetwork,
			{
							slug: '0g',
						}
		).$$storageNodes}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
