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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StarknetContract>, 'prefetched'> = $props()

	const viewDomId = $derived('starknet-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
	import StarknetAccount_TimestampsView from '$/views/StarknetAccount_TimestampsView.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetStorageEntriesView from '$/views/StarknetStorageEntriesView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
	import StarknetTokenHoldingsView from '$/views/StarknetTokenHoldingsView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.address || 'starknet contract')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						selection.entitySelector.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					accountId: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<StarknetNetworkView
			selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
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
			id={viewDomId + '-carousel-starknet-contract-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-contract-account-states',
						label: 'Account States',
					},
					{
						id: 'starknet-contract-events',
						label: 'Events',
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

			{#snippet SectionStarknetContractAccountStates({ id, label })}
				<StarknetAccount_TimestampsView
					selection={selection.$$accountStates}
					collapsible={false}
					title={label}
					emptyText='No account states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetContractEvents({ id, label })}
				<StarknetEventsView
					selection={selection.$$events}
					collapsible={false}
					title={label}
					emptyText='No events.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-starknet-contract-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-contract-storage',
						label: 'Storage',
					},
					{
						id: 'starknet-contract-transactions',
						label: 'Transactions',
					},
					{
						id: 'starknet-contract-token-holdings',
						label: 'Token holdings',
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

			{#snippet SectionStarknetContractStorage({ id, label })}
				<StarknetStorageEntriesView
					selection={selection.$$storage}
					collapsible={false}
					title={label}
					emptyText='No storage.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetContractTransactions({ id, label })}
				<StarknetTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetContractTokenHoldings({ id, label })}
				<StarknetTokenHoldingsView
					selection={selection.$$tokenHoldings}
					collapsible={false}
					title={label}
					emptyText='No token holdings.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
