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
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaAccountsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/accounts', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana accounts'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Solana.$$accounts
		}
		id='accounts'
	/>
</Page>
