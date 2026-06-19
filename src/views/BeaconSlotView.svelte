<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
				href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-slots)/slot/[slotNumber=beaconSlotNumber]', {
				caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				slotNumber: String(selection.entitySelector.slot),
			}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlot>
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const slot = $derived(selection(
		({ sources: [
				Source.Beacon_Rest,
			], fields: { proposerIndex: true, ...(open && ({ epoch: true, root: true, parentRoot: true, stateRoot: true, bodyRoot: true, canonical: true, signature: true })) } }),
	))


	// (Derived)
	const title = $derived(
		titleProp ?? `Slot #${selection.entitySelector.slot.toLocaleString()}`,
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(selection.entitySelector.slot)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selection.entitySelector.slot)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
		<span data-badge="small">
			#{String(selection.entitySelector.slot)}
		</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slot: one timestep for the proposer duty and attestations; slot length is defined by the chain’s consensus spec.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Proposer index</dt>
				<dd>
					<ResourceBoundary
						resource={slot}
						placeholderText="Loading slot…"
						>
							{#snippet children(slot)}
								{#if slot.fields.proposerIndex !== undefined}
									<NumberValue value={slot.fields.proposerIndex} />
								{/if}
							{/snippet}
						</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
						>
							{#snippet children(slot)}
								{#if slot.fields.epoch !== undefined}
									<BeaconEpochView
										selection={select(EntityType.BeaconEpoch, {
											$network: selection.entitySelector.$network,
											epoch: slot.fields.epoch,
										})}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Block root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
							>
								{#snippet children(slot)}
									{#if slot.fields.root !== undefined}
										<TruncatedValue
											value={slot.fields.root}
											format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Canonical</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
						>
							{#snippet children(slot)}
								{#if slot.fields.canonical !== undefined}
									{slot.fields.canonical ? 'Yes' : 'No'}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Parent root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
							>
								{#snippet children(slot)}
									{#if slot.fields.parentRoot !== undefined}
										<TruncatedValue
											value={slot.fields.parentRoot}
											format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>State root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
							>
								{#snippet children(slot)}
									{#if slot.fields.stateRoot !== undefined}
										<TruncatedValue
											value={slot.fields.stateRoot}
											format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Body root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
							>
								{#snippet children(slot)}
									{#if slot.fields.bodyRoot !== undefined}
										<TruncatedValue
											value={slot.fields.bodyRoot}
											format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Signature</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
							>
								{#snippet children(slot)}
									{#if slot.fields.signature !== undefined}
										<TruncatedValue
											value={slot.fields.signature}
											format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`beacon-slot:${String(selection.entitySelector.slot)}:contents`}
			sectionIdPrefix={`beacon-slot:${String(selection.entitySelector.slot)}`}
			sections={[
				{ id: 'slot-committees', label: 'Committees' },
				{ id: 'slot-attestations', label: 'Attestations' },
				{ id: 'slot-withdrawals', label: 'Withdrawals' },
				{ id: 'slot-slashings', label: 'Slashings' },
			]}
			data-card
		>
			{#snippet Summary({})}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<h3>Slot contents</h3>
				</header>
			{/snippet}

			{#snippet SectionSlotCommittees({ id, label })}
				<BeaconCommitteesView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$beaconCommittees}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotAttestations({ id, label })}
				<BeaconAttestationsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$beaconAttestations}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotWithdrawals({ id, label })}
				<BeaconWithdrawalsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$beaconWithdrawals}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotSlashings({ id, label })}
				<BeaconSlashingsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$beaconSlashings}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
