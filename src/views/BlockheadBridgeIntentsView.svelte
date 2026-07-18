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
		title = 'Blockhead bridge intents',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBridgeIntents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadBridgeIntent>
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
	import BlockheadBridgeIntentView from '$/views/BlockheadBridgeIntentView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBridgeIntent}
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
				$sessionAction: true,
				amount: true,
				$fromNetwork: true,
				$toNetwork: true,
			},
		})
	}
	getResourceItems={(blockheadBridgeIntents) => [...new Map(blockheadBridgeIntents.values.map((blockheadBridgeIntent) => [blockheadBridgeIntent[EntityMetaKey.SelectorKey], blockheadBridgeIntent])).values()]}
	getKey={(blockheadBridgeIntent) => blockheadBridgeIntent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead bridge intents yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadBridgeIntent })}
		{@const blockheadBridgeIntentFields = { ...blockheadBridgeIntent[EntityMetaKey.Selector], ...blockheadBridgeIntent }}
		{@const selection = select(EntityType.BlockheadBridgeIntent, blockheadBridgeIntent[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadBridgeIntentView
			selection={selection}
			prefetched={blockheadBridgeIntentFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
