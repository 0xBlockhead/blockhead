<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Near execution outcomes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NearExecutionOutcomes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NearExecutionOutcome>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NearExecutionOutcomeView from '$/views/NearExecutionOutcomeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearExecutionOutcome}
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
				outcomeId: true,
				status: true,
				gasBurnt: true,
			},
		})
	}
	getResourceItems={(nearExecutionOutcomes) => [...new Map(nearExecutionOutcomes.values.map((nearExecutionOutcome) => [nearExecutionOutcome[EntityMetaKey.SelectorKey], nearExecutionOutcome])).values()]}
	getKey={(nearExecutionOutcome) => nearExecutionOutcome[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Near execution outcomes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nearExecutionOutcome })}
		{@const nearExecutionOutcomeFields = { ...nearExecutionOutcome[EntityMetaKey.Selector], ...nearExecutionOutcome }}
		{@const selection = select(EntityType.NearExecutionOutcome, nearExecutionOutcome[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<NearExecutionOutcomeView
			selection={selection}
			prefetched={nearExecutionOutcomeFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
