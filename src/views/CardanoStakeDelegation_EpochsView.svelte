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
		title = 'Cardano stake delegation epochs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoStakeDelegation_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CardanoStakeDelegation_Epoch>
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
	import CardanoStakeDelegation_EpochView from '$/views/CardanoStakeDelegation_EpochView.svelte'
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
				entityType={EntityType.CardanoStakeDelegation_Epoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cardanoStakeDelegationEpochs)}
			{@const uniqueCardanoStakeDelegationEpochs = [...new Map(cardanoStakeDelegationEpochs.values.map((cardanoStakeDelegationEpoch) => [cardanoStakeDelegationEpoch[EntityMetaKey.SelectorKey], cardanoStakeDelegationEpoch])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoStakeDelegation_Epoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cardanoStakeDelegationEpochs.totalCount}
				getKey={(cardanoStakeDelegationEpoch) => cardanoStakeDelegationEpoch[EntityMetaKey.SelectorKey]}
				items={uniqueCardanoStakeDelegationEpochs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cardano stake delegation epochs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cardanoStakeDelegationEpoch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CardanoStakeDelegation_Epoch> })}
					{@const cardanoStakeDelegationEpochFields = { ...cardanoStakeDelegationEpoch[EntityMetaKey.Selector], ...cardanoStakeDelegationEpoch }}
					<CardanoStakeDelegation_EpochView
						selection={select(EntityType.CardanoStakeDelegation_Epoch, cardanoStakeDelegationEpoch[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cardanoStakeDelegationEpochFields}
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
		entityType={EntityType.CardanoStakeDelegation_Epoch}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
