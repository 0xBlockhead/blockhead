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
		title = 'Algorand asset holding rounds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AlgorandAssetHolding_Rounds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AlgorandAssetHolding_Round>
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
	import AlgorandAssetHolding_RoundView from '$/views/AlgorandAssetHolding_RoundView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAssetHolding_Round}
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
	getResourceItems={(algorandAssetHoldingRounds) => [...new Map(algorandAssetHoldingRounds.values.map((algorandAssetHoldingRound) => [algorandAssetHoldingRound[EntityMetaKey.SelectorKey], algorandAssetHoldingRound])).values()]}
	getKey={(algorandAssetHoldingRound) => algorandAssetHoldingRound[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Algorand asset holding rounds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: algorandAssetHoldingRound })}
		{@const algorandAssetHoldingRoundFields = { ...algorandAssetHoldingRound[EntityMetaKey.Selector], ...algorandAssetHoldingRound }}
		{@const selection = select(EntityType.AlgorandAssetHolding_Round, algorandAssetHoldingRound[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AlgorandAssetHolding_RoundView
			selection={selection}
			prefetched={algorandAssetHoldingRoundFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
