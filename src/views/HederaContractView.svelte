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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaContract>, 'prefetched'> = $props()

	const viewDomId = $derived('hedera-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContract}
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
				<EntitiesList
					entityType={EntityType.HederaContractResult}
					collapsible={false}
					title={label}
					emptyText='No results.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$results()}
				>
					{#snippet Item({ item: hederaContractResult })}
						<EntityView
							entityType={EntityType.HederaContractResult}
							entitySelector={hederaContractResult[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHederaContractLogs({ id, label })}
				<EntitiesList
					entityType={EntityType.HederaContractLog}
					collapsible={false}
					title={label}
					emptyText='No logs.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$logs()}
				>
					{#snippet Item({ item: hederaContractLog })}
						<EntityView
							entityType={EntityType.HederaContractLog}
							entitySelector={hederaContractLog[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHederaContractState({ id, label })}
				<EntitiesList
					entityType={EntityType.HederaContractState_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No state.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$state()}
				>
					{#snippet Item({ item: hederaContractStateTimestamp })}
						<EntityView
							entityType={EntityType.HederaContractState_Timestamp}
							entitySelector={hederaContractStateTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.HederaContract_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: hederaContractTimestamp })}
						<EntityView
							entityType={EntityType.HederaContract_Timestamp}
							entitySelector={hederaContractTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
