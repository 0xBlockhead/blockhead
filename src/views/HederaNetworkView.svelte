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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNetwork>>
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
	const hederaNetwork = $derived(selection({
		fields: {
			shard: true,
			realm: true,
		},
	}))
	const titleFallback = $derived('hedera network')
	const viewDomId = $derived('hedera-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaNetwork_TimestampsView from '$/views/HederaNetwork_TimestampsView.svelte'
	import HederaBlocksView from '$/views/HederaBlocksView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import HederaAccountsView from '$/views/HederaAccountsView.svelte'
	import HederaTokensView from '$/views/HederaTokensView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaContractsView from '$/views/HederaContractsView.svelte'
	import HederaTopicsView from '$/views/HederaTopicsView.svelte'
	import HederaSchedulesView from '$/views/HederaSchedulesView.svelte'
	import HederaNodesView from '$/views/HederaNodesView.svelte'
	import HederaNetworkFee_TimestampsView from '$/views/HederaNetworkFee_TimestampsView.svelte'
	import HederaNetworkExchangeRate_TimestampsView from '$/views/HederaNetworkExchangeRate_TimestampsView.svelte'
	import HederaNetworkStake_TimestampsView from '$/views/HederaNetworkStake_TimestampsView.svelte'
	import HederaNetworkSupply_TimestampsView from '$/views/HederaNetworkSupply_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetwork}>
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
		<ResourceBoundary resource={hederaNetwork}>
			{#snippet Pending()}
				{[String((pendingEntity.shard) ?? ''), String((pendingEntity.realm) ?? '')].filter(Boolean).join(' ') || title || 'hedera network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.shard) ?? ''), String((resolvedEntity.realm) ?? '')].filter(Boolean).join(' ') || titleFallback}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shard: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shard = pendingEntity.shard}
					{#if shard !== undefined && shard !== null}
						<div>
							<dt>shard</dt>
							<dd>
								<NumberValue value={Number(shard)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shard = resolvedEntity.shard}
					{#if shard !== undefined && shard !== null}
						<div>
							<dt>shard</dt>
							<dd>
								<NumberValue value={Number(shard)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							realm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const realm = pendingEntity.realm}
					{#if realm !== undefined && realm !== null}
						<div>
							<dt>realm</dt>
							<dd>
								<NumberValue value={Number(realm)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const realm = resolvedEntity.realm}
					{#if realm !== undefined && realm !== null}
						<div>
							<dt>realm</dt>
							<dd>
								<NumberValue value={Number(realm)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-chain-observations',
							label: 'Observations',
						},
						{
							id: 'hedera-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'hedera-chain-transactions',
							label: 'Transactions',
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

				{#snippet SectionHederaChainObservations({ id, label, open })}
					<HederaNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaChainBlocks({ id, label, open })}
					<HederaBlocksView
						selection={selection.$$blocks}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaChainTransactions({ id, label, open })}
					<HederaTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-accounts-tokens'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-accounts',
							label: 'Accounts',
						},
						{
							id: 'hedera-tokens',
							label: 'Tokens',
						},
						{
							id: 'hedera-nfts',
							label: 'NFTs',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-tokens'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and tokens</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHederaAccounts({ id, label, open })}
					<HederaAccountsView
						selection={selection.$$accounts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaTokens({ id, label, open })}
					<HederaTokensView
						selection={selection.$$tokens}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera tokens.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaNfts({ id, label, open })}
					<HederaNftsView
						selection={selection.$$nfts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera NFTs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-contracts-messaging'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-contracts',
							label: 'Contracts',
						},
						{
							id: 'hedera-topics',
							label: 'Topics',
						},
						{
							id: 'hedera-schedules',
							label: 'Schedules',
						},
					]
				}
				data-card
				class='network-view-collapsible-contracts-messaging'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Contracts and messaging</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHederaContracts({ id, label, open })}
					<HederaContractsView
						selection={selection.$$contracts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera contracts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaTopics({ id, label, open })}
					<HederaTopicsView
						selection={selection.$$topics}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera topics.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaSchedules({ id, label, open })}
					<HederaSchedulesView
						selection={selection.$$schedules}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera schedules.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-nodes'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-network-nodes',
							label: 'Nodes',
						},
					]
				}
				data-card
				class='network-view-collapsible-nodes'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Nodes</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHederaNetworkNodes({ id, label, open })}
					<HederaNodesView
						selection={selection.$$nodes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera nodes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-network-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-fee-observations',
							label: 'Fees',
						},
						{
							id: 'hedera-exchange-observations',
							label: 'Exchange rates',
						},
						{
							id: 'hedera-stake-observations',
							label: 'Stake',
						},
						{
							id: 'hedera-supply-observations',
							label: 'Supply',
						},
					]
				}
				data-card
				class='network-view-collapsible-network-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Fees, exchange, stake, and supply</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHederaFeeObservations({ id, label, open })}
					<HederaNetworkFee_TimestampsView
						selection={selection.$$feeTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera fee observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaExchangeObservations({ id, label, open })}
					<HederaNetworkExchangeRate_TimestampsView
						selection={selection.$$exchangeRateTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera exchange-rate observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaStakeObservations({ id, label, open })}
					<HederaNetworkStake_TimestampsView
						selection={selection.$$stakeTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera stake observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaSupplyObservations({ id, label, open })}
					<HederaNetworkSupply_TimestampsView
						selection={selection.$$supplyTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Hedera supply observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
