<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkActorCoinBalance_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
			entitySelector={evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmNetworkActorCoinBalanceTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'EVM network actor coin balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((evmNetworkActorCoinBalanceTimestampFields.balance) ?? '') ? String((evmNetworkActorCoinBalanceTimestampFields.balance) ?? '') + evmNetworkActorCoinBalanceTimestampFields.$actorCoin.symbol : ''), String((evmNetworkActorCoinBalanceTimestampFields.usdValue) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmNetworkActorCoinBalanceTimestampFields.blockNumber) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
