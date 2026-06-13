<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.CosmosValidator>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosValidator}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos validators participate in CometBFT consensus and SDK staking/slashing state.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.CosmosSdk_Rest,
						],
						limit: 32,
					},
				} }),
			)}
			{@const validators = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.CosmosValidator>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CosmosValidator}
				id={`${id}-items`}
				href={href}
				getKey={(validator) => stringify(validator[EntityMetaKey.Id])}
				getSortValue={(validator) => stringify(validator[EntityMetaKey.Id])}
				open={true}
				resource={validators}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No validators listed yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<CosmosValidatorView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
