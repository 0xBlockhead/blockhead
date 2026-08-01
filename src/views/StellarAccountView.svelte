<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.StellarAccount> = $props()

	const viewDomId = $derived('stellar-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
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

			{#snippet SectionStellarAccountTrustlines({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTrustline}
					collapsible={false}
					title={label}
					emptyText='No trustlines.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$trustlines()}
				>
					{#snippet Item({ item: stellarTrustline })}
						<EntityView
							entityType={EntityType.StellarTrustline}
							entitySelector={stellarTrustline[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarAccountOffers({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarOffer}
					collapsible={false}
					title={label}
					emptyText='No offers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$offers()}
				>
					{#snippet Item({ item: stellarOffer })}
						<EntityView
							entityType={EntityType.StellarOffer}
							entitySelector={stellarOffer[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarAccountTrades({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTrade}
					collapsible={false}
					title={label}
					emptyText='No trades.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$trades()}
				>
					{#snippet Item({ item: stellarTrade })}
						<EntityView
							entityType={EntityType.StellarTrade}
							entitySelector={stellarTrade[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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

			{#snippet SectionStellarAccountTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTransaction}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: stellarTransaction })}
						<EntityView
							entityType={EntityType.StellarTransaction}
							entitySelector={stellarTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarAccountSigners({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarAccountSigner}
					collapsible={false}
					title={label}
					emptyText='No signers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$signers()}
				>
					{#snippet Item({ item: stellarAccountSigner })}
						<EntityView
							entityType={EntityType.StellarAccountSigner}
							entitySelector={stellarAccountSigner[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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

			{#snippet SectionStellarAccountTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarAccount_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: stellarAccountTimestamp })}
						<EntityView
							entityType={EntityType.StellarAccount_Timestamp}
							entitySelector={stellarAccountTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
