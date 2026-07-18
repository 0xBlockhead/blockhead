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
		title = 'Storage reads',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmStorageRead_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmStorageRead_Timestamp>
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
	import EvmStorageRead_TimestampView from '$/views/EvmStorageRead_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmStorageRead_Timestamp}
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
				slot: true,
				value: true,
				source: true,
			},
		})
	}
	getResourceItems={(evmStorageReadTimestamps) => [...new Map(evmStorageReadTimestamps.values.map((evmStorageReadTimestamp) => [evmStorageReadTimestamp[EntityMetaKey.SelectorKey], evmStorageReadTimestamp])).values()]}
	getKey={(evmStorageReadTimestamp) => evmStorageReadTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM storage read observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmStorageReadTimestamp })}
		{@const evmStorageReadTimestampFields = { ...evmStorageReadTimestamp[EntityMetaKey.Selector], ...evmStorageReadTimestamp }}
		{@const selection = select(EntityType.EvmStorageRead_Timestamp, evmStorageReadTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EvmStorageRead_TimestampView
			selection={selection}
			prefetched={evmStorageReadTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
