<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM network gas fee blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_GasFee_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetwork_GasFee_Block>
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

				{#snippet Item({ item: evmNetworkGasFeeBlock })}
					{@const evmNetworkGasFeeBlockFields = { ...evmNetworkGasFeeBlock[EntityMetaKey.Selector], ...evmNetworkGasFeeBlock }}
					{@const selection = select(EntityType.EvmNetwork_GasFee_Block, evmNetworkGasFeeBlock[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmNetworkGasFeeBlockHrefFields = { ...evmNetworkGasFeeBlock, ...evmNetworkGasFeeBlock[EntityMetaKey.Selector] }}
					<EvmNetwork_GasFee_BlockView
						selection={selection}
						prefetched={evmNetworkGasFeeBlockFields}
						href={
							(evmNetworkGasFeeBlockHrefFields.blockNumber !== undefined && evmNetworkGasFeeBlockHrefFields.$network !== undefined && evmNetworkGasFeeBlockHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(evmNetworkGasFeeBlockHrefFields.blockNumber ?? ''),
								network: String(caip2StringFromValue(evmNetworkGasFeeBlockHrefFields.$network.caip2) ?? ''),
							}) : evmNetworkGasFeeBlockHrefFields.blockNumber !== undefined && evmNetworkGasFeeBlockHrefFields.$network !== undefined && evmNetworkGasFeeBlockHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(evmNetworkGasFeeBlockHrefFields.blockNumber ?? ''),
								network: String(evmNetworkGasFeeBlockHrefFields.$network.slug ?? ''),
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
