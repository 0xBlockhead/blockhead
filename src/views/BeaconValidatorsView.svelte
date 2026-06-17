<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
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

	import { proxy } from '$/routes/+layout.svelte'

	


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
				resource={proxy(
						EntityType.EvmNetwork,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [
							Source.Beacon_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading validators…"
			>
				{#snippet children(validators)}
			{#key stringify(entityFieldReference.selector)}
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
