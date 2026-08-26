<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconSlot>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('beacon-slot-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import BeaconBlocksView from '$/views/BeaconBlocksView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconDepositsView from '$/views/BeaconDepositsView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconDataColumnsView from '$/views/BeaconDataColumnsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? `Slot #${selection.entitySelector.slot}`}
	idDragPlainText={String(selection.entitySelector.slot)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					slot: String(selection.entitySelector.slot),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
			<span data-badge="small">
				#{selection.entitySelector.slot}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.slot}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$epoch}
		>
			{#snippet children(beaconEpoch)}
				{@const beaconEpochInitial = untrack(() => beaconEpoch)}
				<span data-text="muted">
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, (beaconEpoch ?? beaconEpochInitial)[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Epoch</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$epoch}
					>
						{#snippet children(beaconEpoch)}
							{@const beaconEpochInitial = untrack(() => beaconEpoch)}
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, (beaconEpoch ?? beaconEpochInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$executionBlock}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-beacon-slot-blocks'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'beacon-slot-blocks',
						label: 'Fork blocks',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Blocks</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBeaconSlotBlocks({ id, label })}
				<BeaconBlocksView
					selection={
						selection
						.$$blocks({
							sources: [
								Source.Beacon_Rest,
								Source.BeaconchaIn_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-beacon-slot-consensus'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'beacon-slot-committees',
						label: 'Committees',
					},
					{
						id: 'beacon-slot-deposits',
						label: 'Deposits',
					},
					{
						id: 'beacon-slot-attestations',
						label: 'Attestations',
					},
					{
						id: 'beacon-slot-data-columns',
						label: 'Data availability columns',
					},
				]
			}
			data-card
			class='network-view-collapsible-consensus'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBeaconSlotCommittees({ id, label })}
				<BeaconCommitteesView
					selection={
						selection
						.$$beaconCommittees({
							sources: [
								Source.Beacon_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotDeposits({ id, label })}
				<BeaconDepositsView
					selection={
						selection
						.$$beaconDeposits({
							sources: [
								Source.Beacon_Rest,
								Source.BeaconchaIn_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotAttestations({ id, label })}
				<BeaconAttestationsView
					selection={
						selection
						.$$beaconAttestations({
							sources: [
								Source.Beacon_Rest,
								Source.BeaconchaIn_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotDataColumns({ id, label })}
				<BeaconDataColumnsView
					selection={
						selection
						.$$dataColumns({
							sources: [
								Source.Beacon_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No data columns were returned by this beacon node.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-beacon-slot-exits'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'beacon-slot-withdrawals',
						label: 'Withdrawals',
					},
					{
						id: 'beacon-slot-slashings',
						label: 'Slashings',
					},
				]
			}
			data-card
			class='network-view-collapsible-exits'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Withdrawals and slashings</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBeaconSlotWithdrawals({ id, label })}
				<BeaconWithdrawalsView
					selection={
						selection
						.$$beaconWithdrawals({
							sources: [
								Source.Beacon_Rest,
								Source.BeaconchaIn_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotSlashings({ id, label })}
				<BeaconSlashingsView
					selection={
						selection
						.$$beaconSlashings({
							sources: [
								Source.Beacon_Rest,
								Source.BeaconchaIn_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
