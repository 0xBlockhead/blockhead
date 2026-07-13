<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaAccount>>
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
	const hederaAccount = $derived(selection({}))
	const titleFallback = $derived('hedera account')
	const viewDomId = $derived('hedera-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaNetworkView from '$/views/HederaNetworkView.svelte'
	import HederaAllowancesView from '$/views/HederaAllowancesView.svelte'
	import HederaTokenAssociationsView from '$/views/HederaTokenAssociationsView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import HederaAccount_TimestampsView from '$/views/HederaAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaAccount}>
			{#snippet Pending()}
				{title || 'hedera account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<HederaNetworkView
						selection={select(EntityType.HederaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountId = pendingEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountId = resolvedEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-account-allowances',
							label: 'Allowances',
						},
						{
							id: 'hedera-account-tokens',
							label: 'Tokens',
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

				{#snippet SectionHederaAccountAllowances({ id, label, open })}
					<HederaAllowancesView
						selection={
							selection.$$allowances({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No allowances.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaAccountTokens({ id, label, open })}
					<HederaTokenAssociationsView
						selection={
							selection.$$tokens({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No tokens.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-account-related'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-account-nfts',
							label: 'Nfts',
						},
						{
							id: 'hedera-account-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-related'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHederaAccountNfts({ id, label, open })}
					<HederaNftsView
						selection={
							selection.$$nfts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No nfts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHederaAccountTransactions({ id, label, open })}
					<HederaTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-hedera-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'hedera-account-timestamps',
							label: 'Timestamps',
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

				{#snippet SectionHederaAccountTimestamps({ id, label, open })}
					<HederaAccount_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
