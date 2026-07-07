<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
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
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<Page>
	<SolanaValidatorView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/validator/[votePubkey]', {
				networkSlug: params.networkSlug,
				votePubkey: params.votePubkey,
			})
		}
		selection={
			select(EntityType.SolanaValidator, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				votePubkey: decodeURIComponent(params.votePubkey),
			}, {
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
