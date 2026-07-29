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
	}: EntitySelectionViewProps<EntityType.TezosAccount> = $props()

	const viewDomId = $derived('tezos-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosOperationsView from '$/views/TezosOperationsView.svelte'
	import TezosTokenTransfersView from '$/views/TezosTokenTransfersView.svelte'
	import TezosTokenBalance_TimestampsView from '$/views/TezosTokenBalance_TimestampsView.svelte'
	import TezosAccount_TimestampsView from '$/views/TezosAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'tezos account'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos account
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
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

	{#snippet Details({ open: detailsOpen })}
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

			{#snippet SectionTezosAccountOperations({ id, label, open })}
				<TezosOperationsView
					selection={selection.$$operations}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No operations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosAccountTokenTransfers({ id, label, open })}
				<TezosTokenTransfersView
					selection={selection.$$tokenTransfers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No token transfers.'
					id={`${id}-list`}
				/>
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

			{#snippet SectionTezosAccountTokenBalanceTimestamps({ id, label, open })}
				<TezosTokenBalance_TimestampsView
					selection={selection.$$tokenBalanceTimestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No token balance timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosAccountTimestamps({ id, label, open })}
				<TezosAccount_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
