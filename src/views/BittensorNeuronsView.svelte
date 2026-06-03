<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Neurons',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BittensorNeuron>
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
	import BittensorNeuronView from '$/views/BittensorNeuronView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BittensorNeuron}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Neurons are subnet participants addressed by uid within a subnet metagraph.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Bittensor_JsonRpc,
						],
						$limit: 32,
					},
				},
			)}
			{@const neurons = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.BittensorNeuron>[] => (
					(parent[entityFieldReference.fieldName] ?? []).slice(0, 32)
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BittensorNeuron}
				id={`${id}-items`}
				href={href}
				getKey={(neuron) => stringify(neuron[EntityMetaKey.Id])}
				getSortValue={(neuron) => neuron[EntityMetaKey.Id].uid}
				open={true}
				resource={neurons}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No neurons listed yet.
					</p>
				{/snippet}

				{#snippet Item(context)}
					<BittensorNeuronView
						entityId={context!.item[EntityMetaKey.Id]}
						layout={EntityLayout.SummaryInline}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
