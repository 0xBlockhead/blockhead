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
		title = 'Blockhead 0G storage proofs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZeroGStorageProofs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadZeroGStorageProof>
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
	import BlockheadZeroGStorageProofView from '$/views/BlockheadZeroGStorageProofView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					proofId: true,
					verified: true,
					proofKind: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadZeroGStorageProof}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadZeroGStorageProofs)}
			{@const uniqueBlockheadZeroGStorageProofs = [...new Map(blockheadZeroGStorageProofs.values.map((blockheadZeroGStorageProof) => [blockheadZeroGStorageProof[EntityMetaKey.SelectorKey], blockheadZeroGStorageProof])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadZeroGStorageProof}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadZeroGStorageProofs.totalCount}
				getKey={(blockheadZeroGStorageProof) => blockheadZeroGStorageProof[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadZeroGStorageProofs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead zero g storage proofs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadZeroGStorageProof }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadZeroGStorageProof> })}
					{@const blockheadZeroGStorageProofFields = { ...blockheadZeroGStorageProof[EntityMetaKey.Selector], ...blockheadZeroGStorageProof }}
					<BlockheadZeroGStorageProofView
						selection={select(EntityType.BlockheadZeroGStorageProof, blockheadZeroGStorageProof[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadZeroGStorageProofFields}
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
		entityType={EntityType.BlockheadZeroGStorageProof}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
