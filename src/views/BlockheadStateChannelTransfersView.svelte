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
		title = 'State channel transfers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadStateChannelTransfer>
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
	import BlockheadStateChannelTransferView from '$/views/BlockheadStateChannelTransferView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelTransfer}
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
				amount: true,
				status: true,
				timestamp: true,
			},
		})
	}
	getResourceItems={(blockheadStateChannelTransfers) => [...new Map(blockheadStateChannelTransfers.values.map((blockheadStateChannelTransfer) => [blockheadStateChannelTransfer[EntityMetaKey.SelectorKey], blockheadStateChannelTransfer])).values()]}
	getKey={(blockheadStateChannelTransfer) => blockheadStateChannelTransfer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel transfers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelTransfer })}
		{@const blockheadStateChannelTransferFields = { ...blockheadStateChannelTransfer[EntityMetaKey.Selector], ...blockheadStateChannelTransfer }}
		{@const selection = select(EntityType.BlockheadStateChannelTransfer, blockheadStateChannelTransfer[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadStateChannelTransferView
			selection={selection}
			prefetched={blockheadStateChannelTransferFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
