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
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
</script>


<svelte:head>
	<title>Solana validators • Blockhead</title>
</svelte:head>


<Page>
	<SolanaValidatorsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/validators', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana validators'
		selection={
			select(EntityType.SolanaNetwork, {
				caip2: networkBySlug[params.networkSlug].caip2,
			})[EntityProxyField]<EntityType.SolanaValidator>('$$validators')
		}
		id='SolanaValidatorsView-page'
	/>
</Page>
