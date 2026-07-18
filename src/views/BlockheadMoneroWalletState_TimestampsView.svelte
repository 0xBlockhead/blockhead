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
		title = 'Blockhead Monero wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadMoneroWalletState_Timestamp>
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
	import BlockheadMoneroWalletState_TimestampView from '$/views/BlockheadMoneroWalletState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
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
				balanceAtomicUnits: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadMoneroWalletStateTimestamps) => [...new Map(blockheadMoneroWalletStateTimestamps.values.map((blockheadMoneroWalletStateTimestamp) => [blockheadMoneroWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroWalletStateTimestamp])).values()]}
	getKey={(blockheadMoneroWalletStateTimestamp) => blockheadMoneroWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroWalletStateTimestamp })}
		{@const blockheadMoneroWalletStateTimestampFields = { ...blockheadMoneroWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroWalletStateTimestamp }}
		{@const selection = select(EntityType.BlockheadMoneroWalletState_Timestamp, blockheadMoneroWalletStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadMoneroWalletState_TimestampView
			selection={selection}
			prefetched={blockheadMoneroWalletStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
