<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Bittensor neurons',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorNeurons-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BittensorNeuron>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNeuron}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				uid: true,
				$subnet: {
					fields: {
						name: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(bittensorNeurons) => [...new Map(bittensorNeurons.values.map((bittensorNeuron) => [bittensorNeuron[EntityMetaKey.SelectorKey], bittensorNeuron])).values()]}
	getKey={(bittensorNeuron) => bittensorNeuron[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bittensor neurons yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bittensorNeuron })}
		{@const bittensorNeuronFields = { ...bittensorNeuron[EntityMetaKey.Selector], ...bittensorNeuron }}
		<EntityView
			entityType={EntityType.BittensorNeuron}
			entitySelector={bittensorNeuron[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bittensorNeuronFields.uid) ?? '')].filter(Boolean).join(' ') || 'Bittensor neuron'}
			{/snippet}

			{#snippet Value()}
				{[[String((bittensorNeuronFields.$subnet.name) ?? ''), String((bittensorNeuronFields.$subnet.netuid) ?? '')].filter(Boolean).join(' ') || 'Bittensor subnet'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
