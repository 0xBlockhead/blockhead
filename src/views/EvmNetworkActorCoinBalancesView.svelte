<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Balances',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkActorCoinBalances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkActorCoinBalance>
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
	entityType={EntityType.EvmNetworkActorCoinBalance}
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
				symbol: true,
				$actor: true,
				$coinInstance: true,
				$contract: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkActorCoinBalances) => [...new Map(evmNetworkActorCoinBalances.values.map((evmNetworkActorCoinBalance) => [evmNetworkActorCoinBalance[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalance])).values()]}
	getKey={(evmNetworkActorCoinBalance) => evmNetworkActorCoinBalance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Balances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkActorCoinBalance })}
		{@const evmNetworkActorCoinBalanceFields = { ...evmNetworkActorCoinBalance[EntityMetaKey.Selector], ...evmNetworkActorCoinBalance }}
		<EntityView
			entityType={EntityType.EvmNetworkActorCoinBalance}
			entitySelector={evmNetworkActorCoinBalance[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkActorCoinBalance[EntityMetaKey.Selector] != null && '$actor' in evmNetworkActorCoinBalance[EntityMetaKey.Selector]
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address != null
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector] != null && '$contract' in evmNetworkActorCoinBalance[EntityMetaKey.Selector]
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract != null && '$network' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network != null && 'caip2' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2 != null && 'reference' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference != null
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract != null && 'address' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract
					&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address != null ?
						resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
					owner: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address ?? ''),
					chainId: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
					coin: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmNetworkActorCoinBalanceFields.symbol) ?? '')].filter(Boolean).join(' ') || ['EVM coin instance'].filter(Boolean).join(' ') || 'balance'}
			{/snippet}

			{#snippet Value()}
				{[[String((evmNetworkActorCoinBalanceFields.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkActorCoinBalanceFields.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
