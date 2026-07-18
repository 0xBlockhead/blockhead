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
		title = 'Blockhead Zcash wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZcashWalletState_Timestamp>
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
	import BlockheadZcashWalletState_TimestampView from '$/views/BlockheadZcashWalletState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashWalletState_Timestamp}
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
				balanceZatoshis: true,
				recoveryState: true,
			},
		})
	}
	getResourceItems={(blockheadZcashWalletStateTimestamps) => [...new Map(blockheadZcashWalletStateTimestamps.values.map((blockheadZcashWalletStateTimestamp) => [blockheadZcashWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadZcashWalletStateTimestamp])).values()]}
	getKey={(blockheadZcashWalletStateTimestamp) => blockheadZcashWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashWalletStateTimestamp })}
		{@const blockheadZcashWalletStateTimestampFields = { ...blockheadZcashWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadZcashWalletStateTimestamp }}
		{@const selection = select(EntityType.BlockheadZcashWalletState_Timestamp, blockheadZcashWalletStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZcashWalletState_TimestampView
			selection={selection}
			prefetched={blockheadZcashWalletStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
