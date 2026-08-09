<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.KaspaAddress>, 'prefetched'> = $props()

	const viewDomId = $derived('kaspa-address-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					address: selection.entitySelector.address,
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

			{#snippet SectionKaspaAddressTransactions({ id, label })}
				<KaspaTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Kaspa transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaAddressUtxos({ id, label })}
				<KaspaAddressUtxo_TimestampsView
					selection={selection.$$utxos}
					collapsible={false}
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

			{#snippet SectionKaspaAddressTimestamps({ id, label })}
				<KaspaAddress_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Kaspa address observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
