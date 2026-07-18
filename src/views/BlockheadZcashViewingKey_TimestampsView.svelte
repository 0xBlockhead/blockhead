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
		title = 'Blockhead Zcash viewing key observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashViewingKey_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZcashViewingKey_Timestamp>
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
	import BlockheadZcashViewingKey_TimestampView from '$/views/BlockheadZcashViewingKey_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
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
				lastScannedHeight: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadZcashViewingKeyTimestamps) => [...new Map(blockheadZcashViewingKeyTimestamps.values.map((blockheadZcashViewingKeyTimestamp) => [blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey], blockheadZcashViewingKeyTimestamp])).values()]}
	getKey={(blockheadZcashViewingKeyTimestamp) => blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash viewing key observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashViewingKeyTimestamp })}
		{@const blockheadZcashViewingKeyTimestampFields = { ...blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector], ...blockheadZcashViewingKeyTimestamp }}
		{@const selection = select(EntityType.BlockheadZcashViewingKey_Timestamp, blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZcashViewingKey_TimestampView
			selection={selection}
			prefetched={blockheadZcashViewingKeyTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
