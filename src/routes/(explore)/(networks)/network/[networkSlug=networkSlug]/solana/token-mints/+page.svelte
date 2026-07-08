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
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
</script>


<svelte:head>
	<title>Solana token mints • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenMintsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mints', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana token mints'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Solana.$$tokenMints
		}
		id='token-mints'
	/>
</Page>
