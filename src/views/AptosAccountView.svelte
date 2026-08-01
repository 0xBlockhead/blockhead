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
	}: EntitySelectionViewProps<EntityType.AptosAccount> = $props()

	const viewDomId = $derived('aptos-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosAccount_TimestampsView from '$/views/AptosAccount_TimestampsView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
	import AptosAccountResourcesView from '$/views/AptosAccountResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.address || 'aptos account')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet Value()}
		<AptosNetworkView
			selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-account-observations',
						label: 'Observations',
					},
					{
						id: 'aptos-account-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-account-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Account activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosAccountObservations({ id, label, open })}
				<AptosAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosAccountTransactions({ id, label, open })}
				<AptosTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-account-resources'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-account-balances',
						label: 'Balances',
					},
					{
						id: 'aptos-account-resource-list',
						label: 'Resources',
					},
				]
			}
			data-card
			class='network-view-collapsible-resources-modules'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources and modules</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosAccountBalances({ id, label, open })}
				<AptosCoinBalance_TimestampsView
					selection={selection.$$balances}
					collapsible={false}
					title={label}
					emptyText='No balances found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosAccountResourceList({ id, label, open })}
				<AptosAccountResourcesView
					selection={selection.$$resources}
					collapsible={false}
					title={label}
					emptyText='No resources found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
