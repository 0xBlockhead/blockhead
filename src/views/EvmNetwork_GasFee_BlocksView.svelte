<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'EVM network gas fee blocks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_GasFee_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetwork_GasFee_Block>
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
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
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
					blockNumber: true,
					baseFeePerGas: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_GasFee_Block}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkGasFeeBlocks)}
			{@const uniqueEvmNetworkGasFeeBlocks = [...new Map(evmNetworkGasFeeBlocks.values.map((evmNetworkGasFeeBlock) => [evmNetworkGasFeeBlock[EntityMetaKey.SelectorKey], evmNetworkGasFeeBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_GasFee_Block}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkGasFeeBlocks.totalCount}
				getKey={(evmNetworkGasFeeBlock) => evmNetworkGasFeeBlock[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkGasFeeBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network gas fee blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkGasFeeBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetwork_GasFee_Block> })}
					{@const evmNetworkGasFeeBlockFields = { ...evmNetworkGasFeeBlock[EntityMetaKey.Selector], ...evmNetworkGasFeeBlock }}
					{@const evmNetworkGasFeeBlockHrefFields = { ...evmNetworkGasFeeBlock, ...evmNetworkGasFeeBlock[EntityMetaKey.Selector] }}
					<EvmNetwork_GasFee_BlockView
						selection={select(EntityType.EvmNetwork_GasFee_Block, evmNetworkGasFeeBlock[EntityMetaKey.Selector])}
						prefetched={evmNetworkGasFeeBlockFields}
						href={
							(evmNetworkGasFeeBlockHrefFields.$network !== undefined && evmNetworkGasFeeBlockHrefFields.$network.caip2 !== undefined && evmNetworkGasFeeBlockHrefFields.$network.caip2.namespace !== undefined && evmNetworkGasFeeBlockHrefFields.$network !== undefined && evmNetworkGasFeeBlockHrefFields.$network.caip2 !== undefined && evmNetworkGasFeeBlockHrefFields.$network.caip2.reference !== undefined && evmNetworkGasFeeBlockHrefFields.blockNumber !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market/block/[blockNumber=evmBlockNumber]', {
								caip2: `${String(evmNetworkGasFeeBlockHrefFields.$network.caip2.namespace ?? '')}:${String(evmNetworkGasFeeBlockHrefFields.$network.caip2.reference ?? '')}`,
								blockNumber: String(evmNetworkGasFeeBlockHrefFields.blockNumber ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNetwork_GasFee_Block}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
