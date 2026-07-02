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
	import SolanaNetwork_TimestampsView from '$/views/SolanaNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Solana observations • Blockhead</title>
</svelte:head>


<Page>
	<SolanaNetwork_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana observations'
		selection={
			select(EntityType.SolanaNetwork, {
				caip2: networkBySlug[params.networkSlug].caip2,
			})[EntityProxyField]<EntityType.SolanaNetwork_Timestamp>('$$timestamps')
		}
		id='SolanaNetwork_TimestampsView-page'
	/>
</Page>
