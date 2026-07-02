<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
</script>


<svelte:head>
	<title>solana block • Blockhead</title>
</svelte:head>


<Page>
	<SolanaBlockView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/block/[slot]', {
				networkSlug: params.networkSlug,
				slot: params.slot,
			})
		}
		selection={
			select(EntityType.SolanaBlock, data.selector, {
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
