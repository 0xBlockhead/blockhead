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
	}: EntitySelectionViewProps<EntityType.KaspaAddress> = $props()

	const viewDomId = $derived('kaspa-address-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAddress}
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
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
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

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-address-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-address-transactions',
						label: 'Transactions',
					},
					{
						id: 'kaspa-address-utxos',
						label: 'UTXOs',
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

			{#snippet SectionKaspaAddressTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaTransaction}
					collapsible={false}
					title={label}
					emptyText='No Kaspa transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: kaspaTransaction })}
						<EntityView
							entityType={EntityType.KaspaTransaction}
							entitySelector={kaspaTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionKaspaAddressUtxos({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaAddressUtxo_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Kaspa UTXO observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$utxos()}
				>
					{#snippet Item({ item: kaspaAddressUtxoTimestamp })}
						<EntityView
							entityType={EntityType.KaspaAddressUtxo_Timestamp}
							entitySelector={kaspaAddressUtxoTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-address-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-address-timestamps',
						label: 'Observations',
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

			{#snippet SectionKaspaAddressTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.KaspaAddress_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Kaspa address observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: kaspaAddressTimestamp })}
						<EntityView
							entityType={EntityType.KaspaAddress_Timestamp}
							entitySelector={kaspaAddressTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
