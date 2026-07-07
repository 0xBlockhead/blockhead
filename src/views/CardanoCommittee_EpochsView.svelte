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
		title = 'Cardano committee epochs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoCommittee_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CardanoCommittee_Epoch>
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
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
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
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoCommittee_Epoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cardanoCommitteeEpochs)}
			{@const uniqueCardanoCommitteeEpochs = [...new Map(cardanoCommitteeEpochs.values.map((cardanoCommitteeEpoch) => [cardanoCommitteeEpoch[EntityMetaKey.SelectorKey], cardanoCommitteeEpoch])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoCommittee_Epoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cardanoCommitteeEpochs.totalCount}
				getKey={(cardanoCommitteeEpoch) => cardanoCommitteeEpoch[EntityMetaKey.SelectorKey]}
				items={uniqueCardanoCommitteeEpochs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cardano committee epochs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cardanoCommitteeEpoch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CardanoCommittee_Epoch> })}
					{@const cardanoCommitteeEpochFields = { ...cardanoCommitteeEpoch[EntityMetaKey.Selector], ...cardanoCommitteeEpoch }}
					<CardanoCommittee_EpochView
						selection={select(EntityType.CardanoCommittee_Epoch, cardanoCommitteeEpoch[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cardanoCommitteeEpochFields}
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
		entityType={EntityType.CardanoCommittee_Epoch}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
