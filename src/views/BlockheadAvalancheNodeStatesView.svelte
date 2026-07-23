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
		title = 'Blockhead Avalanche node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAvalancheNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAvalancheNodeState>
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
	entityType={EntityType.BlockheadAvalancheNodeState}
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
				nodeId: true,
				$network: true,
				nodeIp: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAvalancheNodeStates) => [...new Map(blockheadAvalancheNodeStates.values.map((blockheadAvalancheNodeState) => [blockheadAvalancheNodeState[EntityMetaKey.SelectorKey], blockheadAvalancheNodeState])).values()]}
	getKey={(blockheadAvalancheNodeState) => blockheadAvalancheNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead avalanche node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAvalancheNodeState })}
		{@const blockheadAvalancheNodeStateFields = { ...blockheadAvalancheNodeState[EntityMetaKey.Selector], ...blockheadAvalancheNodeState }}
		<EntityView
			entityType={EntityType.BlockheadAvalancheNodeState}
			entitySelector={blockheadAvalancheNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAvalancheNodeStateFields.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead avalanche node state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadAvalancheNodeStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadAvalancheNodeStateFields.$network.caip2 == null ? '' : String(`${(blockheadAvalancheNodeStateFields.$network.caip2).namespace}:${(blockheadAvalancheNodeStateFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAvalancheNodeStateFields.nodeIp) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
