<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import { ListOrientation } from '$/components/ListOrientation.ts'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Validators',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconValidator>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		(
			open ?
				{
					$$beaconValidators: {
						$: [
							Source.Beacon_Rest,
						],
					},
				}
			:
				{}
		),
	)

	const validators = derive(
		network,
		(loaded): Entity<typeof schema, EntityType.BeaconValidator>[] => (
			loaded.$$beaconValidators
			?? []
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BeaconValidator}
	{entityFieldReference}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<ResourceBoundary
				placeholderText="Loading validators…"
				resource={validators}
			>
				{#snippet children(loaded)}
					<OrderedList
						getKey={(row) => (
							String(row[EntityMetaKey.Id].validatorIndex)
						)}
						items={loaded}
						orientation={ListOrientation.Column}
						placeholderRanges={[]}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No validator indices yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{#if item}
								<BeaconValidatorView
									entityId={item[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/if}
						{/snippet}
					</OrderedList>
				{/snippet}
			</ResourceBoundary>
		{/key}
	{/snippet}
</EntitiesList>
