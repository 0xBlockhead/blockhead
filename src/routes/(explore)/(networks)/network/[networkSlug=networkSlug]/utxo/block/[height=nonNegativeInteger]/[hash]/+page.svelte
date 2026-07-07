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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<Page>
	<UtxoBlockView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
				networkSlug: params.networkSlug,
				height: params.height,
				hash: params.hash,
			})
		}
		selection={
			select(EntityType.UtxoBlock, {
				$network: {
					slug: params.networkSlug,
				},
				height: BigInt(params.height),
				hash: decodeURIComponent(params.hash),
			}, {
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
