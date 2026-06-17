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
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.SolanaNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = $derived(proxy(EntityType.SolanaNetwork, selector, ({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true, name: true, environment: true, rpcEndpoints: true, $$blocks: ({ limit: 1 }), $$accounts: ({ limit: 16 }), $$timestamps: ({ limit: 1 }) } })))

	


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
	entitySelector={selector}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span>{selector.caip2.namespace}:{selector.caip2.reference}</span>
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
								{@const block = network.fields.$$blocks?.values.at(0)}
								{#if block != null}
									<SolanaBlockView
										selector={block[EntityMetaKey.Selector]}
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
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

					{#if open}
						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.fields.rpcEndpoints?.values.length ?? 0}</dd>
						</div>

						{#if network.fields.$$accounts != null}
							<div>
								<dt>Recent accounts</dt>
								<dd>{network.fields.$$accounts?.values.length}</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>

				<ResourceBoundary resource={proxy(EntityType.Network, selector, ({ sources: [
						Source.Constants_Internal,
					], fields: { $$nativeAssets: true } }))}>
					{#snippet children(baseNetwork)}
						{@const nativeAssetCount = baseNetwork.fields.$$nativeAssets?.values.length ?? 0}
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
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						selector,
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
						selector,
						fieldName: '$$transactions',
					}}
					href={href == null ? '' : `${href}/transactions`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaAccounts({ id, label }: { id: string, label: string })}
				<SolanaAccountsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						selector,
						fieldName: '$$accounts',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSolanaNetworkSnapshots({ id, label }: { id: string, label: string })}
				<SolanaNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						selector,
						fieldName: '$$timestamps',
					}}
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
					parentEntitySelector={selector}
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
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						selector,
						fieldName: '$$validators',
					}}
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
					entityFieldReference={{
						entityType: EntityType.Network,
						selector,
						fieldName: '$$nativeAssets',
					}}
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
					entityFieldReference={{
						entityType: EntityType.Network,
						selector,
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

			{#snippet SectionSolanaResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						selector,
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
