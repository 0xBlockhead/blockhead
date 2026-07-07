<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { networkBySlug } from '$/constants/Network.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
</script>


<Page>
	<SolanaBlockView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/block/[slot]', {
				networkSlug: params.networkSlug,
				slot: params.slot,
			})
		}
		selection={
			select(EntityType.SolanaBlock, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				slot: BigInt(params.slot),
			}, {
				fields: {
					blockHeight: true,
					blockHash: true,
					previousBlockHash: true,
					parentSlot: true,
					timestampMs: true,
					transactionCount: true,
					$parent: true,
				},
			})
		}
	/>
</Page>
