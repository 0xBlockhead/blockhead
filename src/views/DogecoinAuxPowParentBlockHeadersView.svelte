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
		title = 'Dogecoin aux pow parent block headers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinAuxPowParentBlockHeaders-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DogecoinAuxPowParentBlockHeader>
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
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
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
				$auxPow: true,
				merkleRoot: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dogecoinAuxPowParentBlockHeaders) => [...new Map(dogecoinAuxPowParentBlockHeaders.values.map((dogecoinAuxPowParentBlockHeader) => [dogecoinAuxPowParentBlockHeader[EntityMetaKey.SelectorKey], dogecoinAuxPowParentBlockHeader])).values()]}
	getKey={(dogecoinAuxPowParentBlockHeader) => dogecoinAuxPowParentBlockHeader[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dogecoin aux pow parent block headers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dogecoinAuxPowParentBlockHeader })}
		{@const dogecoinAuxPowParentBlockHeaderFields = { ...dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector], ...dogecoinAuxPowParentBlockHeader }}
		<EntityView
			entityType={EntityType.DogecoinAuxPowParentBlockHeader}
			entitySelector={dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[(String((dogecoinAuxPowParentBlockHeaderFields.$auxPow.$block.height) ?? '') ? 'Block #' + String((dogecoinAuxPowParentBlockHeaderFields.$auxPow.$block.height) ?? '') : '') || [String((dogecoinAuxPowParentBlockHeaderFields.$auxPow.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'dogecoin block aux pow'].filter(Boolean).join(' ') || 'dogecoin aux pow parent block header'}
			{/snippet}

			{#snippet Value()}
				{[String((dogecoinAuxPowParentBlockHeaderFields.merkleRoot) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
