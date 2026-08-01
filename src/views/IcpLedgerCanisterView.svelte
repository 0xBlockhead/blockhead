<!-- Generated from APP.ts. -->

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
	title={title ?? 'ICP ledger canister'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
						layout={EntityLayout.Value}
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

	{#snippet Details()}
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

			{#snippet SectionIcpLedgerCanisterBlocks({ id, label })}
				<IcpLedgerBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpLedgerCanisterTransactions({ id, label })}
				<IcpLedgerTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
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

			{#snippet SectionIcpLedgerCanisterTimestamps({ id, label })}
				<IcpLedgerCanister_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpLedgerCanisterAccountTimestamps({ id, label })}
				<IcpLedgerAccount_TimestampsView
					selection={selection.$$accountTimestamps}
					collapsible={false}
					title={label}
					emptyText='No account timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
