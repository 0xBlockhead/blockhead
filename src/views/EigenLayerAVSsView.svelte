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
		title = 'EigenLayer AVSs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAVSs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerAvs>
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
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAvs}
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
				avsAddress: true,
				name: true,
				$network: true,
			},
		})
	}
	getResourceItems={(eigenLayerAVSs) => [...new Map(eigenLayerAVSs.values.map((eigenLayerAvs) => [eigenLayerAvs[EntityMetaKey.SelectorKey], eigenLayerAvs])).values()]}
	getKey={(eigenLayerAvs) => eigenLayerAvs[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EigenLayer AVSs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerAvs })}
		{@const eigenLayerAvsFields = { ...eigenLayerAvs[EntityMetaKey.Selector], ...eigenLayerAvs }}
		{@const selection = select(EntityType.EigenLayerAvs, eigenLayerAvs[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerAvsView
			selection={selection}
			prefetched={eigenLayerAvsFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
