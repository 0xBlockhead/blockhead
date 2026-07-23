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
		title = 'Blockhead session simulations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSessionSimulations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadSessionSimulation>
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
	entityType={EntityType.BlockheadSessionSimulation}
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
				status: true,
				createdAt: true,
				$session: {
					fields: {
						name: true,
						status: true,
						updatedAt: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadSessionSimulations) => [...new Map(blockheadSessionSimulations.values.map((blockheadSessionSimulation) => [blockheadSessionSimulation[EntityMetaKey.SelectorKey], blockheadSessionSimulation])).values()]}
	getKey={(blockheadSessionSimulation) => blockheadSessionSimulation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead session simulations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSessionSimulation })}
		{@const blockheadSessionSimulationFields = { ...blockheadSessionSimulation[EntityMetaKey.Selector], ...blockheadSessionSimulation }}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulation}
			entitySelector={blockheadSessionSimulation[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadSessionSimulationFields.status) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadSessionSimulationFields.createdAt) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadSessionSimulationFields.$session.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadSessionSimulationFields.$session.id) ?? '')].filter(Boolean).join(' ') || 'session'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
