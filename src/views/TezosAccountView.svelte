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
	}: Omit<EntitySelectionViewProps<EntityType.TezosAccount>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
				{
					network: (
						selection.entitySelector.$network.$network.caip2 !== undefined ?
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
				<TezosOperationsView
					selection={selection.$$operations}
					collapsible={false}
					title={label}
					emptyText='No operations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosAccountTokenTransfers({ id, label })}
				<TezosTokenTransfersView
					selection={selection.$$tokenTransfers}
					collapsible={false}
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

			{#snippet SectionTezosAccountTokenBalanceTimestamps({ id, label })}
				<TezosTokenBalance_TimestampsView
					selection={selection.$$tokenBalanceTimestamps}
					collapsible={false}
					title={label}
					emptyText='No token balance timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosAccountTimestamps({ id, label })}
				<TezosAccount_TimestampsView
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
