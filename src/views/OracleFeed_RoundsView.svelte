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
		title = 'Oracle feed rounds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'OracleFeed_Rounds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.OracleFeed_Round>
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
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed_Round}
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
				roundId: true,
				answer: true,
				updatedAtMs: true,
			},
		})
	}
	getResourceItems={(oracleFeedRounds) => [...new Map(oracleFeedRounds.values.map((oracleFeedRound) => [oracleFeedRound[EntityMetaKey.SelectorKey], oracleFeedRound])).values()]}
	getKey={(oracleFeedRound) => oracleFeedRound[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Oracle feed rounds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: oracleFeedRound })}
		{@const oracleFeedRoundFields = { ...oracleFeedRound[EntityMetaKey.Selector], ...oracleFeedRound }}
		{@const selection = select(EntityType.OracleFeed_Round, oracleFeedRound[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<OracleFeed_RoundView
			selection={selection}
			prefetched={oracleFeedRoundFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
