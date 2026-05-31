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
		entityId: EntityId<typeof schema, EntityType.SolanaNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.SolanaNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			slug: {},
			name: {},
			environment: {},
			rpcEndpoints: {},
			$headBlock: {},
			$$timestamps: {
				$limit: 1,
			},
		},
	)

	const baseNetwork = useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			$$nativeAssets: {},
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
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import SolanaNetwork_TimestampsView from '$/views/SolanaNetwork_TimestampsView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span>{entityId.caip2.namespace}:{entityId.caip2.reference}</span>
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
		<p>
			Solana is a parallel account-based runtime using slots, leaders, SVM programs, and proof-of-history timing.
		</p>
	{/snippet}

	{#snippet Content(context)}
		<dl class="network-summary-head" data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd id="network-summary-head-block">
					<ResourceBoundary resource={network} placeholderText="Loading head slot…">
						{#snippet children(network)}
							{#if network.$headBlock != null}
								<SolanaBlockView
									entityId={network.$headBlock[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
					</div>

					{#if context?.open}
						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.rpcEndpoints.length}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={baseNetwork}>
				{#snippet children(baseNetwork)}
					{#if baseNetwork.$$nativeAssets.length > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{baseNetwork.$$nativeAssets.length}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-solana`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-blocks', label: 'Blocks' },
				{ id: 'solana-transactions', label: 'Transactions' },
				{ id: 'solana-network-snapshots', label: 'Network snapshots' },
				{ id: 'solana-endpoints', label: 'Endpoints' },
			]}
			data-card
			class="network-view-collapsible-execution"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSolanaBlocks({ id, label }: { id: string, label: string })}
				<SolanaBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaTransactions({ id, label }: { id: string, label: string })}
				<SolanaTransactionsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId,
						fieldName: '$$transactions',
					}}
					href={href == null ? '' : `${href}/transactions`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaNetworkSnapshots({ id, label }: { id: string, label: string })}
				<SolanaNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaEndpoints({ id, label }: { id: string, label: string })}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.SolanaNetwork}
							getKey={(endpoint) => endpoint.url}
							id={`${id}-list`}
							items={network.rpcEndpoints}
							title={label}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">No RPC endpoints listed for this network yet.</p>
							{/snippet}

							{#snippet Item({ item: endpoint })}
								<div class="entity-details">
									<dl data-column-item="center">
										<div>
											<dt>URL</dt>
											<dd><code>{endpoint.url}</code></dd>
										</div>

										<div>
											<dt>Transport</dt>
											<dd>{endpoint.transportType}</dd>
										</div>

										{#if endpoint.providerName}
											<div>
												<dt>Provider</dt>
												<dd>{endpoint.providerName}</dd>
											</div>
										{/if}
									</dl>
								</div>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-consensus`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-validators', label: 'Validators' },
			]}
			data-card
			class="network-view-collapsible-consensus"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus &amp; Block Production</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSolanaValidators({ id, label }: { id: string, label: string })}
				<SolanaValidatorsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId,
						fieldName: '$$validators',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-assets-native', label: 'Native coin' },
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

			{#snippet SectionSolanaAssetsNative({ id, label }: { id: string, label: string })}
				<ResourceBoundary resource={baseNetwork}>
					{#snippet children(baseNetwork)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.AssetInstance}
							getKey={(asset) => `${asset[EntityMetaKey.Id].kind}:${asset[EntityMetaKey.Id].assetKey}`}
							id={`${id}-list`}
							items={baseNetwork.$$nativeAssets}
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
			id={`${networkIdKey}:carousel-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-resources-faucets', label: 'Faucets' },
				{ id: 'solana-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionSolanaResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionSolanaResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
