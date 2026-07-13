<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TonNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const tonNetwork = $derived(selection({}))
	const titleFallback = $derived('TON network')
	const viewDomId = $derived('ton-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonNetwork_TimestampsView from '$/views/TonNetwork_TimestampsView.svelte'
	import TonWorkchainsView from '$/views/TonWorkchainsView.svelte'
	import TonBlocksView from '$/views/TonBlocksView.svelte'
	import TonTransactionsView from '$/views/TonTransactionsView.svelte'
	import TonTracesView from '$/views/TonTracesView.svelte'
	import TonAccountsView from '$/views/TonAccountsView.svelte'
	import TonContractsView from '$/views/TonContractsView.svelte'
	import TonMessagesView from '$/views/TonMessagesView.svelte'
	import TonJettonsView from '$/views/TonJettonsView.svelte'
	import TonNftCollectionsView from '$/views/TonNftCollectionsView.svelte'
	import TonNftItemsView from '$/views/TonNftItemsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tonNetwork}>
			{#snippet Pending()}
				{[pendingEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'TON network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[resolvedEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-chain-observations',
							label: 'Observations',
						},
						{
							id: 'ton-chain-workchains',
							label: 'Workchains',
						},
						{
							id: 'ton-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'ton-chain-transactions',
							label: 'Transactions',
						},
						{
							id: 'ton-chain-traces',
							label: 'Traces',
						},
					]
				}
				data-card
				class='network-view-collapsible-chain-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTonChainObservations({ id, label, open })}
					<TonNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonChainWorkchains({ id, label, open })}
					<TonWorkchainsView
						selection={selection.$$workchains}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON workchains.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonChainBlocks({ id, label, open })}
					<TonBlocksView
						selection={selection.$$blocks}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonChainTransactions({ id, label, open })}
					<TonTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonChainTraces({ id, label, open })}
					<TonTracesView
						selection={selection.$$traces}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON traces.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-accounts-contracts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-accounts',
							label: 'Accounts',
						},
						{
							id: 'ton-contracts',
							label: 'Contracts',
						},
						{
							id: 'ton-messages',
							label: 'Messages',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-contracts'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and contracts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTonAccounts({ id, label, open })}
					<TonAccountsView
						selection={selection.$$accounts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonContracts({ id, label, open })}
					<TonContractsView
						selection={selection.$$contracts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON contracts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonMessages({ id, label, open })}
					<TonMessagesView
						selection={selection.$$messages}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON messages.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-assets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-jettons',
							label: 'Jettons',
						},
						{
							id: 'ton-nft-collections',
							label: 'NFT collections',
						},
						{
							id: 'ton-nft-items',
							label: 'NFT items',
						},
					]
				}
				data-card
				class='network-view-collapsible-assets'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Jettons and NFTs</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTonJettons({ id, label, open })}
					<TonJettonsView
						selection={selection.$$jettons}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON jettons.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonNftCollections({ id, label, open })}
					<TonNftCollectionsView
						selection={selection.$$nftCollections}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON NFT collections.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonNftItems({ id, label, open })}
					<TonNftItemsView
						selection={selection.$$nftItems}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No TON NFT items.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
