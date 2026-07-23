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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NearExecutionOutcome>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.NearExecutionOutcome}
			entitySelector={nearExecutionOutcome[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((nearExecutionOutcomeFields.outcomeId) ?? '')].filter(Boolean).join(' ') || 'near execution outcome'}
			{/snippet}

			{#snippet Value()}
				{[String((nearExecutionOutcomeFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nearExecutionOutcomeFields.gasBurnt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
