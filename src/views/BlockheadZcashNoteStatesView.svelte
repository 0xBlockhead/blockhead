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
		title = 'Blockhead Zcash note states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashNoteStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZcashNoteState>
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
	import BlockheadZcashNoteStateView from '$/views/BlockheadZcashNoteStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashNoteState}
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
				noteCommitment: true,
				pool: true,
				valueZatoshis: true,
			},
		})
	}
	getResourceItems={(blockheadZcashNoteStates) => [...new Map(blockheadZcashNoteStates.values.map((blockheadZcashNoteState) => [blockheadZcashNoteState[EntityMetaKey.SelectorKey], blockheadZcashNoteState])).values()]}
	getKey={(blockheadZcashNoteState) => blockheadZcashNoteState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash note states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashNoteState })}
		{@const blockheadZcashNoteStateFields = { ...blockheadZcashNoteState[EntityMetaKey.Selector], ...blockheadZcashNoteState }}
		{@const selection = select(EntityType.BlockheadZcashNoteState, blockheadZcashNoteState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZcashNoteStateView
			selection={selection}
			prefetched={blockheadZcashNoteStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
