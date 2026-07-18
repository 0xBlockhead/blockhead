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
		title = 'Blockhead Fedimint client states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFedimintClientStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadFedimintClientState>
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
	import BlockheadFedimintClientStateView from '$/views/BlockheadFedimintClientStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFedimintClientState}
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
				clientName: true,
				federationId: true,
				clientId: true,
			},
		})
	}
	getResourceItems={(blockheadFedimintClientStates) => [...new Map(blockheadFedimintClientStates.values.map((blockheadFedimintClientState) => [blockheadFedimintClientState[EntityMetaKey.SelectorKey], blockheadFedimintClientState])).values()]}
	getKey={(blockheadFedimintClientState) => blockheadFedimintClientState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Fedimint client states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFedimintClientState })}
		{@const blockheadFedimintClientStateFields = { ...blockheadFedimintClientState[EntityMetaKey.Selector], ...blockheadFedimintClientState }}
		{@const selection = select(EntityType.BlockheadFedimintClientState, blockheadFedimintClientState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadFedimintClientStateView
			selection={selection}
			prefetched={blockheadFedimintClientStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
