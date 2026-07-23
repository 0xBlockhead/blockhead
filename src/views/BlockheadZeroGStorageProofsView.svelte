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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZeroGStorageProof>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageProof}
			entitySelector={blockheadZeroGStorageProof[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZeroGStorageProofFields.proofId) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage proof'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadZeroGStorageProofFields.verified) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadZeroGStorageProofFields.proofKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
