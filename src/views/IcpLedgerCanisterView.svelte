<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IcpLedgerCanister> = $props()

	const titleFallback = 'ICP ledger canister'
	const viewDomId = $derived('icp-ledger-canister-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP ledger canister
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
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
								fields: {
									ledgerStandard: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ledgerStandard}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					open={open}
					title={label}
					emptyText='No blocks.'
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
					open={open}
					title={label}
					emptyText='No transactions.'
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
					open={open}
					title={label}
					emptyText='No timestamps.'
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
					open={open}
					title={label}
					emptyText='No account timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
