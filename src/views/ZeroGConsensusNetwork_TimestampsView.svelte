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
		title = 'Zero g consensus network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGConsensusNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ZeroGConsensusNetwork_Timestamp>
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
	import ZeroGConsensusNetwork_TimestampView from '$/views/ZeroGConsensusNetwork_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
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
				$consensusNetwork: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(zeroGConsensusNetworkTimestamps) => [...new Map(zeroGConsensusNetworkTimestamps.values.map((zeroGConsensusNetworkTimestamp) => [zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey], zeroGConsensusNetworkTimestamp])).values()]}
	getKey={(zeroGConsensusNetworkTimestamp) => zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g consensus network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGConsensusNetworkTimestamp })}
		{@const zeroGConsensusNetworkTimestampFields = { ...zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector], ...zeroGConsensusNetworkTimestamp }}
		{@const selection = select(EntityType.ZeroGConsensusNetwork_Timestamp, zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<ZeroGConsensusNetwork_TimestampView
			selection={selection}
			prefetched={zeroGConsensusNetworkTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
