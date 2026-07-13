<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlot>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconSlot>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const beaconSlot = $derived(selection({}))
	const titleFallback = $derived((String((pendingEntity.slot) ?? '') ? 'Slot #' + String((pendingEntity.slot) ?? '') : '') || 'beacon slot')
	const viewDomId = $derived('beacon-slot-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.slot ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.slot !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
			network: String(pendingEntity.$network.slug ?? ''),
			slot: String(pendingEntity.slot ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Slot </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconSlot}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$epoch}
				>
					{#snippet children(beaconEpoch)}
						<span data-text="muted">
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
								prefetched={beaconEpoch}
								href={
									(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.slug !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
										network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
										epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$epoch}
				>
					{#snippet children(beaconEpoch)}
						<span data-text="muted">
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
								prefetched={beaconEpoch}
								href={
									(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.slug !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
										network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
										epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
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
				{#snippet Pending()}
					{@const proposerIndex = pendingEntity.proposerIndex}
					{#if proposerIndex !== undefined && proposerIndex !== null}
						<div>
							<dt>Proposer index</dt>
							<dd>
								<NumberValue value={Number(proposerIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proposerIndex = resolvedEntity.proposerIndex}
					{#if proposerIndex !== undefined && proposerIndex !== null}
						<div>
							<dt>Proposer index</dt>
							<dd>
								<NumberValue value={Number(proposerIndex)} />
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
							{#if beaconEpoch != null && beaconEpoch[EntityMetaKey.Selector] != null}
								<BeaconEpochView
									selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
									prefetched={beaconEpoch}
									href={
										(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.slug !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
											network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
											epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
					{#snippet Pending()}
						{@const root = pendingEntity.root}
						{#if root !== undefined && root !== null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={String((root) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const root = resolvedEntity.root}
						{#if root !== undefined && root !== null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={String((root) ?? '')} />
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
					{#snippet Pending()}
						{@const canonical = pendingEntity.canonical}
						{#if canonical !== undefined && canonical !== null}
							<div>
								<dt>Canonical</dt>
								<dd>
									{canonical ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const canonical = resolvedEntity.canonical}
						{#if canonical !== undefined && canonical !== null}
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
					{#snippet Pending()}
						{@const parentRoot = pendingEntity.parentRoot}
						{#if parentRoot !== undefined && parentRoot !== null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={String((parentRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const parentRoot = resolvedEntity.parentRoot}
						{#if parentRoot !== undefined && parentRoot !== null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={String((parentRoot) ?? '')} />
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
					{#snippet Pending()}
						{@const stateRoot = pendingEntity.stateRoot}
						{#if stateRoot !== undefined && stateRoot !== null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={String((stateRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const stateRoot = resolvedEntity.stateRoot}
						{#if stateRoot !== undefined && stateRoot !== null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={String((stateRoot) ?? '')} />
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
					{#snippet Pending()}
						{@const bodyRoot = pendingEntity.bodyRoot}
						{#if bodyRoot !== undefined && bodyRoot !== null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={String((bodyRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const bodyRoot = resolvedEntity.bodyRoot}
						{#if bodyRoot !== undefined && bodyRoot !== null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={String((bodyRoot) ?? '')} />
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
					{#snippet Pending()}
						{@const signature = pendingEntity.signature}
						{#if signature !== undefined && signature !== null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={String((signature) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const signature = resolvedEntity.signature}
						{#if signature !== undefined && signature !== null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={String((signature) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Consensus</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBeaconSlotCommittees({ id, label, open })}
					<BeaconCommitteesView
						selection={selection.$$beaconCommittees}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBeaconSlotAttestations({ id, label, open })}
					<BeaconAttestationsView
						selection={selection.$$beaconAttestations}
						CollapsibleProps={{ canToggle: false }}
						open={open}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Withdrawals and slashings</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBeaconSlotWithdrawals({ id, label, open })}
					<BeaconWithdrawalsView
						selection={selection.$$beaconWithdrawals}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBeaconSlotSlashings({ id, label, open })}
					<BeaconSlashingsView
						selection={selection.$$beaconSlashings}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
