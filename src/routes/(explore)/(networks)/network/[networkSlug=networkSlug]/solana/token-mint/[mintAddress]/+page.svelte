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
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<Page>
	<SolanaTokenMintView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]', {
				networkSlug: params.networkSlug,
				mintAddress: params.mintAddress,
			})
		}
		selection={
			select(EntityType.SolanaTokenMint, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				mintAddress: decodeURIComponent(params.mintAddress),
			}, {
				fields: {
					supply: true,
					decimals: true,
				},
			})
		}
	/>
</Page>
