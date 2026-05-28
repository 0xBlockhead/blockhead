<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		title = 'Validators',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconValidator>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconValidator}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Beacon_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const validators = derive(
				network,
				(network): Entity<typeof schema, EntityType.BeaconValidator>[] => (
					network[entityFieldReference.fieldName]
					?? []
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<ResourceBoundary
					placeholderText="Loading validators…"
					resource={validators}
				>
					{#snippet children(validators)}
						<OrderedList
							getKey={(row) => (
								String(row[EntityMetaKey.Id].validatorIndex)
							)}
							items={validators}
							orientation={ListOrientation.Column}
							placeholderRanges={[]}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No validators yet.
								</p>
							{/snippet}

							{#snippet Item({ item })}
								<BeaconValidatorView
									entityId={item[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/snippet}
						</OrderedList>
					{/snippet}
				</ResourceBoundary>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
