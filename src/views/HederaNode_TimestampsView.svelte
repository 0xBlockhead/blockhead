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
		title = 'Hedera node observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNode_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.HederaNode_Timestamp>
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
	import HederaNode_TimestampView from '$/views/HederaNode_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNode_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(hederaNodeTimestamps) => [...new Map(hederaNodeTimestamps.values.map((hederaNodeTimestamp) => [hederaNodeTimestamp[EntityMetaKey.SelectorKey], hederaNodeTimestamp])).values()]}
	getKey={(hederaNodeTimestamp) => hederaNodeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera node observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaNodeTimestamp })}
		{@const hederaNodeTimestampFields = { ...hederaNodeTimestamp[EntityMetaKey.Selector], ...hederaNodeTimestamp }}
		{@const selection = select(EntityType.HederaNode_Timestamp, hederaNodeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<HederaNode_TimestampView
			selection={selection}
			prefetched={hederaNodeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
