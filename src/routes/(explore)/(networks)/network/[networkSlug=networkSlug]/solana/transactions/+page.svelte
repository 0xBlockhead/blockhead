<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
</script>


<svelte:head>
	<title>Solana transactions • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTransactionsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/transactions', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana transactions'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Solana.$$transactions({
				sources: [
					Source.Blockscout_Rest,
				],
			})
		}
		id='transactions'
	/>
</Page>
