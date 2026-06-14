<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
			href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(beacon-slots)/slot/[slotNumber]', {
				caip2Namespace: selector.$network.caip2.namespace,
				caip2Reference: selector.$network.caip2.reference,
				slotNumber: String(selector.slot),
			}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: typeof BeaconSlotSchema.id.infer
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

	const slot = subscribe(EntityType.BeaconSlot,
		selector,
		({ sources: [
				Source.Beacon_Rest,
			], fields: { proposerIndex: true, ...(open && ({ epoch: true, root: true, parentRoot: true, stateRoot: true, bodyRoot: true, canonical: true, signature: true })) } }),
	)


	// (Derived)
	const title = $derived(
		titleProp ?? `Slot #${selector.slot.toLocaleString()}`,
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
	entitySelector={selector}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(selector.slot)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selector.slot)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
		<span data-badge="small">
			#{String(selector.slot)}
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
										selector={{
											$network: selector.$network,
											epoch: slot.fields.epoch,
										}}
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
			id={`beacon-slot:${String(selector.slot)}:contents`}
			sectionIdPrefix={`beacon-slot:${String(selector.slot)}`}
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
					entityFieldReference={{
						entityType: EntityType.BeaconSlot,
						selector,
						fieldName: '$$beaconCommittees',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotAttestations({ id, label })}
				<BeaconAttestationsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.BeaconSlot,
						selector,
						fieldName: '$$beaconAttestations',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotWithdrawals({ id, label })}
				<BeaconWithdrawalsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.BeaconSlot,
						selector,
						fieldName: '$$beaconWithdrawals',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionSlotSlashings({ id, label })}
				<BeaconSlashingsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.BeaconSlot,
						selector,
						fieldName: '$$beaconSlashings',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
