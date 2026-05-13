<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'

	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'


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
			entityId: typeof BeaconEpochSchema.id.infer
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
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
			{
				networkId: String(entityId.$network.chainId),
				epochNumber: String(entityId.epoch),
			},
		)
	)

	const title = titleProp ?? `Epoch ${entityId.epoch.toLocaleString()}`

	const epoch = useEntity(
		EntityType.BeaconEpoch,
		entityId,
		{
			$: [
				Source.Beacon_Rest,
			],
			startSlot: {},
			endSlot: {},
			slotCount: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	{title}
	{href}
	{layout}
	{open}
	idDragPlainText={String(entityId.epoch)}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<ResourceBoundary resource={epoch}>
				{#snippet children(e)}
					{#if e.startSlot !== undefined}
						{#if e.endSlot !== undefined}
							<div>
								<dt>Slot range</dt>
								<dd>
									<NumberValue value={e.startSlot} />
									to
									<NumberValue value={e.endSlot} />
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if e.slotCount !== undefined}
							<div>
								<dt>Slots</dt>
								<dd>
									<NumberValue value={e.slotCount} />
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if e.slotCount === undefined}
							<div>
								<dt>Slots</dt>
								<dd data-text="muted">Slot data unavailable.</dd>
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
			entityType={EntityType.BeaconEpoch}
			{entityId}
		/>

		<BeaconSlotsView
			entityFieldReference={{
				entityType: EntityType.BeaconEpoch,
				entityId,
				fieldName: '$$beaconSlots',
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/beacon-slots',
				{
					networkId: String(entityId.$network.chainId),
				},
			)}
			id={`${stringify(entityId)}:beacon-slots`}
			open={false}
			title="Slots"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
