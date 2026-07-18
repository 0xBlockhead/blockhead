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
		title = 'Bridge transfer observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeTransfer_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BridgeTransfer_Timestamp>
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
	import BridgeTransfer_TimestampView from '$/views/BridgeTransfer_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeTransfer_Timestamp}
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
				timestampMs: true,
				status: true,
				substatus: true,
				source: true,
			},
		})
	}
	getResourceItems={(bridgeTransferTimestamps) => [...new Map(bridgeTransferTimestamps.values.map((bridgeTransferTimestamp) => [bridgeTransferTimestamp[EntityMetaKey.SelectorKey], bridgeTransferTimestamp])).values()]}
	getKey={(bridgeTransferTimestamp) => bridgeTransferTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge transfer observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bridgeTransferTimestamp })}
		{@const bridgeTransferTimestampFields = { ...bridgeTransferTimestamp[EntityMetaKey.Selector], ...bridgeTransferTimestamp }}
		{@const selection = select(EntityType.BridgeTransfer_Timestamp, bridgeTransferTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BridgeTransfer_TimestampView
			selection={selection}
			prefetched={bridgeTransferTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
