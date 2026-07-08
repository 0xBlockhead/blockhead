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
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana token accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-accounts', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana token accounts'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Solana.$$tokenAccounts
		}
		id='token-accounts'
	/>
</Page>
