<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetworkActorCoinBalance>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					symbol: true,
					$actor: true,
					$coinInstance: true,
					$contract: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkActorCoinBalances)}
			{@const uniqueEvmNetworkActorCoinBalances = [...new Map(evmNetworkActorCoinBalances.values.map((evmNetworkActorCoinBalance) => [evmNetworkActorCoinBalance[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalance])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkActorCoinBalances.totalCount}
				getKey={(evmNetworkActorCoinBalance) => evmNetworkActorCoinBalance[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkActorCoinBalances}
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
					{@const selection = select(EntityType.EvmNetworkActorCoinBalance, evmNetworkActorCoinBalance[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmNetworkActorCoinBalanceHrefFields = { ...evmNetworkActorCoinBalance, ...evmNetworkActorCoinBalance[EntityMetaKey.Selector] }}
					<EvmNetworkActorCoinBalanceView
						selection={selection}
						prefetched={evmNetworkActorCoinBalanceFields}
						href={
							(evmNetworkActorCoinBalanceHrefFields.$actor !== undefined && evmNetworkActorCoinBalanceHrefFields.$actor.address !== undefined && evmNetworkActorCoinBalanceHrefFields.$contract !== undefined && evmNetworkActorCoinBalanceHrefFields.$contract.$network !== undefined && evmNetworkActorCoinBalanceHrefFields.$contract.$network.caip2 !== undefined && evmNetworkActorCoinBalanceHrefFields.$contract.$network.caip2.reference !== undefined && evmNetworkActorCoinBalanceHrefFields.$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(evmNetworkActorCoinBalanceHrefFields.$actor.address ?? ''),
								chainId: String(evmNetworkActorCoinBalanceHrefFields.$contract.$network.caip2.reference ?? ''),
								coin: String(evmNetworkActorCoinBalanceHrefFields.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNetworkActorCoinBalance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
