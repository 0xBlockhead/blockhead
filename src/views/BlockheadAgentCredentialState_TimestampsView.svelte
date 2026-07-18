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
		title = 'Blockhead agent credential state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentCredentialState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadAgentCredentialState_Timestamp>
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
	import BlockheadAgentCredentialState_TimestampView from '$/views/BlockheadAgentCredentialState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentCredentialState_Timestamp}
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
				source: true,
			},
		})
	}
	getResourceItems={(blockheadAgentCredentialStateTimestamps) => [...new Map(blockheadAgentCredentialStateTimestamps.values.map((blockheadAgentCredentialStateTimestamp) => [blockheadAgentCredentialStateTimestamp[EntityMetaKey.SelectorKey], blockheadAgentCredentialStateTimestamp])).values()]}
	getKey={(blockheadAgentCredentialStateTimestamp) => blockheadAgentCredentialStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent credential state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentCredentialStateTimestamp })}
		{@const blockheadAgentCredentialStateTimestampFields = { ...blockheadAgentCredentialStateTimestamp[EntityMetaKey.Selector], ...blockheadAgentCredentialStateTimestamp }}
		{@const selection = select(EntityType.BlockheadAgentCredentialState_Timestamp, blockheadAgentCredentialStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadAgentCredentialState_TimestampView
			selection={selection}
			prefetched={blockheadAgentCredentialStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
