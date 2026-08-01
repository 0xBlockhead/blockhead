<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BeaconSlot> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('beacon-slot-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
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
				<span data-text="muted">
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
						prefetched={beaconEpoch}
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
					selection({
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
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
								prefetched={beaconEpoch}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
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
						selection({
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
						selection({
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
						selection({
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
						selection({
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
						selection({
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

	{#snippet Details({ open: detailsOpen })}
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

			{#snippet SectionBeaconSlotCommittees({ id, label, open })}
				<BeaconCommitteesView
					selection={selection.$$beaconCommittees}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotAttestations({ id, label, open })}
				<BeaconAttestationsView
					selection={selection.$$beaconAttestations}
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

			{#snippet SectionBeaconSlotWithdrawals({ id, label, open })}
				<BeaconWithdrawalsView
					selection={selection.$$beaconWithdrawals}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBeaconSlotSlashings({ id, label, open })}
				<BeaconSlashingsView
					selection={selection.$$beaconSlashings}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
