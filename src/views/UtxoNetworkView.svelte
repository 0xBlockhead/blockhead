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
		selector: EntitySelector<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = subscribe(EntityType.Network,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true, name: true, environment: true, $$nativeAssets: true } }),
	)

	const utxoNetwork = subscribe(EntityType.UtxoNetwork,
		selector,
		({ sources: [
				Source.Blockchair_Rest,
				Source.Esplora_Rest,
				Source.MempoolSpace_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
				Source.BitcoinCashNode_JsonRpc,
				Source.Zcashd_JsonRpc,
			], fields: { $$blocks: ({ limit: 1 }), $$timestamps: ({ limit: 1, fields: { suggestedTransactionFeePerByteSats: true } }) } }),
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
	entitySelector={selector}
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
		<p>UTXO models proof-of-work blocks and spendable outputs rather than base-layer accounts.</p>
	{/snippet}

	{#snippet Content()}
			<ResourceBoundary resource={utxoNetwork}>
				{#snippet children(utxoNetwork)}
					{@const block = utxoNetwork.fields.$$blocks?.values.at(0)}
					{@const timestamp = utxoNetwork.fields.$$timestamps?.values.at(0)}
					<dl class="network-summary-head" data-column-item="center">
						{#if block != null}
							<div>
								<dt>Head block</dt>
								<dd id="network-summary-head-block">
									<UtxoBlockView
										selector={block[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
									/>
								</dd>
							</div>
						{/if}

						{#if timestamp?.suggestedTransactionFeePerByteSats != null}
							<div>
								<dt>Suggested fee</dt>
								<dd><NumberValue value={timestamp.suggestedTransactionFeePerByteSats} /> sat/vB</dd>
							</div>
						{/if}
					</dl>
			{/snippet}
		</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					{@const nativeAssetCount = network.fields.$$nativeAssets?.values.length ?? 0}
					<dl data-column-item="center">
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
						</div>

						{#if nativeAssetCount > 0}
							<div>
								<dt>Native asset</dt>
								<dd>{nativeAssetCount}</dd>
							</div>
						{/if}
					</dl>
			{/snippet}
		</ResourceBoundary>
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
					entityFieldReference={{
						entityType: EntityType.UtxoNetwork,
						selector,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactions({ id, label }: { id: string, label: string })}
				<UtxoTransactionsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.UtxoNetwork,
						selector,
						fieldName: '$$transactions',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionUtxoMempoolFees({ id, label }: { id: string, label: string })}
				<UtxoNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.UtxoNetwork,
						selector,
						fieldName: '$$timestamps',
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

			{#snippet SectionUtxoResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
