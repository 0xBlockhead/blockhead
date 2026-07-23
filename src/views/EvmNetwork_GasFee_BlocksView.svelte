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
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetwork_GasFee_Block>
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
	entityType={EntityType.EvmNetwork_GasFee_Block}
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
				blockNumber: true,
				baseFeePerGas: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkGasFeeBlocks) => [...new Map(evmNetworkGasFeeBlocks.values.map((evmNetworkGasFeeBlock) => [evmNetworkGasFeeBlock[EntityMetaKey.SelectorKey], evmNetworkGasFeeBlock])).values()]}
	getKey={(evmNetworkGasFeeBlock) => evmNetworkGasFeeBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.EvmNetwork_GasFee_Block}
			entitySelector={evmNetworkGasFeeBlock[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkGasFeeBlock[EntityMetaKey.Selector] != null && 'blockNumber' in evmNetworkGasFeeBlock[EntityMetaKey.Selector]
					&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber != null
					&& evmNetworkGasFeeBlock[EntityMetaKey.Selector] != null && '$network' in evmNetworkGasFeeBlock[EntityMetaKey.Selector] ?
						evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network
						&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
						blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
						network: String(caip2StringFromValue(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network
							&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
							network: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((evmNetworkGasFeeBlockFields.blockNumber) ?? '') ? 'Block ' + String((evmNetworkGasFeeBlockFields.blockNumber) ?? '') : ''), (String((evmNetworkGasFeeBlockFields.baseFeePerGas) ?? '') ? String((evmNetworkGasFeeBlockFields.baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block'}
			{/snippet}

			{#snippet Value()}
				{[(String((evmNetworkGasFeeBlockFields.baseFeePerGas) ?? '') ? String((evmNetworkGasFeeBlockFields.baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkGasFeeBlockFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmNetworkGasFeeBlockFields.$network.caip2 == null ? '' : String(`${(evmNetworkGasFeeBlockFields.$network.caip2).namespace}:${(evmNetworkGasFeeBlockFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
