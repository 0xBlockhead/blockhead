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
		title = 'Cardano stake delegation epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoStakeDelegation_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoStakeDelegation_Epoch>
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
	import CardanoStakeDelegation_EpochView from '$/views/CardanoStakeDelegation_EpochView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakeDelegation_Epoch}
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
	getResourceItems={(cardanoStakeDelegationEpochs) => [...new Map(cardanoStakeDelegationEpochs.values.map((cardanoStakeDelegationEpoch) => [cardanoStakeDelegationEpoch[EntityMetaKey.SelectorKey], cardanoStakeDelegationEpoch])).values()]}
	getKey={(cardanoStakeDelegationEpoch) => cardanoStakeDelegationEpoch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano stake delegation epochs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoStakeDelegationEpoch })}
		{@const cardanoStakeDelegationEpochFields = { ...cardanoStakeDelegationEpoch[EntityMetaKey.Selector], ...cardanoStakeDelegationEpoch }}
		{@const selection = select(EntityType.CardanoStakeDelegation_Epoch, cardanoStakeDelegationEpoch[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CardanoStakeDelegation_EpochView
			selection={selection}
			prefetched={cardanoStakeDelegationEpochFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
