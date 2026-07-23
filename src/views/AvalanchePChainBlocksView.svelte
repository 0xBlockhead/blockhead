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
		title = 'Avalanche p chain blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalanchePChainBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalanchePChainBlock>
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
	entityType={EntityType.AvalanchePChainBlock}
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
				height: true,
				timestampMs: true,
				blockId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(avalanchePChainBlocks) => [...new Map(avalanchePChainBlocks.values.map((avalanchePChainBlock) => [avalanchePChainBlock[EntityMetaKey.SelectorKey], avalanchePChainBlock])).values()]}
	getKey={(avalanchePChainBlock) => avalanchePChainBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche p chain blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalanchePChainBlock })}
		{@const avalanchePChainBlockFields = { ...avalanchePChainBlock[EntityMetaKey.Selector], ...avalanchePChainBlock }}
		<EntityView
			entityType={EntityType.AvalanchePChainBlock}
			entitySelector={avalanchePChainBlock[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalanchePChainBlockFields.height) ?? '')].filter(Boolean).join(' ') || [String((avalanchePChainBlockFields.blockId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain block'}
			{/snippet}

			{#snippet Value()}
				{[String((avalanchePChainBlockFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
