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
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<Page>
	<SolanaTransactionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/tx/[signature]', {
				networkSlug: params.networkSlug,
				signature: params.signature,
			})
		}
		selection={
			select(EntityType.SolanaTransaction, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				signature: decodeURIComponent(params.signature),
			}, {
				fields: {
					status: true,
					slot: true,
					feeLamports: true,
					computeUnitsConsumed: true,
					$block: true,
					$feePayer: true,
				},
			})
		}
	/>
</Page>
