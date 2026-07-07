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
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<Page>
	<SolanaAccountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
				networkSlug: params.networkSlug,
				pubkey: params.pubkey,
			})
		}
		selection={
			select(EntityType.SolanaAccount, {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				pubkey: decodeURIComponent(params.pubkey),
			}, {
				fields: {
					lamports: true,
					rentEpoch: true,
					executable: true,
					dataEncoding: true,
				},
			})
		}
	/>
</Page>
