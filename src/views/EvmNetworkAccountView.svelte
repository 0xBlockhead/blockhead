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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkAccount>>
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
	const evmNetworkAccount = $derived(selection({}))
	const titleFallback = $derived('EVM network account')
	const viewDomId = $derived('evm-network-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmActorCoinAllowancesView from '$/views/EvmActorCoinAllowancesView.svelte'
	import EvmNetworkAccount_TimestampsView from '$/views/EvmNetworkAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkAccount}>
			{#snippet Pending()}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkAccount}>
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
					layout={EntityLayout.Value}
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
					layout={EntityLayout.Value}
					open={false}
				/>
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

			<div>
				<dt>actor</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
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
				id={viewDomId + '-carousel-evm-network-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-network-account-transactions',
							label: 'Transactions',
						},
						{
							id: 'evm-network-account-token-transfers',
							label: 'Token transfers',
						},
						{
							id: 'evm-network-account-internal-transfers',
							label: 'Internal transfers',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmNetworkAccountTransactions({ id, label, open })}
					<EvmTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmNetworkAccountTokenTransfers({ id, label, open })}
					<EvmTokenTransfersView
						selection={selection.$$tokenTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No token transfers yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmNetworkAccountInternalTransfers({ id, label, open })}
					<EvmInternalTransfersView
						selection={selection.$$internalTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No internal transfers yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-network-account-balances'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-network-account-owned-coins',
							label: 'Owned coins',
						},
						{
							id: 'evm-network-account-allowances',
							label: 'Allowances',
						},
					]
				}
				data-card
				class='network-view-collapsible-balances'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balances and allowances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmNetworkAccountOwnedCoins({ id, label, open })}
					<EvmNetworkActorCoinBalancesView
						selection={selection.$$ownedCoins}
						href={resolve('/~/accounts/balances')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No owned coins yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmNetworkAccountAllowances({ id, label, open })}
					<EvmActorCoinAllowancesView
						selection={selection.$$erc20TokenAllowances}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No allowances yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-network-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-network-account-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmNetworkAccountTimestamps({ id, label, open })}
					<EvmNetworkAccount_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No account observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
