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
		title = 'Blockhead Logos blockchain node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLogosBlockchainNodeState>
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
	entityType={EntityType.BlockheadLogosBlockchainNodeState}
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
				peerId: true,
				connectionId: true,
				endpoint: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLogosBlockchainNodeStates) => [...new Map(blockheadLogosBlockchainNodeStates.values.map((blockheadLogosBlockchainNodeState) => [blockheadLogosBlockchainNodeState[EntityMetaKey.SelectorKey], blockheadLogosBlockchainNodeState])).values()]}
	getKey={(blockheadLogosBlockchainNodeState) => blockheadLogosBlockchainNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainNodeState })}
		{@const blockheadLogosBlockchainNodeStateFields = { ...blockheadLogosBlockchainNodeState[EntityMetaKey.Selector], ...blockheadLogosBlockchainNodeState }}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainNodeState}
			entitySelector={blockheadLogosBlockchainNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLogosBlockchainNodeStateFields.peerId) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain node state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLogosBlockchainNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLogosBlockchainNodeStateFields.endpoint) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
