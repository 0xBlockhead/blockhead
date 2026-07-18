<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


{#key [params.network, params.minerAddress].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
				network: params.network,
				minerAddress: params.minerAddress,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = FilecoinMinerView}

			<DetailView
				selection={select(EntityType.FilecoinMiner, data.selector, { sources: [
		Source.Lotus_JsonRpc,
	] })}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
						network: params.network,
						minerAddress: params.minerAddress,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
