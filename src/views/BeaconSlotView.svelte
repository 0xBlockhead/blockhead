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

	{#snippet Id()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Execution layer chain</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<ResourceBoundary
				resource={slot}
				placeholderText="Loading slot…"
			>
				{#snippet children(s)}
					<div>
						<dt>Consensus proposer index</dt>
						<dd>
							<NumberValue value={s.proposerIndex} />
						</dd>
					</div>
					{#if open}
						{#if s.epoch !== undefined}
							<div>
								<dt>Epoch</dt>
								<dd>
									<NumberValue value={s.epoch} />
								</dd>
							</div>
						{/if}

						{#if s.root !== undefined && s.root !== ''}
							<div>
								<dt>Root</dt>
								<dd>
									<TruncatedValue
										value={s.root}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if s.canonical !== undefined}
							<div>
								<dt>Canonical</dt>
								<dd>{s.canonical ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if s.parentRoot !== undefined && s.parentRoot !== ''}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue
										value={s.parentRoot}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if s.stateRoot !== undefined && s.stateRoot !== ''}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue
										value={s.stateRoot}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if s.bodyRoot !== undefined && s.bodyRoot !== ''}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue
										value={s.bodyRoot}
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
