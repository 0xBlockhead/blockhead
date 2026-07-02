<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Balances',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Balances...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkActorCoinBalances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
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
			selection.sources == null ? selection({
				fields: {
					symbol: true,
					$actor: true,
					$coinInstance: true,
				},
			}) : selection
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
				totalCount={evmNetworkActorCoinBalances.values.length === uniqueEvmNetworkActorCoinBalances.length && evmNetworkActorCoinBalances.totalCount != null && evmNetworkActorCoinBalances.totalCount >= uniqueEvmNetworkActorCoinBalances.length ? evmNetworkActorCoinBalances.totalCount : uniqueEvmNetworkActorCoinBalances.length}
				getKey={(evmNetworkActorCoinBalance) => evmNetworkActorCoinBalance[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkActorCoinBalances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No balances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkActorCoinBalance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetworkActorCoinBalance> })}
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, evmNetworkActorCoinBalance.entitySelector)}
						prefetched={evmNetworkActorCoinBalance}
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
