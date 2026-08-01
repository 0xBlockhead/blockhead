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
	}: EntitySelectionViewProps<EntityType.TezosAccount> = $props()

	const viewDomId = $derived('tezos-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosAccount}
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
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
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

			<div>
				<dt>account kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.accountKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-account-operations',
						label: 'Operations',
					},
					{
						id: 'tezos-account-token-transfers',
						label: 'Token Transfers',
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

			{#snippet SectionTezosAccountOperations({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosOperation}
					collapsible={false}
					title={label}
					emptyText='No operations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$operations()}
				>
					{#snippet Item({ item: tezosOperation })}
						<EntityView
							entityType={EntityType.TezosOperation}
							entitySelector={tezosOperation[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosAccountTokenTransfers({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosTokenTransfer}
					collapsible={false}
					title={label}
					emptyText='No token transfers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$tokenTransfers()}
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
			id={viewDomId + '-carousel-tezos-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-account-token-balance-timestamps',
						label: 'Token Balance Timestamps',
					},
					{
						id: 'tezos-account-timestamps',
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

			{#snippet SectionTezosAccountTokenBalanceTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosTokenBalance_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No token balance timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$tokenBalanceTimestamps()}
				>
					{#snippet Item({ item: tezosTokenBalanceTimestamp })}
						<EntityView
							entityType={EntityType.TezosTokenBalance_Timestamp}
							entitySelector={tezosTokenBalanceTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosAccountTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosAccount_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: tezosAccountTimestamp })}
						<EntityView
							entityType={EntityType.TezosAccount_Timestamp}
							entitySelector={tezosAccountTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
