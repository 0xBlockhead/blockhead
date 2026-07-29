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
	}: EntitySelectionViewProps<EntityType.KaspaAddress> = $props()

	const viewDomId = $derived('kaspa-address-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
	import KaspaTransactionsView from '$/views/KaspaTransactionsView.svelte'
	import KaspaAddressUtxo_TimestampsView from '$/views/KaspaAddressUtxo_TimestampsView.svelte'
	import KaspaAddress_TimestampsView from '$/views/KaspaAddress_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAddress}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'kaspa address'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		kaspa address
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
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
				<KaspaTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaAddressUtxos({ id, label, open })}
				<KaspaAddressUtxo_TimestampsView
					selection={selection.$$utxos}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa UTXO observations.'
					id={`${id}-list`}
				/>
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
				<KaspaAddress_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Kaspa address observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
