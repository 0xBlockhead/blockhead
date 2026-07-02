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
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<svelte:head>
	<title>solana token account • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-account/[tokenAccountPubkey]', {
				networkSlug: params.networkSlug,
				tokenAccountPubkey: params.tokenAccountPubkey,
			})
		}
		selection={
			select(EntityType.SolanaTokenAccount, data.selector, {
				fields: {
					$mint: true,
					$account: true,
					$owner: true,
					$delegate: true,
					$closeAuthority: true,
				},
			})
		}
	/>
</Page>
