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
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.TronNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = $derived(
		subscribe(
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

	const tronNetwork = $derived(
		subscribe(
			EntityType.TronNetwork,
			selector,
			{
				sources: [
					Source.TronGrid_Rest,
				],
				fields: {
					restEndpoints: true,
					$$blocks: {
						limit: 1,
					},
					$$timestamps: {
						limit: 1,
					},
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
	import TronBlockView from '$/views/TronBlockView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
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
		<p>TRON models TVM contracts, blocks, witnesses, and delegated proof-of-stake state.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={tronNetwork}>
						{#snippet children(tronNetwork)}
							{@const block = tronNetwork.fields.$$blocks?.values.at(0)}
							{#if block != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<TronBlockView
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
			id={`${networkSelectorKey}:carousel-tron`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'tron-blocks', label: 'Blocks' },
				{ id: 'tron-snapshots', label: 'Network snapshots' },
				{ id: 'tron-witnesses', label: 'Witnesses' },
				{ id: 'tron-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>TRON</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTronBlocks({ id, label }: { id: string, label: string })}
				<TronBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.TronNetwork,
						selector,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionTronSnapshots({ id, label }: { id: string, label: string })}
				<TronNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.TronNetwork,
						selector,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionTronWitnesses({ id, label }: { id: string, label: string })}
				<TronWitnessesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.TronNetwork,
						selector,
						fieldName: '$$witnesses',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionTronEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['restEndpoints']}
					emptyText="No REST endpoints listed for this network yet."
					fieldSources={[
						Source.TronGrid_Rest,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.TronNetwork}
					parentEntitySelector={selector}
					parentEntityType={EntityType.TronNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-tron-assets`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'tron-assets-native', label: 'Native coin' },
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

			{#snippet SectionTronAssetsNative({ id, label }: { id: string, label: string })}
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
			id={`${networkSelectorKey}:carousel-tron-resources`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'tron-resources-faucets', label: 'Faucets' },
				{ id: 'tron-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionTronResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionTronResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
