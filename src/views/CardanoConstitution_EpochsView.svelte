<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Cardano constitution epochs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoConstitution_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CardanoConstitution_Epoch>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CardanoConstitution_EpochView from '$/views/CardanoConstitution_EpochView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet children(cardanoConstitutionEpochs)}
			{@const uniqueCardanoConstitutionEpochs = [...new Map(cardanoConstitutionEpochs.values.map((cardanoConstitutionEpoch) => [cardanoConstitutionEpoch[EntityMetaKey.SelectorKey], cardanoConstitutionEpoch])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoConstitution_Epoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cardanoConstitutionEpochs.totalCount}
				getKey={(cardanoConstitutionEpoch) => cardanoConstitutionEpoch[EntityMetaKey.SelectorKey]}
				items={uniqueCardanoConstitutionEpochs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cardano constitution epochs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cardanoConstitutionEpoch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CardanoConstitution_Epoch> })}
					{@const cardanoConstitutionEpochFields = { ...cardanoConstitutionEpoch[EntityMetaKey.Selector], ...cardanoConstitutionEpoch }}
					<CardanoConstitution_EpochView
						selection={select(EntityType.CardanoConstitution_Epoch, cardanoConstitutionEpoch[EntityMetaKey.Selector])}
						prefetched={cardanoConstitutionEpochFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.CardanoConstitution_Epoch}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
