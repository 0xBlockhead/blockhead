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
		title = 'Blockhead Cashu wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadCashuWalletState_Timestamp>
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
	import BlockheadCashuWalletState_TimestampView from '$/views/BlockheadCashuWalletState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
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
				balance: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadCashuWalletStateTimestamps) => [...new Map(blockheadCashuWalletStateTimestamps.values.map((blockheadCashuWalletStateTimestamp) => [blockheadCashuWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadCashuWalletStateTimestamp])).values()]}
	getKey={(blockheadCashuWalletStateTimestamp) => blockheadCashuWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuWalletStateTimestamp })}
		{@const blockheadCashuWalletStateTimestampFields = { ...blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadCashuWalletStateTimestamp }}
		{@const selection = select(EntityType.BlockheadCashuWalletState_Timestamp, blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadCashuWalletState_TimestampView
			selection={selection}
			prefetched={blockheadCashuWalletStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
