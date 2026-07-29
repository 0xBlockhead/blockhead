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
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


{#key [params.network, params.blockNumber, params.hash].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
				{
					network: params.network,
					blockNumber: params.blockNumber,
					hash: params.hash,
				}
			)
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ? PolkadotBlockView : UtxoBlockView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: params.network,
							blockNumber: params.blockNumber,
							hash: params.hash,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
