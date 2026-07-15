<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.XrplNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.XrplNetwork>>
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
	const xrplNetwork = $derived(selection({}))
	const titleFallback = $derived('XRPL network')
	const viewDomId = $derived('xrpl-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import XrplNetwork_TimestampsView from '$/views/XrplNetwork_TimestampsView.svelte'
	import XrplLedgersView from '$/views/XrplLedgersView.svelte'
	import XrplTransactionsView from '$/views/XrplTransactionsView.svelte'
	import XrplAccountsView from '$/views/XrplAccountsView.svelte'
	import XrplLedgerEntriesView from '$/views/XrplLedgerEntriesView.svelte'
	import XrplAmmsView from '$/views/XrplAmmsView.svelte'
	import XrplAmendmentsView from '$/views/XrplAmendmentsView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplNetwork}>
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
		<ResourceBoundary resource={xrplNetwork}>
			{#snippet Pending()}
				{[pendingEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'XRPL network'}
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
				id={viewDomId + '-carousel-xrpl-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'xrpl-chain-observations',
							label: 'Observations',
						},
						{
							id: 'xrpl-chain-ledgers',
							label: 'Ledgers',
						},
						{
							id: 'xrpl-chain-transactions',
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

				{#snippet SectionXrplChainObservations({ id, label, open })}
					<XrplNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionXrplChainLedgers({ id, label, open })}
					<XrplLedgersView
						selection={
							selection.$$ledgers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL ledgers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionXrplChainTransactions({ id, label, open })}
					<XrplTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-xrpl-accounts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'xrpl-account-list',
							label: 'Accounts',
						},
						{
							id: 'xrpl-ledger-entries',
							label: 'Ledger entries',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and ledger entries</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionXrplAccountList({ id, label, open })}
					<XrplAccountsView
						selection={
							selection.$$accounts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionXrplLedgerEntries({ id, label, open })}
					<XrplLedgerEntriesView
						selection={
							selection.$$ledgerEntries({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL ledger entries.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-xrpl-amm-amendments'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'xrpl-amms',
							label: 'AMMs',
						},
						{
							id: 'xrpl-amendments',
							label: 'Amendments',
						},
					]
				}
				data-card
				class='network-view-collapsible-amm-amendments'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>AMMs and amendments</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionXrplAmms({ id, label, open })}
					<XrplAmmsView
						selection={
							selection.$$amms({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL AMMs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionXrplAmendments({ id, label, open })}
					<XrplAmendmentsView
						selection={
							selection.$$amendments({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No XRPL amendments.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
