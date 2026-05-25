<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
			{
				networkId: String(entityId.$network.chainId),
				slotNumber: String(entityId.slot),
			},
		),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: typeof BeaconSlotSchema.id.infer
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const slot = useEntity(
		EntityType.BeaconSlot,
		entityId,
		{
			$: [
				Source.Beacon_Rest,
			],
			proposerIndex: {},
			...(open && {
				epoch: {},
				root: {},
				parentRoot: {},
				stateRoot: {},
				bodyRoot: {},
				canonical: {},
			}),
		},
	)


	// (Derived)
	const title = $derived(
		titleProp ?? `Slot ${entityId.slot.toLocaleString()}`,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	{entityId}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(entityId.slot)}
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slot: one timestep for the proposer duty and attestations; slot length is defined by the chain’s consensus spec.
		</p>
	{/snippet}

	{#snippet Heading()}
		<span>
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet Value()}
		<span
			data-badge="small"
			data-slot-number={String(entityId.slot)}
		>
			{String(entityId.slot)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
			<span
				data-badge="small"
				data-slot-number={String(entityId.slot)}
			>
				{String(entityId.slot)}
			</span>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Consensus proposer index</dt>
				<dd>
					<ResourceBoundary
						resource={slot}
						placeholderText="Loading slot…"
					>
						{#snippet children(loadedSlot)}
							<NumberValue value={loadedSlot.proposerIndex} />
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
							{#snippet children(loadedSlot)}
								{#if loadedSlot.epoch !== undefined}
									<BeaconEpochView
										entityId={{
											$network: entityId.$network,
											epoch: loadedSlot.epoch,
										}}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
						>
							{#snippet children(loadedSlot)}
								{#if loadedSlot.root !== undefined && loadedSlot.root !== ''}
									<TruncatedValue
										value={loadedSlot.root}
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
							{#snippet children(loadedSlot)}
								{#if loadedSlot.canonical !== undefined}
									{loadedSlot.canonical ? 'Yes' : 'No'}
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
							{#snippet children(loadedSlot)}
								{#if loadedSlot.parentRoot !== undefined && loadedSlot.parentRoot !== ''}
									<TruncatedValue
										value={loadedSlot.parentRoot}
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
							{#snippet children(loadedSlot)}
								{#if loadedSlot.stateRoot !== undefined && loadedSlot.stateRoot !== ''}
									<TruncatedValue
										value={loadedSlot.stateRoot}
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
							{#snippet children(loadedSlot)}
								{#if loadedSlot.bodyRoot !== undefined && loadedSlot.bodyRoot !== ''}
									<TruncatedValue
										value={loadedSlot.bodyRoot}
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
		<EntityDetails
			entityType={EntityType.BeaconSlot}
			{entityId}
		/>
	{/snippet}
</EntityView>

