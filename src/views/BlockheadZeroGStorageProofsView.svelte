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
		title = 'Blockhead 0G storage proofs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZeroGStorageProofs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZeroGStorageProof>
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
	import BlockheadZeroGStorageProofView from '$/views/BlockheadZeroGStorageProofView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageProof}
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
				proofId: true,
				verified: true,
				proofKind: true,
			},
		})
	}
	getResourceItems={(blockheadZeroGStorageProofs) => [...new Map(blockheadZeroGStorageProofs.values.map((blockheadZeroGStorageProof) => [blockheadZeroGStorageProof[EntityMetaKey.SelectorKey], blockheadZeroGStorageProof])).values()]}
	getKey={(blockheadZeroGStorageProof) => blockheadZeroGStorageProof[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zero g storage proofs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZeroGStorageProof })}
		{@const blockheadZeroGStorageProofFields = { ...blockheadZeroGStorageProof[EntityMetaKey.Selector], ...blockheadZeroGStorageProof }}
		{@const selection = select(EntityType.BlockheadZeroGStorageProof, blockheadZeroGStorageProof[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZeroGStorageProofView
			selection={selection}
			prefetched={blockheadZeroGStorageProofFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
