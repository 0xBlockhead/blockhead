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
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<svelte:head>
	<title>solana transaction • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTransactionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
				networkSlug: params.networkSlug,
				signature: params.signature,
			})
		}
		selection={
			select(EntityType.SolanaTransaction, data.selector, {
				fields: {
					status: true,
					slot: true,
					feeLamports: true,
					computeUnitsConsumed: true,
					$block: true,
					$feePayer: true,
				},
			})
		}
	/>
</Page>
