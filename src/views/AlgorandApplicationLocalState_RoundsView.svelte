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
		title = 'Algorand application local state rounds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AlgorandApplicationLocalState_Rounds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AlgorandApplicationLocalState_Round>
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
	import AlgorandApplicationLocalState_RoundView from '$/views/AlgorandApplicationLocalState_RoundView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandApplicationLocalState_Round}
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
	getResourceItems={(algorandApplicationLocalStateRounds) => [...new Map(algorandApplicationLocalStateRounds.values.map((algorandApplicationLocalStateRound) => [algorandApplicationLocalStateRound[EntityMetaKey.SelectorKey], algorandApplicationLocalStateRound])).values()]}
	getKey={(algorandApplicationLocalStateRound) => algorandApplicationLocalStateRound[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Algorand application local state rounds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: algorandApplicationLocalStateRound })}
		{@const algorandApplicationLocalStateRoundFields = { ...algorandApplicationLocalStateRound[EntityMetaKey.Selector], ...algorandApplicationLocalStateRound }}
		{@const selection = select(EntityType.AlgorandApplicationLocalState_Round, algorandApplicationLocalStateRound[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AlgorandApplicationLocalState_RoundView
			selection={selection}
			prefetched={algorandApplicationLocalStateRoundFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
