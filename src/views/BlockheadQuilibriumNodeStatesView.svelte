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
		title = 'Blockhead Quilibrium node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadQuilibriumNodeState>
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
	entityType={EntityType.BlockheadQuilibriumNodeState}
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
				connectionId: true,
				$network: true,
				endpoint: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadQuilibriumNodeStates) => [...new Map(blockheadQuilibriumNodeStates.values.map((blockheadQuilibriumNodeState) => [blockheadQuilibriumNodeState[EntityMetaKey.SelectorKey], blockheadQuilibriumNodeState])).values()]}
	getKey={(blockheadQuilibriumNodeState) => blockheadQuilibriumNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumNodeState })}
		{@const blockheadQuilibriumNodeStateFields = { ...blockheadQuilibriumNodeState[EntityMetaKey.Selector], ...blockheadQuilibriumNodeState }}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState}
			entitySelector={blockheadQuilibriumNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadQuilibriumNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium node state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadQuilibriumNodeStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadQuilibriumNodeStateFields.$network.caip2 == null ? '' : String(`${(blockheadQuilibriumNodeStateFields.$network.caip2).namespace}:${(blockheadQuilibriumNodeStateFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadQuilibriumNodeStateFields.endpoint) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
