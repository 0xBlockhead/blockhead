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
		title = 'Algorand application local state rounds',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AlgorandApplicationLocalState_Rounds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AlgorandApplicationLocalState_Round>
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
	import AlgorandApplicationLocalState_RoundView from '$/views/AlgorandApplicationLocalState_RoundView.svelte'
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
				entityType={EntityType.AlgorandApplicationLocalState_Round}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(algorandApplicationLocalStateRounds)}
			{@const uniqueAlgorandApplicationLocalStateRounds = [...new Map(algorandApplicationLocalStateRounds.values.map((algorandApplicationLocalStateRound) => [algorandApplicationLocalStateRound[EntityMetaKey.SelectorKey], algorandApplicationLocalStateRound])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AlgorandApplicationLocalState_Round}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={algorandApplicationLocalStateRounds.totalCount}
				getKey={(algorandApplicationLocalStateRound) => algorandApplicationLocalStateRound[EntityMetaKey.SelectorKey]}
				items={uniqueAlgorandApplicationLocalStateRounds}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Algorand application local state rounds yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: algorandApplicationLocalStateRound }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AlgorandApplicationLocalState_Round> })}
					{@const algorandApplicationLocalStateRoundFields = { ...algorandApplicationLocalStateRound[EntityMetaKey.Selector], ...algorandApplicationLocalStateRound }}
					<AlgorandApplicationLocalState_RoundView
						selection={select(EntityType.AlgorandApplicationLocalState_Round, algorandApplicationLocalStateRound[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={algorandApplicationLocalStateRoundFields}
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
		entityType={EntityType.AlgorandApplicationLocalState_Round}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
