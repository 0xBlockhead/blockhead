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
		title = 'Bittensor metagraph observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorMetagraph_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BittensorMetagraph_Timestamp>
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
	import BittensorMetagraph_TimestampView from '$/views/BittensorMetagraph_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorMetagraph_Timestamp}
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
				metagraphByteLength: true,
			},
		})
	}
	getResourceItems={(bittensorMetagraphTimestamps) => [...new Map(bittensorMetagraphTimestamps.values.map((bittensorMetagraphTimestamp) => [bittensorMetagraphTimestamp[EntityMetaKey.SelectorKey], bittensorMetagraphTimestamp])).values()]}
	getKey={(bittensorMetagraphTimestamp) => bittensorMetagraphTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bittensor metagraph observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bittensorMetagraphTimestamp })}
		{@const bittensorMetagraphTimestampFields = { ...bittensorMetagraphTimestamp[EntityMetaKey.Selector], ...bittensorMetagraphTimestamp }}
		{@const selection = select(EntityType.BittensorMetagraph_Timestamp, bittensorMetagraphTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BittensorMetagraph_TimestampView
			selection={selection}
			prefetched={bittensorMetagraphTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
