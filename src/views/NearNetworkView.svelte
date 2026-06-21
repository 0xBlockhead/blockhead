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
		selection: EntityProxyResource<typeof schema, EntityType.NearNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const network = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			slug: true,
			name: true,
			environment: true,
			rpcEndpoints: true,
			$$blocks: {
				limit: 1,
			},
			$$timestamps: {
				limit: 1,
			},
		},
	}))


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
	import NearBlockView from '$/views/NearBlockView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span>{selection.entitySelector.slug}</span>
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
		<p>NEAR models Nightshade sharding, account IDs, access keys, receipts, chunks, and execution outcomes.</p>
	{/snippet}

	{#snippet Content({ open })}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				{@const block = network.$$blocks?.values.at(0)}
				<dl class="network-summary-head" data-column-item="center">
					{#if block != null}
						<div>
							<dt>Head block</dt>
							<dd id="network-summary-head-block">
								<NearBlockView
									selection={select(EntityType.NearBlock, block[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if network.environment !== undefined}
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.rpcEndpoints?.values.length ?? 0}</dd>
						</div>
					{/if}

					<ResourceBoundary
						resource={select(EntityType.Network, selection.entitySelector, {
							sources: [
								Source.Constants_Internal,
							],
							fields: {
								$$nativeAssets: true,
							},
						})}
					>
						{#snippet children(baseNetwork)}
							{@const nativeAssetCount = baseNetwork.$$nativeAssets?.values.length ?? 0}
							{#if nativeAssetCount > 0}
								<div>
									<dt>Native asset</dt>
									<dd>{nativeAssetCount}</dd>
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
			id={`${networkSelectorKey}:carousel-near`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'near-blocks', label: 'Blocks' },
				{ id: 'near-snapshots', label: 'Network snapshots' },
				{ id: 'near-validators', label: 'Validators' },
				{ id: 'near-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>NEAR</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearBlocks({ id, label }: { id: string, label: string })}
				<NearBlocksView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$blocks}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearSnapshots({ id, label }: { id: string, label: string })}
				<NearNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$timestamps}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearValidators({ id, label }: { id: string, label: string })}
				<NearValidatorsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$validators}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Constants_Internal,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.NearNetwork}
					parentEntitySelector={selection.entitySelector}
					parentEntityType={EntityType.NearNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-near-assets`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'near-assets-native', label: 'Native coin' },
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

			{#snippet SectionNearAssetsNative({ id, label }: { id: string, label: string })}
				<AssetInstancesView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.Network,
			selection.entitySelector
		).$$nativeAssets}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-near-resources`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'near-resources-faucets', label: 'Faucets' },
				{ id: 'near-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionNearResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					selection={select(
			EntityType.Network,
			selection.entitySelector
		).$$faucetUrls}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					selection={select(
			EntityType.Network,
			selection.entitySelector
		).$$blockExplorerUrls}
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
