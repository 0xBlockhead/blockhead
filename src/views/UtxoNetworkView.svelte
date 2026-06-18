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
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.UtxoNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = $derived(
		select(
			EntityType.Network,
			selector.$network,
			{
				sources: [
					Source.Constants_Internal,
				],
			},
		),
	)

	const utxoNetwork = $derived(
		select(
			EntityType.UtxoNetwork,
			selector,
			{
				sources: [
					Source.Blockchair_Rest,
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
					Source.BitcoinCore_JsonRpc,
					Source.LitecoinCore_JsonRpc,
					Source.DogecoinCore_JsonRpc,
					Source.BitcoinCashNode_JsonRpc,
					Source.Zcashd_JsonRpc,
				],
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
	import NumberValue from '$/views/NumberValue.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
	import UtxoNetwork_TimestampsView from '$/views/UtxoNetwork_TimestampsView.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
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
		<ResourceBoundary resource={network.slug}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(slug)}
				<span>{slug}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network.name}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(name)}
				{name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>UTXO models proof-of-work blocks and spendable outputs rather than base-layer accounts.</p>
	{/snippet}

	{#snippet Content()}
		<dl class="network-summary-head" data-column-item="center">
			<ResourceBoundary resource={
		utxoNetwork.$$blocks({
			limit: 1,
		})
	}>
				{#snippet children(blocks)}
					{#if blocks.values.at(0) != null}
						<div>
							<dt>Head block</dt>
							<dd id="network-summary-head-block">
								<UtxoBlockView
									selector={blocks.values.at(0)[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={
		utxoNetwork.$$timestamps({
			limit: 1,
			fields: {
				suggestedTransactionFeePerByteSats: true,
			},
		})
	}>
				{#snippet children(timestamps)}
					{#if timestamps.values.at(0)?.suggestedTransactionFeePerByteSats != null}
						<div>
							<dt>Suggested fee</dt>
							<dd><NumberValue value={timestamps.values.at(0).suggestedTransactionFeePerByteSats} /> sat/vB</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={network.environment}>
				{#snippet children(environment)}
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[environment].label}</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network.$$nativeAssets}>
				{#snippet children(nativeAssets)}
					{#if nativeAssets.values.length > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{nativeAssets.values.length}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-utxo`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'utxo-blocks', label: 'Blocks' },
				{ id: 'utxo-transactions', label: 'Transactions' },
				{ id: 'utxo-mempool-fees', label: 'Mempool & fees' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>UTXO</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionUtxoBlocks({ id, label }: { id: string, label: string })}
				<UtxoBlocksView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.UtxoNetwork,
			selector
		).$$blocks}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactions({ id, label }: { id: string, label: string })}
				<UtxoTransactionsView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.UtxoNetwork,
			selector
		).$$transactions}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionUtxoMempoolFees({ id, label }: { id: string, label: string })}
				<UtxoNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.UtxoNetwork,
			selector
		).$$timestamps}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-assets`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'utxo-assets-native', label: 'Native coin' },
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

			{#snippet SectionUtxoAssetsNative({ id, label }: { id: string, label: string })}
				<AssetInstancesView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.Network,
			selector.$network
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
				{ id: 'utxo-resources-faucets', label: 'Faucets' },
				{ id: 'utxo-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionUtxoResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					selection={select(
			EntityType.Network,
			selector.$network
		).$$faucetUrls}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionUtxoResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					selection={select(
			EntityType.Network,
			selector.$network
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
