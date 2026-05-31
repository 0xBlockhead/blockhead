<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
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

	const tronNetwork = useEntity(
		EntityType.TronNetwork,
		entityId,
		{
			$: [
				Source.TronGrid_Rest,
			],
			restEndpoints: {},
			$headBlock: {},
			$$timestamps: {
				$limit: 1,
			},
		},
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
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
		<p>TRON models TVM contracts, blocks, witnesses, and delegated proof-of-stake state.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={tronNetwork}>
						{#snippet children(tronNetwork)}
							{#if tronNetwork.$headBlock != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<TronBlockView
											entityId={tronNetwork.$headBlock[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
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
			id={`${networkIdKey}:carousel-tron`}
			sectionIdPrefix={networkIdKey}
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
						entityId,
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
						entityId,
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
						entityId,
						fieldName: '$$witnesses',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionTronEndpoints()}
				<ResourceBoundary resource={tronNetwork}>
					{#snippet children(tronNetwork)}
						{#each tronNetwork.restEndpoints as endpoint}
							<p><strong>{endpoint.transportType}:</strong> {endpoint.url}</p>
						{:else}
							<p data-text="muted">No REST endpoints listed for this network yet.</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-tron-assets`}
			sectionIdPrefix={networkIdKey}
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
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.AssetInstance}
							getKey={(asset) => `${asset[EntityMetaKey.Id].kind}:${asset[EntityMetaKey.Id].assetKey}`}
							id={`${id}-list`}
							items={network.$$nativeAssets}
							title={label}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">No native assets mapped for this network yet.</p>
							{/snippet}
							{#snippet Item(context)}
								<AssetInstanceView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-tron-resources`}
			sectionIdPrefix={networkIdKey}
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

			{#snippet SectionTronResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
