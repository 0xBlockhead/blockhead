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
	}: Omit<EntitySelectionViewProps<EntityType.HederaContract>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('hedera-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaContractResultsView from '$/views/HederaContractResultsView.svelte'
	import HederaContractLogsView from '$/views/HederaContractLogsView.svelte'
	import HederaContractState_TimestampsView from '$/views/HederaContractState_TimestampsView.svelte'
	import HederaContract_TimestampsView from '$/views/HederaContract_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					address: selection.entitySelector.contractId,
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>contract ID</dt>
				<dd>
					{selection.entitySelector.contractId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evmAddress = entity.evmAddress}
					{#if evmAddress != null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={evmAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdTimestamp = entity.createdTimestamp}
					{#if createdTimestamp != null}
						<div>
							<dt>created timestamp</dt>
							<dd>
								{createdTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-contract-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-contract-results',
						label: 'Results',
					},
					{
						id: 'hedera-contract-logs',
						label: 'Logs',
					},
					{
						id: 'hedera-contract-state',
						label: 'State',
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

			{#snippet SectionHederaContractResults({ id, label })}
				<HederaContractResultsView
					selection={selection.$$results}
					collapsible={false}
					title={label}
					emptyText='No results.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaContractLogs({ id, label })}
				<HederaContractLogsView
					selection={selection.$$logs}
					collapsible={false}
					title={label}
					emptyText='No logs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaContractState({ id, label })}
				<HederaContractState_TimestampsView
					selection={selection.$$state}
					collapsible={false}
					title={label}
					emptyText='No state.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-contract-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-contract-timestamps',
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

			{#snippet SectionHederaContractTimestamps({ id, label })}
				<HederaContract_TimestampsView
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
