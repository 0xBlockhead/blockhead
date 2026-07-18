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
		title = 'Blockhead Algorand participation keys',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandParticipationKeys-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadAlgorandParticipationKey>
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
	import BlockheadAlgorandParticipationKeyView from '$/views/BlockheadAlgorandParticipationKeyView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAlgorandParticipationKey}
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
				participationId: true,
				nodeId: true,
				firstValidRound: true,
			},
		})
	}
	getResourceItems={(blockheadAlgorandParticipationKeys) => [...new Map(blockheadAlgorandParticipationKeys.values.map((blockheadAlgorandParticipationKey) => [blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey], blockheadAlgorandParticipationKey])).values()]}
	getKey={(blockheadAlgorandParticipationKey) => blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead algorand participation keys yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAlgorandParticipationKey })}
		{@const blockheadAlgorandParticipationKeyFields = { ...blockheadAlgorandParticipationKey[EntityMetaKey.Selector], ...blockheadAlgorandParticipationKey }}
		{@const selection = select(EntityType.BlockheadAlgorandParticipationKey, blockheadAlgorandParticipationKey[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadAlgorandParticipationKeyView
			selection={selection}
			prefetched={blockheadAlgorandParticipationKeyFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
