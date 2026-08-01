<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TonJetton> = $props()

	const viewDomId = $derived('ton-jetton-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonJettonTransfersView from '$/views/TonJettonTransfersView.svelte'
	import TonJettonBalance_TimestampsView from '$/views/TonJettonBalance_TimestampsView.svelte'
	import TonJetton_TimestampsView from '$/views/TonJetton_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonJetton}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'TON jetton'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>master address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.masterAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$masterAccount}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null}
						<div>
							<dt>master account</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-ton-jetton-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ton-jetton-transfers',
						label: 'Transfers',
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

			{#snippet SectionTonJettonTransfers({ id, label, open })}
				<TonJettonTransfersView
					selection={selection.$$transfers}
					collapsible={false}
					title={label}
					emptyText='No transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-ton-jetton-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ton-jetton-balance-timestamps',
						label: 'Balance Timestamps',
					},
					{
						id: 'ton-jetton-timestamps',
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

			{#snippet SectionTonJettonBalanceTimestamps({ id, label, open })}
				<TonJettonBalance_TimestampsView
					selection={selection.$$balanceTimestamps}
					collapsible={false}
					title={label}
					emptyText='No balance timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTonJettonTimestamps({ id, label, open })}
				<TonJetton_TimestampsView
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
