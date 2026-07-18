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
		title = 'Blockhead Litecoin MWEB wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLitecoinMwebWalletState_Timestamp>
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
	import BlockheadLitecoinMwebWalletState_TimestampView from '$/views/BlockheadLitecoinMwebWalletState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
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
				balanceLitoshis: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadLitecoinMwebWalletStateTimestamps) => [...new Map(blockheadLitecoinMwebWalletStateTimestamps.values.map((blockheadLitecoinMwebWalletStateTimestamp) => [blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadLitecoinMwebWalletStateTimestamp])).values()]}
	getKey={(blockheadLitecoinMwebWalletStateTimestamp) => blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead litecoin mweb wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLitecoinMwebWalletStateTimestamp })}
		{@const blockheadLitecoinMwebWalletStateTimestampFields = { ...blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadLitecoinMwebWalletStateTimestamp }}
		{@const selection = select(EntityType.BlockheadLitecoinMwebWalletState_Timestamp, blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLitecoinMwebWalletState_TimestampView
			selection={selection}
			prefetched={blockheadLitecoinMwebWalletStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
