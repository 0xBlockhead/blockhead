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
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
</script>


<svelte:head>
	<title>Solana validators • Blockhead</title>
</svelte:head>


<Page>
	<SolanaValidatorsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/validators', {
				networkSlug: params.networkSlug,
			})
		}
		title='Solana validators'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Solana.$$validators
		}
		id='validators'
	/>
</Page>
