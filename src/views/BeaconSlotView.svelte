<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(beacon-slots)/slot/[slotNumber]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
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
				signature: {},
			}),
		},
	)


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
						{#snippet children(slot)}
							<NumberValue value={slot.proposerIndex} />
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
								{#if slot.epoch !== undefined}
									<BeaconEpochView
										entityId={{
											$network: entityId.$network,
											epoch: slot.epoch,
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
					<dt>Block root</dt>
					<dd>
						<ResourceBoundary
							resource={slot}
							placeholderText="Loading slot…"
						>
							{#snippet children(slot)}
								{#if slot.root !== undefined && slot.root !== ''}
									<TruncatedValue
										value={slot.root}
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
								{#if slot.canonical !== undefined}
									{slot.canonical ? 'Yes' : 'No'}
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
								{#if slot.parentRoot !== undefined && slot.parentRoot !== ''}
									<TruncatedValue
										value={slot.parentRoot}
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
								{#if slot.stateRoot !== undefined && slot.stateRoot !== ''}
									<TruncatedValue
										value={slot.stateRoot}
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
								{#if slot.bodyRoot !== undefined && slot.bodyRoot !== ''}
									<TruncatedValue
										value={slot.bodyRoot}
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
								{#if slot.signature !== undefined && slot.signature !== ''}
									<TruncatedValue
										value={slot.signature}
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
