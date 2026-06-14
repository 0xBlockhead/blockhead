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
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Validators',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconValidator>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconValidator}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet body()}
		{#if open}
			{@const parent = subscribe(EntityType.EvmNetwork,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Beacon_Rest,
						],
						limit: 16,
					},
				} }),
			)}
			{@const validators = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.BeaconValidator>[] => (
					parent.fields[entityFieldReference.fieldName]?.values
					?? []
				),
			)}
			{#key stringify(entityFieldReference.selector)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.BeaconValidator}
					id={`${id}-items`}
					href={href}
					getKey={(validator) => String(validator[EntityMetaKey.Selector].validatorIndex)}
					placeholderText="Loading validators…"
					resource={validators}
					{title}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
					open={true}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No validators yet.
						</p>
					{/snippet}

					{#snippet Item({ item: validator })}
						<BeaconValidatorView
							selector={validator[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
