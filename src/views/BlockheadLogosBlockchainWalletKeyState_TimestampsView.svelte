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
		title = 'Blockhead Logos blockchain wallet key state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp>
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
	import BlockheadLogosBlockchainWalletKeyState_TimestampView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
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
	getResourceItems={(blockheadLogosBlockchainWalletKeyStateTimestamps) => [...new Map(blockheadLogosBlockchainWalletKeyStateTimestamps.values.map((blockheadLogosBlockchainWalletKeyStateTimestamp) => [blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyStateTimestamp])).values()]}
	getKey={(blockheadLogosBlockchainWalletKeyStateTimestamp) => blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain wallet key state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyStateTimestamp })}
		{@const blockheadLogosBlockchainWalletKeyStateTimestampFields = { ...blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyStateTimestamp }}
		{@const selection = select(EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp, blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLogosBlockchainWalletKeyState_TimestampView
			selection={selection}
			prefetched={blockheadLogosBlockchainWalletKeyStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
