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
		title = 'Blockhead agent provider calls',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProviderCalls-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentProviderCall>
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
	entityType={EntityType.BlockheadAgentProviderCall}
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
				indexInTurn: true,
				status: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentProviderCalls) => [...new Map(blockheadAgentProviderCalls.values.map((blockheadAgentProviderCall) => [blockheadAgentProviderCall[EntityMetaKey.SelectorKey], blockheadAgentProviderCall])).values()]}
	getKey={(blockheadAgentProviderCall) => blockheadAgentProviderCall[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent provider calls yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentProviderCall })}
		{@const blockheadAgentProviderCallFields = { ...blockheadAgentProviderCall[EntityMetaKey.Selector], ...blockheadAgentProviderCall }}
		<EntityView
			entityType={EntityType.BlockheadAgentProviderCall}
			entitySelector={blockheadAgentProviderCall[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((blockheadAgentProviderCallFields.indexInTurn) ?? '') ? 'Call #' + String((blockheadAgentProviderCallFields.indexInTurn) ?? '') : '') || 'blockhead agent provider call'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentProviderCallFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
