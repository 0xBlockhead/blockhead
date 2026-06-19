<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Neurons',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BittensorNeuron>
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
			<ResourceBoundary
				resource={selection({
						sources: [Source.Bittensor_JsonRpc],
						limit: 32,
					})}
				placeholderText="Loading neurons…"
			>
				{#snippet children(neurons)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BittensorNeuron}
						id={`${id}-items`}
						href={href}
						getKey={(neuron) => stringify(neuron.entitySelector)}
						getSortValue={(neuron) => neuron.entitySelector.uid}
						open={true}
						items={neurons.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No neurons listed yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BittensorNeuronView
							selection={select(EntityType.BittensorNeuron, item.entitySelector)}
							layout={EntityLayout.SummaryInline}
						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
