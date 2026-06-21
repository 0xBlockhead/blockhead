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
		selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork>
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
			$$accounts: {
				limit: 16,
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
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import SolanaNetwork_TimestampsView from '$/views/SolanaNetwork_TimestampsView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork}
	entitySelector={selection.entitySelector}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span>{selection.entitySelector.caip2.namespace}:{selection.entitySelector.caip2.reference}</span>
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

	{#snippet Content({ open })}
		<dl class="network-summary-head" data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd id="network-summary-head-block">
					<ResourceBoundary resource={network} placeholderText="Loading head slot…">
						{#snippet children(network)}
							{@const block = network.$$blocks?.values.at(0)}
							{#if block != null}
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, block[EntityMetaKey.Selector])}
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

						{@const accountCount = network.$$accounts?.values.length ?? 0}
						{#if accountCount}
							<div>
								<dt>Recent accounts</dt>
								<dd>{accountCount}</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>

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

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-solana`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'solana-blocks', label: 'Blocks' },
				{ id: 'solana-transactions', label: 'Transactions' },
				{ id: 'solana-accounts', label: 'Accounts' },
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
					selection={selection.$$blocks}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaTransactions({ id, label }: { id: string, label: string })}
				<SolanaTransactionsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$transactions}
					href={href == null ? '' : `${href}/transactions`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaAccounts({ id, label }: { id: string, label: string })}
				<SolanaAccountsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$accounts}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaNetworkSnapshots({ id, label }: { id: string, label: string })}
				<SolanaNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$timestamps}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Constants_Internal,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.SolanaNetwork}
					parentEntitySelector={selection.entitySelector}
					parentEntityType={EntityType.SolanaNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-consensus`}
			sectionIdPrefix={networkSelectorKey}
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
					selection={selection.$$validators}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-assets`}
			sectionIdPrefix={networkSelectorKey}
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
			id={`${networkSelectorKey}:carousel-resources`}
			sectionIdPrefix={networkSelectorKey}
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

			{#snippet SectionSolanaResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
