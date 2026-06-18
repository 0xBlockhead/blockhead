<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type BeaconSlotsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.EvmNetwork,
		'$$beaconSlots'
	> | EntityProxyFieldResource<
		typeof schema,
		EntityType.BeaconEpoch,
		'$$beaconSlots'
	>

	// State
	let {
		selection,
		title = 'Slots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: BeaconSlotsResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slots ordered in time; proposer duties and attestations are scheduled per slot.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading slots…"
			>
				{#snippet children(slots)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BeaconSlot}
						id={`${id}-items`}
						href={href}
						getKey={(slot) => stringify(slot.entitySelector)}
						getSortValue={(slot) => -slot.entitySelector.slot}
						items={slots.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No slots yet.
							</p>
						{/snippet}

						{#snippet Item({ item: slot })}
							<BeaconSlotView
								selector={slot.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
