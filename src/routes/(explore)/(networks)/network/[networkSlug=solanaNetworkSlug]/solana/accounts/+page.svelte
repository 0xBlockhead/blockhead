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
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaAccountsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/accounts', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana accounts'
		selection={
			select(EntityType.SolanaNetwork, {
				caip2: networkBySlug[params.networkSlug].caip2,
			})[EntityProxyField]<EntityType.SolanaAccount>('$$accounts')
		}
		id='SolanaAccountsView-page'
	/>
</Page>
