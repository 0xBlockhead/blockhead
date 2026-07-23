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
		title = 'Cardano script witnesses',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoScriptWitnesses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoScriptWitness>
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
	entityType={EntityType.CardanoScriptWitness}
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
				scriptKind: true,
				witnessIndex: true,
				scriptHash: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoScriptWitnesses) => [...new Map(cardanoScriptWitnesses.values.map((cardanoScriptWitness) => [cardanoScriptWitness[EntityMetaKey.SelectorKey], cardanoScriptWitness])).values()]}
	getKey={(cardanoScriptWitness) => cardanoScriptWitness[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano script witnesses yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoScriptWitness })}
		{@const cardanoScriptWitnessFields = { ...cardanoScriptWitness[EntityMetaKey.Selector], ...cardanoScriptWitness }}
		<EntityView
			entityType={EntityType.CardanoScriptWitness}
			entitySelector={cardanoScriptWitness[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoScriptWitnessFields.scriptKind) ?? ''), (String((cardanoScriptWitnessFields.witnessIndex) ?? '') ? 'Script #' + String((cardanoScriptWitnessFields.witnessIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano script witness'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoScriptWitnessFields.scriptHash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
