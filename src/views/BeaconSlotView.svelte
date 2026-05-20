<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href: hrefProp,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: typeof BeaconSlotSchema.id.infer
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	const href = (
		hrefProp ?? resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
			{
				networkId: String(entityId.$network.chainId),
				slotNumber: String(entityId.slot),
			},
		)
	)

	const title = titleProp ?? `Slot ${entityId.slot.toLocaleString()}`

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
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	{entityId}
	{title}
	{href}
	{layout}
	bind:open
	idDragPlainText={String(entityId.slot)}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slot: one timestep for the proposer duty and attestations; slot length is defined by the chain’s consensus spec.
		</p>
	{/snippet}

	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
			<span
				data-badge="small"
				data-text="font-monospace"
				data-slot-number={String(entityId.slot)}
			>
				{String(entityId.slot)}
			</span>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={slot}
				placeholderText="Loading slot…"
			>
				{#snippet children(slot)}
					<div>
						<dt>Consensus proposer index</dt>
						<dd>
							<NumberValue value={slot.proposerIndex} />
						</dd>
					</div>
					{#if open}
						{#if slot.epoch !== undefined}
							<div>
								<dt>Epoch</dt>
								<dd>
									<BeaconEpochView
										entityId={{
											$network: entityId.$network,
											epoch: slot.epoch,
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
											{
												networkId: String(entityId.$network.chainId),
												epochNumber: String(slot.epoch),
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if slot.root !== undefined && slot.root !== ''}
							<div>
								<dt>Root</dt>
								<dd>
									<TruncatedValue
										value={slot.root}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if slot.canonical !== undefined}
							<div>
								<dt>Canonical</dt>
								<dd>{slot.canonical ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if slot.parentRoot !== undefined && slot.parentRoot !== ''}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue
										value={slot.parentRoot}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if slot.stateRoot !== undefined && slot.stateRoot !== ''}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue
										value={slot.stateRoot}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if slot.bodyRoot !== undefined && slot.bodyRoot !== ''}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue
										value={slot.bodyRoot}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BeaconSlot}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
