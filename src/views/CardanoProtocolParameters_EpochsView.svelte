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
		title = 'Cardano protocol parameters epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoProtocolParameters_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoProtocolParameters_Epoch>
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
	entityType={EntityType.CardanoProtocolParameters_Epoch}
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
	{countResource}
	getResourceItems={(cardanoProtocolParametersEpochs) => [...new Map(cardanoProtocolParametersEpochs.values.map((cardanoProtocolParametersEpoch) => [cardanoProtocolParametersEpoch[EntityMetaKey.SelectorKey], cardanoProtocolParametersEpoch])).values()]}
	getKey={(cardanoProtocolParametersEpoch) => cardanoProtocolParametersEpoch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano protocol parameters epochs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoProtocolParametersEpoch })}
		{@const cardanoProtocolParametersEpochFields = { ...cardanoProtocolParametersEpoch[EntityMetaKey.Selector], ...cardanoProtocolParametersEpoch }}
		<EntityView
			entityType={EntityType.CardanoProtocolParameters_Epoch}
			entitySelector={cardanoProtocolParametersEpoch[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'Cardano protocol parameters epoch'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
