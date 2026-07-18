<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.IcpLedgerCanister>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.IcpLedgerCanister>>
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
	const icpLedgerCanister = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('ICP ledger canister')
	const viewDomId = $derived('icp-ledger-canister-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
	import IcpLedgerBlocksView from '$/views/IcpLedgerBlocksView.svelte'
	import IcpLedgerTransactionsView from '$/views/IcpLedgerTransactionsView.svelte'
	import IcpLedgerCanister_TimestampsView from '$/views/IcpLedgerCanister_TimestampsView.svelte'
	import IcpLedgerAccount_TimestampsView from '$/views/IcpLedgerAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerCanister}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={icpLedgerCanister}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger standard</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerStandard: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerStandard = resolvedEntity.ledgerStandard}
							{#if ledgerStandard !== undefined && ledgerStandard !== null}
								{String((ledgerStandard) ?? '')}
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
				id={viewDomId + '-carousel-icp-ledger-canister-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'icp-ledger-canister-blocks',
							label: 'Blocks',
						},
						{
							id: 'icp-ledger-canister-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionIcpLedgerCanisterBlocks({ id, label, open })}
					<IcpLedgerBlocksView
						selection={selection.$$blocks}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionIcpLedgerCanisterTransactions({ id, label, open })}
					<IcpLedgerTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-icp-ledger-canister-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'icp-ledger-canister-timestamps',
							label: 'Timestamps',
						},
						{
							id: 'icp-ledger-canister-account-timestamps',
							label: 'Account Timestamps',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionIcpLedgerCanisterTimestamps({ id, label, open })}
					<IcpLedgerCanister_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionIcpLedgerCanisterAccountTimestamps({ id, label, open })}
					<IcpLedgerAccount_TimestampsView
						selection={selection.$$accountTimestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No account timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
