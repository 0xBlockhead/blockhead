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
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
				{
					network: String(params.network),
					blockNumber: String(params.blockNumber),
				}
			)
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ? EvmBlockView : data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ? SolanaBlockView : data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ? UtxoBlockView : PolkadotBlockView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: String(params.network),
							blockNumber: String(params.blockNumber),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
