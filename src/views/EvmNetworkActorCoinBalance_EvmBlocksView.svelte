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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetworkActorCoinBalance_EvmBlock>
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
	import EvmNetworkActorCoinBalance_EvmBlockView from '$/views/EvmNetworkActorCoinBalance_EvmBlockView.svelte'
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
					$block: true,
					balance: true,
					usdValue: true,
					$actorCoin: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkActorCoinBalanceEvmBlocks)}
			{@const uniqueEvmNetworkActorCoinBalanceEvmBlocks = [...new Map(evmNetworkActorCoinBalanceEvmBlocks.values.map((evmNetworkActorCoinBalanceEvmBlock) => [evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalanceEvmBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkActorCoinBalanceEvmBlocks.totalCount}
				getKey={(evmNetworkActorCoinBalanceEvmBlock) => evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkActorCoinBalanceEvmBlocks}
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
					{@const selection = select(EntityType.EvmNetworkActorCoinBalance_EvmBlock, evmNetworkActorCoinBalanceEvmBlock[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<EvmNetworkActorCoinBalance_EvmBlockView
						selection={selection}
						prefetched={evmNetworkActorCoinBalanceEvmBlockFields}
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
		entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
