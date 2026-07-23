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
		title = 'Blockhead Kaspa node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadKaspaNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadKaspaNodeState>
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
	entityType={EntityType.BlockheadKaspaNodeState}
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
				networkId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadKaspaNodeStates) => [...new Map(blockheadKaspaNodeStates.values.map((blockheadKaspaNodeState) => [blockheadKaspaNodeState[EntityMetaKey.SelectorKey], blockheadKaspaNodeState])).values()]}
	getKey={(blockheadKaspaNodeState) => blockheadKaspaNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead kaspa node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadKaspaNodeState })}
		{@const blockheadKaspaNodeStateFields = { ...blockheadKaspaNodeState[EntityMetaKey.Selector], ...blockheadKaspaNodeState }}
		<EntityView
			entityType={EntityType.BlockheadKaspaNodeState}
			entitySelector={blockheadKaspaNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadKaspaNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead kaspa node state'}
			{/snippet}

			{#snippet Value()}
				{[[[String((blockheadKaspaNodeStateFields.$network.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadKaspaNodeStateFields.$network.$network.caip2 == null ? '' : String(`${(blockheadKaspaNodeStateFields.$network.$network.caip2).namespace}:${(blockheadKaspaNodeStateFields.$network.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'kaspa network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadKaspaNodeStateFields.networkId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
