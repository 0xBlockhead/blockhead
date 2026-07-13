<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


{#key [params.network, params.blockNumber].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
				network: params.network,
				blockNumber: params.blockNumber,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.selectorMapping.entityType === EntityType.EvmBlock ? EvmBlockView : data.selectorMapping.entityType === EntityType.SolanaBlock ? SolanaBlockView : data.selectorMapping.entityType === EntityType.UtxoBlock ? UtxoBlockView : PolkadotBlockView}

			<DetailView
				selection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
						network: params.network,
						blockNumber: params.blockNumber,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
