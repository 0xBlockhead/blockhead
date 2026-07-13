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
			selection: EntityProxyResource<typeof schema, EntityType.SuiNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiNetwork>>
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
	const suiNetwork = $derived(selection({}))
	const titleFallback = $derived('Sui network')
	const viewDomId = $derived('sui-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import SuiNetwork_TimestampsView from '$/views/SuiNetwork_TimestampsView.svelte'
	import SuiCheckpointsView from '$/views/SuiCheckpointsView.svelte'
	import SuiTransactionsView from '$/views/SuiTransactionsView.svelte'
	import SuiObjectsView from '$/views/SuiObjectsView.svelte'
	import SuiPackagesView from '$/views/SuiPackagesView.svelte'
	import SuiAccountsView from '$/views/SuiAccountsView.svelte'
	import SuiCoinTypesView from '$/views/SuiCoinTypesView.svelte'
	import SuiCoinBalance_TimestampsView from '$/views/SuiCoinBalance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiNetwork}>
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
		<ResourceBoundary resource={suiNetwork}>
			{#snippet Pending()}
				{[pendingEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'Sui network'}
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
				id={viewDomId + '-carousel-sui-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'sui-chain-observations',
							label: 'Observations',
						},
						{
							id: 'sui-chain-checkpoints',
							label: 'Checkpoints',
						},
						{
							id: 'sui-chain-transactions',
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

				{#snippet SectionSuiChainObservations({ id, label, open })}
					<SuiNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiChainCheckpoints({ id, label, open })}
					<SuiCheckpointsView
						selection={selection.$$checkpoints}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui checkpoints.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiChainTransactions({ id, label, open })}
					<SuiTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-sui-objects-packages'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'sui-objects',
							label: 'Objects',
						},
						{
							id: 'sui-packages',
							label: 'Packages',
						},
					]
				}
				data-card
				class='network-view-collapsible-objects-packages'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Objects and packages</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSuiObjects({ id, label, open })}
					<SuiObjectsView
						selection={selection.$$objects}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui objects.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiPackages({ id, label, open })}
					<SuiPackagesView
						selection={selection.$$packages}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui packages.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-sui-accounts-coins'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'sui-accounts',
							label: 'Accounts',
						},
						{
							id: 'sui-coin-types',
							label: 'Coin types',
						},
						{
							id: 'sui-coin-balances',
							label: 'Coin balances',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-coins'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and coins</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSuiAccounts({ id, label, open })}
					<SuiAccountsView
						selection={selection.$$accounts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiCoinTypes({ id, label, open })}
					<SuiCoinTypesView
						selection={selection.$$coinTypes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui coin types.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiCoinBalances({ id, label, open })}
					<SuiCoinBalance_TimestampsView
						selection={selection.$$coinBalanceTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Sui coin balance observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
