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
	import SolanaNetworkView from '$/views/SolanaNetworkView.svelte'
</script>


<svelte:head>
	<title>Solana network • Blockhead</title>
</svelte:head>


<Page>
	<SolanaNetworkView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana', {
				networkSlug: params.networkSlug,
			})
		}
		selection={
			select(EntityType.SolanaNetwork, data.selector, {
				fields: {
					name: true,
					environment: true,
				},
			})
		}
	/>
</Page>
