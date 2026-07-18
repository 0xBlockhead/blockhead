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
		title = 'Cardano constitution epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoConstitution_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoConstitution_Epoch>
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
	import CardanoConstitution_EpochView from '$/views/CardanoConstitution_EpochView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoConstitution_Epoch}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(cardanoConstitutionEpochs) => [...new Map(cardanoConstitutionEpochs.values.map((cardanoConstitutionEpoch) => [cardanoConstitutionEpoch[EntityMetaKey.SelectorKey], cardanoConstitutionEpoch])).values()]}
	getKey={(cardanoConstitutionEpoch) => cardanoConstitutionEpoch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano constitution epochs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoConstitutionEpoch })}
		{@const cardanoConstitutionEpochFields = { ...cardanoConstitutionEpoch[EntityMetaKey.Selector], ...cardanoConstitutionEpoch }}
		{@const selection = select(EntityType.CardanoConstitution_Epoch, cardanoConstitutionEpoch[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CardanoConstitution_EpochView
			selection={selection}
			prefetched={cardanoConstitutionEpochFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
