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
		title = 'Blockhead Cashu proof observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuProof_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadCashuProof_Timestamp>
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
	import BlockheadCashuProof_TimestampView from '$/views/BlockheadCashuProof_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuProof_Timestamp}
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
				state: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadCashuProofTimestamps) => [...new Map(blockheadCashuProofTimestamps.values.map((blockheadCashuProofTimestamp) => [blockheadCashuProofTimestamp[EntityMetaKey.SelectorKey], blockheadCashuProofTimestamp])).values()]}
	getKey={(blockheadCashuProofTimestamp) => blockheadCashuProofTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu proof observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuProofTimestamp })}
		{@const blockheadCashuProofTimestampFields = { ...blockheadCashuProofTimestamp[EntityMetaKey.Selector], ...blockheadCashuProofTimestamp }}
		{@const selection = select(EntityType.BlockheadCashuProof_Timestamp, blockheadCashuProofTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadCashuProof_TimestampView
			selection={selection}
			prefetched={blockheadCashuProofTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
