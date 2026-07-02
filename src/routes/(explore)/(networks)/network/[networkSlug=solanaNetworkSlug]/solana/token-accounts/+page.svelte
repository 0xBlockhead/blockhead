<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana token accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-accounts', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana token accounts'
		selection={
			select(EntityType.SolanaNetwork, {
				caip2: networkBySlug[params.networkSlug].caip2,
			})[EntityProxyField]<EntityType.SolanaTokenAccount>('$$tokenAccounts')
		}
		id='SolanaTokenAccountsView-page'
	/>
</Page>
