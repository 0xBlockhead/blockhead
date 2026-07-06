<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
	const beaconSlot = $derived(selection({
		fields: {
			$epoch: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.slot ?? prefetched.slot) ?? '') ? 'Slot #' + String((selection.entitySelector.slot ?? prefetched.slot) ?? '') : '') || 'beacon slot')
	const viewDomId = $derived('beacon-slot-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.slot ?? prefetched.slot ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.slot !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			slot: String(pendingEntity.slot ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.slot ?? prefetched.slot}
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
		{@const serialValue = selection.entitySelector.slot ?? prefetched.slot}
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
					resource={selection[EntityProxyField]<EntityType.BeaconEpoch, false>('$epoch')}
				>
					{#snippet children(beaconEpoch)}
						<span data-text="muted">
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
								prefetched={beaconEpoch}
								href={
									(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
										caip2: `${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
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
					resource={selection[EntityProxyField]<EntityType.BeaconEpoch, false>('$epoch')}
				>
					{#snippet children(beaconEpoch)}
						<span data-text="muted">
							<BeaconEpochView
								selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
								prefetched={beaconEpoch}
								href={
									(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
										caip2: `${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
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
					{@const proposerIndex = prefetched.proposerIndex}
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
						resource={selection[EntityProxyField]<EntityType.BeaconEpoch, false>('$epoch')}
					>
						{#snippet children(beaconEpoch)}
							{#if beaconEpoch[EntityMetaKey.Selector] != null}
								<BeaconEpochView
									selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
									prefetched={beaconEpoch}
									href={
										(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
											caip2: `${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
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
						{@const root = prefetched.root}
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
						{@const canonical = prefetched.canonical}
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
						{@const parentRoot = prefetched.parentRoot}
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
						{@const stateRoot = prefetched.stateRoot}
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
						{@const bodyRoot = prefetched.bodyRoot}
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
						{@const signature = prefetched.signature}
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
			<BeaconCommitteesView
				selection={selection[EntityProxyField]<EntityType.BeaconCommittee>('$$beaconCommittees')}
				title='Beacon committees'
				id='BeaconCommitteesView-$$beaconCommittees'
			/>

			<BeaconAttestationsView
				selection={selection[EntityProxyField]<EntityType.BeaconAttestation>('$$beaconAttestations')}
				title='Beacon attestations'
				id='BeaconAttestationsView-$$beaconAttestations'
			/>

			<BeaconWithdrawalsView
				selection={selection[EntityProxyField]<EntityType.BeaconWithdrawal>('$$beaconWithdrawals')}
				title='Beacon withdrawals'
				id='BeaconWithdrawalsView-$$beaconWithdrawals'
			/>

			<BeaconSlashingsView
				selection={selection[EntityProxyField]<EntityType.BeaconSlashing>('$$beaconSlashings')}
				title='Beacon slashings'
				id='BeaconSlashingsView-$$beaconSlashings'
			/>
		{/if}
	{/snippet}
</EntityView>
