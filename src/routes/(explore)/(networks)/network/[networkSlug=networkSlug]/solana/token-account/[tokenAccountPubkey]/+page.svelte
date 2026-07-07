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
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<Page>
	<SolanaTokenAccountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-account/[tokenAccountPubkey]', {
				networkSlug: params.networkSlug,
				tokenAccountPubkey: params.tokenAccountPubkey,
			})
		}
		selection={
			select(EntityType.SolanaTokenAccount, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				tokenAccountPubkey: decodeURIComponent(params.tokenAccountPubkey),
			}, {
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
