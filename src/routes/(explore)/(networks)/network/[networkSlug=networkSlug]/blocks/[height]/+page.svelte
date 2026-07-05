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
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<svelte:head>
	<title>UTXO block • Blockhead</title>
</svelte:head>


<Page>
	<UtxoBlockView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks/[height]', {
				networkSlug: params.networkSlug,
				height: params.height,
			})
		}
		selection={
			select(EntityType.UtxoBlock, data.selector, {
				fields: {
					transactionCount: true,
					timestampMs: true,
					merkleRoot: true,
					nonce: true,
					difficulty: true,
					sizeBytes: true,
					weightUnits: true,
					$parent: true,
				},
			})
		}
	/>
</Page>
