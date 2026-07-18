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
		title = 'Blockhead Fedimint client state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFedimintClientState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadFedimintClientState_Timestamp>
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
	import BlockheadFedimintClientState_TimestampView from '$/views/BlockheadFedimintClientState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
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
				balanceMsat: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadFedimintClientStateTimestamps) => [...new Map(blockheadFedimintClientStateTimestamps.values.map((blockheadFedimintClientStateTimestamp) => [blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey], blockheadFedimintClientStateTimestamp])).values()]}
	getKey={(blockheadFedimintClientStateTimestamp) => blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Fedimint client state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFedimintClientStateTimestamp })}
		{@const blockheadFedimintClientStateTimestampFields = { ...blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector], ...blockheadFedimintClientStateTimestamp }}
		{@const selection = select(EntityType.BlockheadFedimintClientState_Timestamp, blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadFedimintClientState_TimestampView
			selection={selection}
			prefetched={blockheadFedimintClientStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
