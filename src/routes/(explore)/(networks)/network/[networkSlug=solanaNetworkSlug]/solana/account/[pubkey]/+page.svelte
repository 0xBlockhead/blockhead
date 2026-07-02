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
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<svelte:head>
	<title>solana account • Blockhead</title>
</svelte:head>


<Page>
	<SolanaAccountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
				networkSlug: params.networkSlug,
				pubkey: params.pubkey,
			})
		}
		selection={
			select(EntityType.SolanaAccount, data.selector, {
				fields: {
					lamports: true,
					rentEpoch: true,
					executable: true,
					dataEncoding: true,
				},
			})
		}
	/>
</Page>
