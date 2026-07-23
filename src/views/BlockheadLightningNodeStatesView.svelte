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
		title = 'Blockhead Lightning node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningNodeState>
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
	entityType={EntityType.BlockheadLightningNodeState}
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
				alias: true,
				$network: true,
				connectionId: true,
				$node: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningNodeStates) => [...new Map(blockheadLightningNodeStates.values.map((blockheadLightningNodeState) => [blockheadLightningNodeState[EntityMetaKey.SelectorKey], blockheadLightningNodeState])).values()]}
	getKey={(blockheadLightningNodeState) => blockheadLightningNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningNodeState })}
		{@const blockheadLightningNodeStateFields = { ...blockheadLightningNodeState[EntityMetaKey.Selector], ...blockheadLightningNodeState }}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState}
			entitySelector={blockheadLightningNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLightningNodeStateFields.alias) ?? '')].filter(Boolean).join(' ') || [String((blockheadLightningNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadLightningNodeStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || [[String((blockheadLightningNodeStateFields.$network.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadLightningNodeStateFields.$network.$network.caip2 == null ? '' : String(`${(blockheadLightningNodeStateFields.$network.$network.caip2).namespace}:${(blockheadLightningNodeStateFields.$network.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'Lightning network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadLightningNodeStateFields.$node.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
