<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Validators',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.Beacon_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading validators…"
			>
				{#snippet children(validators)}
			{#key stringify(selection.entitySelector)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.BeaconValidator}
					id={`${id}-items`}
					href={href}
					getKey={(validator) => String(validator.entitySelector.validatorIndex)}
					placeholderText="Loading validators…"
					items={validators.entities}
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
							selector={validator.entitySelector}
							layout={EntityLayout.Summary}

						/>
					{/snippet}
				</EntitiesList>
			{/key}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
