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
		title = 'Balance blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkActorCoinBalance_EvmBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkActorCoinBalance_EvmBlock>
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
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
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
				$block: true,
				balance: true,
				usdValue: true,
				$actorCoin: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkActorCoinBalanceEvmBlocks) => [...new Map(evmNetworkActorCoinBalanceEvmBlocks.values.map((evmNetworkActorCoinBalanceEvmBlock) => [evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalanceEvmBlock])).values()]}
	getKey={(evmNetworkActorCoinBalanceEvmBlock) => evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network actor coin balance EVM blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkActorCoinBalanceEvmBlock })}
		{@const evmNetworkActorCoinBalanceEvmBlockFields = { ...evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.Selector], ...evmNetworkActorCoinBalanceEvmBlock }}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
			entitySelector={evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((evmNetworkActorCoinBalanceEvmBlockFields.$block.blockNumber) ?? '') ? 'Block #' + String((evmNetworkActorCoinBalanceEvmBlockFields.$block.blockNumber) ?? '') : '') || [String((evmNetworkActorCoinBalanceEvmBlockFields.$block.hash) ?? '')].filter(Boolean).join(' ') || 'EVM block'].filter(Boolean).join(' ') || 'EVM network actor coin balance EVM block'}
			{/snippet}

			{#snippet Value()}
				{[(String((evmNetworkActorCoinBalanceEvmBlockFields.balance) ?? '') ? String((evmNetworkActorCoinBalanceEvmBlockFields.balance) ?? '') + evmNetworkActorCoinBalanceEvmBlockFields.$actorCoin.symbol : ''), String((evmNetworkActorCoinBalanceEvmBlockFields.usdValue) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkActorCoinBalanceEvmBlockFields.$actorCoin.symbol) ?? '')].filter(Boolean).join(' ') || ['EVM coin instance'].filter(Boolean).join(' ') || 'balance'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
