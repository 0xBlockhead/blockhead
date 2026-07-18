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
		title = 'Blockhead Quilibrium account states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumAccountStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadQuilibriumAccountState>
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
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumAccountState}
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
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
	getResourceItems={(blockheadQuilibriumAccountStates) => [...new Map(blockheadQuilibriumAccountStates.values.map((blockheadQuilibriumAccountState) => [blockheadQuilibriumAccountState[EntityMetaKey.SelectorKey], blockheadQuilibriumAccountState])).values()]}
	getKey={(blockheadQuilibriumAccountState) => blockheadQuilibriumAccountState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium account states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumAccountState })}
		{@const blockheadQuilibriumAccountStateFields = { ...blockheadQuilibriumAccountState[EntityMetaKey.Selector], ...blockheadQuilibriumAccountState }}
		{@const selection = select(EntityType.BlockheadQuilibriumAccountState, blockheadQuilibriumAccountState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadQuilibriumAccountStateView
			selection={selection}
			prefetched={blockheadQuilibriumAccountStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
