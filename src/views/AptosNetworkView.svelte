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
			selection: EntityProxyResource<typeof schema, EntityType.AptosNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosNetwork>>
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
	const aptosNetwork = $derived(selection({}))
	const titleFallback = $derived('aptos network')
	const viewDomId = $derived('aptos-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AptosNetwork_TimestampsView from '$/views/AptosNetwork_TimestampsView.svelte'
	import AptosBlocksView from '$/views/AptosBlocksView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosEventsView from '$/views/AptosEventsView.svelte'
	import AptosAccountsView from '$/views/AptosAccountsView.svelte'
	import MoveModulesView from '$/views/MoveModulesView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosNetwork}>
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
				id={viewDomId + '-carousel-aptos-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'aptos-chain-observations',
							label: 'Observations',
						},
						{
							id: 'aptos-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'aptos-chain-transactions',
							label: 'Transactions',
						},
						{
							id: 'aptos-chain-events',
							label: 'Events',
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

				{#snippet SectionAptosChainObservations({ id, label, open })}
					<AptosNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosChainBlocks({ id, label, open })}
					<AptosBlocksView
						selection={
							selection.$$blocks({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosChainTransactions({ id, label, open })}
					<AptosTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosChainEvents({ id, label, open })}
					<AptosEventsView
						selection={
							selection.$$events({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos events.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-aptos-accounts-modules'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'aptos-accounts',
							label: 'Accounts',
						},
						{
							id: 'aptos-modules',
							label: 'Move modules',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-modules'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and modules</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAptosAccounts({ id, label, open })}
					<AptosAccountsView
						selection={
							selection.$$accounts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosModules({ id, label, open })}
					<MoveModulesView
						selection={
							selection.$$modules({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos Move modules.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-aptos-balances'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'aptos-coin-balances',
							label: 'Coin balances',
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
						<HeadingComponent>Balances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAptosCoinBalances({ id, label, open })}
					<AptosCoinBalance_TimestampsView
						selection={
							selection.$$coinBalanceTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Aptos coin balance observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
