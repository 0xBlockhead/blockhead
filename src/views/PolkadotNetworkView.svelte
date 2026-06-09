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
			], fields: { slug: true, name: true, environment: true, $$nativeAssets: true } }),
	)

	const polkadotNetwork = useEntity(entityCollectionsContext, EntityType.PolkadotNetwork,
		entityId,
		({ sources: [
				Source.Polkadot_JsonRpc,
				Source.SubstrateSidecar_Rest,
			], fields: { rpcEndpoints: true, $$blocks: ({ limit: 1 }), $$timestamps: ({ limit: 1 }) } }),
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
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import PolkadotNetwork_TimestampsView from '$/views/PolkadotNetwork_TimestampsView.svelte'
	import PolkadotValidatorsView from '$/views/PolkadotValidatorsView.svelte'
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
		<p>Polkadot models relay-chain runtime blocks, extrinsics, events, pallets, validators, and NPoS consensus.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
						<ResourceBoundary resource={polkadotNetwork}>
							{#snippet children(polkadotNetwork)}
								{@const block = polkadotNetwork.fields.$$blocks?.values.at(0)}
								{#if block != null}
									<div>
										<dt>Head block</dt>
										<dd id="network-summary-head-block">
											<PolkadotBlockView
												entityId={block[EntityMetaKey.Id]}
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
			id={`${networkIdKey}:carousel-polkadot`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'polkadot-blocks', label: 'Blocks' },
				{ id: 'polkadot-runtime', label: 'Runtime snapshots' },
				{ id: 'polkadot-validators', label: 'Validators' },
				{ id: 'polkadot-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Polkadot</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionPolkadotBlocks({ id, label }: { id: string, label: string })}
				<PolkadotBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.PolkadotNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionPolkadotRuntime({ id, label }: { id: string, label: string })}
				<PolkadotNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.PolkadotNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionPolkadotValidators({ id, label }: { id: string, label: string })}
				<PolkadotValidatorsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.PolkadotNetwork,
						entityId,
						fieldName: '$$validators',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionPolkadotEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Polkadot_JsonRpc,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.PolkadotNetwork}
					parentEntityId={entityId}
					parentEntityType={EntityType.PolkadotNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-polkadot-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'polkadot-assets-native', label: 'Native coin' },
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

			{#snippet SectionPolkadotAssetsNative({ id, label }: { id: string, label: string })}
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
			id={`${networkIdKey}:carousel-polkadot-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'polkadot-resources-faucets', label: 'Faucets' },
				{ id: 'polkadot-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionPolkadotResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionPolkadotResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
