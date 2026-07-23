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
		title = 'Dogecoin aux pow merkle branches',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinAuxPowMerkleBranches-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DogecoinAuxPowMerkleBranch>
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
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
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
				branchKind: true,
				$auxPow: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dogecoinAuxPowMerkleBranches) => [...new Map(dogecoinAuxPowMerkleBranches.values.map((dogecoinAuxPowMerkleBranch) => [dogecoinAuxPowMerkleBranch[EntityMetaKey.SelectorKey], dogecoinAuxPowMerkleBranch])).values()]}
	getKey={(dogecoinAuxPowMerkleBranch) => dogecoinAuxPowMerkleBranch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dogecoin aux pow merkle branches yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dogecoinAuxPowMerkleBranch })}
		{@const dogecoinAuxPowMerkleBranchFields = { ...dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector], ...dogecoinAuxPowMerkleBranch }}
		<EntityView
			entityType={EntityType.DogecoinAuxPowMerkleBranch}
			entitySelector={dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((dogecoinAuxPowMerkleBranchFields.branchKind) ?? '')].filter(Boolean).join(' ') || 'dogecoin aux pow merkle branch'}
			{/snippet}

			{#snippet Value()}
				{[[(String((dogecoinAuxPowMerkleBranchFields.$auxPow.$block.height) ?? '') ? 'Block #' + String((dogecoinAuxPowMerkleBranchFields.$auxPow.$block.height) ?? '') : '') || [String((dogecoinAuxPowMerkleBranchFields.$auxPow.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'dogecoin block aux pow'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
