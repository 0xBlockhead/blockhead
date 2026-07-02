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
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<svelte:head>
	<title>solana validator • Blockhead</title>
</svelte:head>


<Page>
	<SolanaValidatorView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/validator/[votePubkey]', {
				networkSlug: params.networkSlug,
				votePubkey: params.votePubkey,
			})
		}
		selection={
			select(EntityType.SolanaValidator, data.selector, {
				fields: {
					delinquent: true,
					nodePubkey: true,
					activatedStakeLamports: true,
					commission: true,
				},
			})
		}
	/>
</Page>
