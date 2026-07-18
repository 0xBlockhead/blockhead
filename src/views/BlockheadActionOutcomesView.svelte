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
		title = 'Blockhead action outcomes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadActionOutcomes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadActionOutcome>
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
	import BlockheadActionOutcomeView from '$/views/BlockheadActionOutcomeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionOutcome}
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
				outcomeKind: true,
				transactionHash: true,
				createdAt: true,
			},
		})
	}
	getResourceItems={(blockheadActionOutcomes) => [...new Map(blockheadActionOutcomes.values.map((blockheadActionOutcome) => [blockheadActionOutcome[EntityMetaKey.SelectorKey], blockheadActionOutcome])).values()]}
	getKey={(blockheadActionOutcome) => blockheadActionOutcome[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead action outcomes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadActionOutcome })}
		{@const blockheadActionOutcomeFields = { ...blockheadActionOutcome[EntityMetaKey.Selector], ...blockheadActionOutcome }}
		{@const selection = select(EntityType.BlockheadActionOutcome, blockheadActionOutcome[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadActionOutcomeView
			selection={selection}
			prefetched={blockheadActionOutcomeFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
