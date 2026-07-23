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
		title = 'Blockhead Cashu proofs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuProofs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuProof>
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
	entityType={EntityType.BlockheadCashuProof}
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
				secretHash: true,
				amount: true,
				unit: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuProofs) => [...new Map(blockheadCashuProofs.values.map((blockheadCashuProof) => [blockheadCashuProof[EntityMetaKey.SelectorKey], blockheadCashuProof])).values()]}
	getKey={(blockheadCashuProof) => blockheadCashuProof[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu proofs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuProof })}
		{@const blockheadCashuProofFields = { ...blockheadCashuProof[EntityMetaKey.Selector], ...blockheadCashuProof }}
		<EntityView
			entityType={EntityType.BlockheadCashuProof}
			entitySelector={blockheadCashuProof[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuProofFields.secretHash) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu proof'}
			{/snippet}

			{#snippet Value()}
				{[(String((blockheadCashuProofFields.amount) ?? '') ? String((blockheadCashuProofFields.amount) ?? '') + blockheadCashuProofFields.unit : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
