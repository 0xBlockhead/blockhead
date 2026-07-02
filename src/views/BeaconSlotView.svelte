<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'


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

	const beaconSlot = $derived(selection({
		fields: {
			epoch: true,
			proposerIndex: true,
			root: true,
			canonical: true,
			parentRoot: true,
			stateRoot: true,
			bodyRoot: true,
			signature: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') ? 'Slot #' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') : '') || 'beacon slot')
	const viewDomId = $derived('beacon-slot-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).slot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
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
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const epoch0 = prefetched.epoch}
			{#if epoch0 !== undefined && epoch0 !== null}
				<span data-text="muted">
					<span>Epoch </span>
					<NumberValue value={Number(epoch0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconSlot}>
				{#snippet Pending()}
					{@const epoch0 = prefetched.epoch}
					{#if epoch0 !== undefined && epoch0 !== null}
						<span data-text="muted">
							<span>Epoch </span>
							<NumberValue value={Number(epoch0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const epoch0 = entity.epoch}
					{#if epoch0 !== undefined && epoch0 !== null}
						<span data-text="muted">
							<span>Epoch </span>
							<NumberValue value={Number(epoch0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={beaconSlot}>
				{#snippet Pending()}
					{@const proposerIndex = prefetched.proposerIndex ?? selection.entitySelector.proposerIndex}
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
					{@const proposerIndex = entity.proposerIndex ?? selection.entitySelector.proposerIndex ?? prefetched.proposerIndex}
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

			{#if contentOpen}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary resource={beaconSlot}>
							{#snippet children(entity)}
								<BeaconEpochView
									selection={select(EntityType.BeaconEpoch, {
										$network: selection.entitySelector.$network,
										epoch: entity.epoch,
									})}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const root = prefetched.root ?? selection.entitySelector.root}
						{#if root !== undefined && root !== null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={String(root)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const root = entity.root ?? selection.entitySelector.root ?? prefetched.root}
						{#if root !== undefined && root !== null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={String(root)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const canonical = prefetched.canonical ?? selection.entitySelector.canonical}
						{#if canonical !== undefined && canonical !== null}
							<div>
								<dt>Canonical</dt>
								<dd>
									{String((canonical) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const canonical = entity.canonical ?? selection.entitySelector.canonical ?? prefetched.canonical}
						{#if canonical !== undefined && canonical !== null}
							<div>
								<dt>Canonical</dt>
								<dd>
									{String((canonical) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const parentRoot = prefetched.parentRoot ?? selection.entitySelector.parentRoot}
						{#if parentRoot !== undefined && parentRoot !== null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={String(parentRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const parentRoot = entity.parentRoot ?? selection.entitySelector.parentRoot ?? prefetched.parentRoot}
						{#if parentRoot !== undefined && parentRoot !== null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={String(parentRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const stateRoot = prefetched.stateRoot ?? selection.entitySelector.stateRoot}
						{#if stateRoot !== undefined && stateRoot !== null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={String(stateRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const stateRoot = entity.stateRoot ?? selection.entitySelector.stateRoot ?? prefetched.stateRoot}
						{#if stateRoot !== undefined && stateRoot !== null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={String(stateRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const bodyRoot = prefetched.bodyRoot ?? selection.entitySelector.bodyRoot}
						{#if bodyRoot !== undefined && bodyRoot !== null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={String(bodyRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const bodyRoot = entity.bodyRoot ?? selection.entitySelector.bodyRoot ?? prefetched.bodyRoot}
						{#if bodyRoot !== undefined && bodyRoot !== null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={String(bodyRoot)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconSlot}>
					{#snippet Pending()}
						{@const signature = prefetched.signature ?? selection.entitySelector.signature}
						{#if signature !== undefined && signature !== null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={String(signature)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const signature = entity.signature ?? selection.entitySelector.signature ?? prefetched.signature}
						{#if signature !== undefined && signature !== null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={String(signature)} />
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
