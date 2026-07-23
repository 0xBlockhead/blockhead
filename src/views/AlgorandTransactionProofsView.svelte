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
		title = 'Algorand transaction proofs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AlgorandTransactionProofs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AlgorandTransactionProof>
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
	entityType={EntityType.AlgorandTransactionProof}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	{countResource}
	getResourceItems={(algorandTransactionProofs) => [...new Map(algorandTransactionProofs.values.map((algorandTransactionProof) => [algorandTransactionProof[EntityMetaKey.SelectorKey], algorandTransactionProof])).values()]}
	getKey={(algorandTransactionProof) => algorandTransactionProof[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Algorand transaction proofs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: algorandTransactionProof })}
		{@const algorandTransactionProofFields = { ...algorandTransactionProof[EntityMetaKey.Selector], ...algorandTransactionProof }}
		<EntityView
			entityType={EntityType.AlgorandTransactionProof}
			entitySelector={algorandTransactionProof[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'algorand transaction proof'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
