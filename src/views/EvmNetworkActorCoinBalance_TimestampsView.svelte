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
		title = 'Balance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkActorCoinBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetworkActorCoinBalance_Timestamp>
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
	import EvmNetworkActorCoinBalance_TimestampView from '$/views/EvmNetworkActorCoinBalance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
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
				source: true,
				balance: true,
				usdValue: true,
				blockNumber: true,
			},
		})
	}
	getResourceItems={(evmNetworkActorCoinBalanceTimestamps) => [...new Map(evmNetworkActorCoinBalanceTimestamps.values.map((evmNetworkActorCoinBalanceTimestamp) => [evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalanceTimestamp])).values()]}
	getKey={(evmNetworkActorCoinBalanceTimestamp) => evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network actor coin balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkActorCoinBalanceTimestamp })}
		{@const evmNetworkActorCoinBalanceTimestampFields = { ...evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector], ...evmNetworkActorCoinBalanceTimestamp }}
		{@const selection = select(EntityType.EvmNetworkActorCoinBalance_Timestamp, evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EvmNetworkActorCoinBalance_TimestampView
			selection={selection}
			prefetched={evmNetworkActorCoinBalanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
