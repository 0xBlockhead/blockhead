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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosToken> = $props()

	const viewDomId = $derived('tezos-token-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosToken}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>contract address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.contractAddress} />
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					{selection.entitySelector.tokenId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(tezosContract)}
					{#if tezosContract != null}
						<div>
							<dt>contract</dt>
							<dd>
								<TezosContractView
									selection={select(EntityType.TezosContract, tezosContract[EntityMetaKey.Selector])}
									prefetched={tezosContract}
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
			id={viewDomId + '-carousel-tezos-token-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-token-transfers',
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

			{#snippet SectionTezosTokenTransfers({ id, label, open })}
				<EntitiesList
					entityType={EntityType.TezosTokenTransfer}
					collapsible={false}
					title={label}
					emptyText='No transfers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transfers()}
				>
					{#snippet Item({ item: tezosTokenTransfer })}
						<EntityView
							entityType={EntityType.TezosTokenTransfer}
							entitySelector={tezosTokenTransfer[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-token-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-token-timestamps',
						label: 'Timestamps',
					},
					{
						id: 'tezos-token-balance-timestamps',
						label: 'Balance Timestamps',
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

			{#snippet SectionTezosTokenTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.TezosToken_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: tezosTokenTimestamp })}
						<EntityView
							entityType={EntityType.TezosToken_Timestamp}
							entitySelector={tezosTokenTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosTokenBalanceTimestamps({ id, label, open })}
				<EntitiesList
					entityType={EntityType.TezosTokenBalance_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No balance timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$balanceTimestamps()}
				>
					{#snippet Item({ item: tezosTokenBalanceTimestamp })}
						<EntityView
							entityType={EntityType.TezosTokenBalance_Timestamp}
							entitySelector={tezosTokenBalanceTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
