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
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<svelte:head>
	<title>solana token mint • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenMintView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
				networkSlug: params.networkSlug,
				mintAddress: params.mintAddress,
			})
		}
		selection={
			select(EntityType.SolanaTokenMint, data.selector, {
				fields: {
					supply: true,
					decimals: true,
				},
			})
		}
	/>
</Page>
