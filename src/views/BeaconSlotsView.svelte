<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Slots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSlot>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					entityFieldReference.entityType === EntityType.EvmNetwork ?
						{
							fields: {
								[entityFieldReference.fieldName]: { sources: [Source.Beacon_Rest] },
							},
						}
					:
						{
							fields: {
								[entityFieldReference.fieldName]: { sources: [Source.Beacon_Rest] },
							},
						}
				),
			)}
			{@const slots = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.BeaconSlot>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BeaconSlot}
				id={`${id}-items`}
				href={href}
				getKey={(slot) => stringify(slot[EntityMetaKey.Selector])}
				getSortValue={(slot) => -slot[EntityMetaKey.Selector].slot}
				resource={slots}
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
						selector={slot[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
