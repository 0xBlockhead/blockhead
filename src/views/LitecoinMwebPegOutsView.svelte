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
		title = 'Litecoin MWEB peg outs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebPegOuts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LitecoinMwebPegOut>
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
	import LitecoinMwebPegOutView from '$/views/LitecoinMwebPegOutView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebPegOut}
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
				$transaction: true,
				pegOutIndex: true,
				$transparentOutput: true,
			},
		})
	}
	getResourceItems={(litecoinMwebPegOuts) => [...new Map(litecoinMwebPegOuts.values.map((litecoinMwebPegOut) => [litecoinMwebPegOut[EntityMetaKey.SelectorKey], litecoinMwebPegOut])).values()]}
	getKey={(litecoinMwebPegOut) => litecoinMwebPegOut[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB peg outs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebPegOut })}
		{@const litecoinMwebPegOutFields = { ...litecoinMwebPegOut[EntityMetaKey.Selector], ...litecoinMwebPegOut }}
		{@const selection = select(EntityType.LitecoinMwebPegOut, litecoinMwebPegOut[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<LitecoinMwebPegOutView
			selection={selection}
			prefetched={litecoinMwebPegOutFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
