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
			], fields: { name: true, environment: true, $$executionEnvironments: true, $$consensusMechanisms: true, $$nativeAssets: true } }),
	)

	const quilibriumNetwork = useEntity(entityCollectionsContext, EntityType.QuilibriumNetwork,
		{
			networkSlug: 'quilibrium',
		},
		({ sources: [
				Source.QuilibriumDocs_Rest,
				Source.QuilibriumNodeRpc_Grpc,
			], fields: { docsEndpoints: true, nodeInterfaces: true, protocolFacts: true, serviceLayers: true, $protocolDocument: true, $masterShard: true } }),
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
	import QuilibriumShardView from '$/views/QuilibriumShardView.svelte'
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
		<p>Quilibrium is modeled around frames, shards, provers, accounts, pending transactions, and its protocol document.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

					<ResourceBoundary resource={quilibriumNetwork}>
						{#snippet children(quilibriumNetwork)}
							{#if quilibriumNetwork.fields.$masterShard != null}
								<div>
									<dt>Master shard</dt>
									<dd>
										<QuilibriumShardView
											entityId={quilibriumNetwork.fields.$masterShard[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-quilibrium`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'quilibrium-protocol', label: 'Protocol' },
				{ id: 'quilibrium-services', label: 'Services' },
				{ id: 'quilibrium-interfaces', label: 'Node interfaces' },
				{ id: 'quilibrium-consensus', label: 'Consensus' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Protocol</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionQuilibriumProtocol()}
				<ResourceBoundary resource={quilibriumNetwork}>
					{#snippet children(quilibriumNetwork)}
						{#if quilibriumNetwork.fields.$protocolDocument != null}
							<p>
								<strong>Protocol document:</strong>
								{quilibriumNetwork.fields.$protocolDocument[EntityMetaKey.Id].category}
								{quilibriumNetwork.fields.$protocolDocument[EntityMetaKey.Id].number}
							</p>
						{/if}

						{#each quilibriumNetwork.fields.protocolFacts?.values ?? [] as fact}
							<p><strong>{fact.label}:</strong> {fact.value}</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionQuilibriumServices()}
				<ResourceBoundary resource={quilibriumNetwork}>
					{#snippet children(quilibriumNetwork)}
						{#each quilibriumNetwork.fields.serviceLayers?.values ?? [] as serviceLayer}
							<p><strong>{serviceLayer.label}:</strong> {serviceLayer.description}</p>
						{:else}
							<p data-text="muted">No service layers listed for this network yet.</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionQuilibriumInterfaces()}
				<ResourceBoundary resource={quilibriumNetwork}>
					{#snippet children(quilibriumNetwork)}
						{#each quilibriumNetwork.fields.nodeInterfaces?.values ?? [] as nodeInterface}
							<p><strong>{nodeInterface.label}:</strong> {nodeInterface.transportType} on port {nodeInterface.port}</p>
						{:else}
							<p data-text="muted">No node interfaces listed for this network yet.</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionQuilibriumConsensus()}
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							{#if (network.fields.$$consensusMechanisms?.values.length ?? 0) > 0}
								<p><strong>Consensus mechanisms:</strong> {network.fields.$$consensusMechanisms?.values.length ?? 0}</p>
							{:else}
								<p data-text="muted">No consensus mechanisms mapped for this network yet.</p>
							{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-quilibrium-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'quilibrium-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
				>
				{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
				{/snippet}

				{#snippet SectionQuilibriumAssetsNative({ id, label }: { id: string, label: string })}
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
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-quilibrium-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'quilibrium-resources-faucets', label: 'Faucets' },
				{ id: 'quilibrium-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionQuilibriumResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionQuilibriumResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
