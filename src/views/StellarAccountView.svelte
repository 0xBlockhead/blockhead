<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarAccount>, 'prefetched'> = $props()

	const viewDomId = $derived('stellar-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarTrustlinesView from '$/views/StellarTrustlinesView.svelte'
	import StellarOffersView from '$/views/StellarOffersView.svelte'
	import StellarTradesView from '$/views/StellarTradesView.svelte'
	import StellarOperationsView from '$/views/StellarOperationsView.svelte'
	import StellarTransactionsView from '$/views/StellarTransactionsView.svelte'
	import StellarAccountSignersView from '$/views/StellarAccountSignersView.svelte'
	import StellarAccount_TimestampsView from '$/views/StellarAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]',
				{
					network: (
						selection.entitySelector.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					accountId: selection.entitySelector.accountId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-account-trustlines',
						label: 'Trustlines',
					},
					{
						id: 'stellar-account-offers',
						label: 'Offers',
					},
					{
						id: 'stellar-account-trades',
						label: 'Trades',
					},
					{
						id: 'stellar-account-operations',
						label: 'Operations',
					},
					{
						id: 'stellar-account-payments',
						label: 'Payments',
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

			{#snippet SectionStellarAccountTrustlines({ id, label })}
				<StellarTrustlinesView
					selection={selection.$$trustlines}
					collapsible={false}
					title={label}
					emptyText='No trustlines.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAccountOffers({ id, label })}
				<StellarOffersView
					selection={selection.$$offers}
					collapsible={false}
					title={label}
					emptyText='No offers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAccountTrades({ id, label })}
				<StellarTradesView
					selection={selection.$$trades}
					collapsible={false}
					title={label}
					emptyText='No trades.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAccountOperations({ id, label })}
				<StellarOperationsView
					selection={selection.$$operations}
					collapsible={false}
					title={label}
					emptyText='No operations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAccountPayments({ id, label })}
				<StellarOperationsView
					selection={selection.$$payments}
					collapsible={false}
					title={label}
					emptyText='No payments.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-account-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-account-transactions',
						label: 'Transactions',
					},
					{
						id: 'stellar-account-signers',
						label: 'Signers',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStellarAccountTransactions({ id, label })}
				<StellarTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAccountSigners({ id, label })}
				<StellarAccountSignersView
					selection={selection.$$signers}
					collapsible={false}
					title={label}
					emptyText='No signers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-account-timestamps',
						label: 'Timestamps',
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

			{#snippet SectionStellarAccountTimestamps({ id, label })}
				<StellarAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
