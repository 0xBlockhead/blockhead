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
		title = 'Dogecoin block aux pows',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinBlockAuxPows-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DogecoinBlockAuxPow>
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
	entityType={EntityType.DogecoinBlockAuxPow}
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
				$block: true,
				$parentBlockHeader: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dogecoinBlockAuxPows) => [...new Map(dogecoinBlockAuxPows.values.map((dogecoinBlockAuxPow) => [dogecoinBlockAuxPow[EntityMetaKey.SelectorKey], dogecoinBlockAuxPow])).values()]}
	getKey={(dogecoinBlockAuxPow) => dogecoinBlockAuxPow[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dogecoin block aux pows yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dogecoinBlockAuxPow })}
		{@const dogecoinBlockAuxPowFields = { ...dogecoinBlockAuxPow[EntityMetaKey.Selector], ...dogecoinBlockAuxPow }}
		<EntityView
			entityType={EntityType.DogecoinBlockAuxPow}
			entitySelector={dogecoinBlockAuxPow[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((dogecoinBlockAuxPowFields.$block.height) ?? '') ? 'Block #' + String((dogecoinBlockAuxPowFields.$block.height) ?? '') : '') || [String((dogecoinBlockAuxPowFields.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'dogecoin block aux pow'}
			{/snippet}

			{#snippet Value()}
				{['dogecoin aux pow parent block header'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
