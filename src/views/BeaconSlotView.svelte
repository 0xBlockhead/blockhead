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
	import { select } from '$/routes/+layout.svelte'


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
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))
	const viewDomId = $derived('beacon-slot-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconDepositsView from '$/views/BeaconDepositsView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proposerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerIndex = entity.proposerIndex}
					{#if proposerIndex != null}
						<div>
							<dt>Proposer index</dt>
							<dd>
								<NumberValue
									value={proposerIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								root: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const root = entity.root}
						{#if root != null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={root} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								canonical: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const canonical = entity.canonical}
						{#if canonical != null}
							<div>
								<dt>Canonical</dt>
								<dd>
									{canonical ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								parentRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const parentRoot = entity.parentRoot}
						{#if parentRoot != null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={parentRoot} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								stateRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const stateRoot = entity.stateRoot}
						{#if stateRoot != null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={stateRoot} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								bodyRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const bodyRoot = entity.bodyRoot}
						{#if bodyRoot != null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={bodyRoot} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								signature: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const signature = entity.signature}
						{#if signature != null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={signature} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
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
