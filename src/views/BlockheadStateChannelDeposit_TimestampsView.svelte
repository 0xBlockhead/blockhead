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
		title = 'Blockhead state channel deposit observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelDeposit_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadStateChannelDeposit_Timestamp>
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
	import BlockheadStateChannelDeposit_TimestampView from '$/views/BlockheadStateChannelDeposit_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
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
				source: true,
				availableBalance: true,
			},
		})
	}
	getResourceItems={(blockheadStateChannelDepositTimestamps) => [...new Map(blockheadStateChannelDepositTimestamps.values.map((blockheadStateChannelDepositTimestamp) => [blockheadStateChannelDepositTimestamp[EntityMetaKey.SelectorKey], blockheadStateChannelDepositTimestamp])).values()]}
	getKey={(blockheadStateChannelDepositTimestamp) => blockheadStateChannelDepositTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel deposit observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelDepositTimestamp })}
		{@const blockheadStateChannelDepositTimestampFields = { ...blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector], ...blockheadStateChannelDepositTimestamp }}
		{@const selection = select(EntityType.BlockheadStateChannelDeposit_Timestamp, blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadStateChannelDeposit_TimestampView
			selection={selection}
			prefetched={blockheadStateChannelDepositTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
