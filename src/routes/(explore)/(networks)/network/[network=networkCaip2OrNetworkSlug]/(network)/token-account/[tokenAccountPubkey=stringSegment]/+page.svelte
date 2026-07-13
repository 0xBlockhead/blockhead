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

	const pageSelection = $derived(select(EntityType.SolanaTokenAccount, data.selector, {
		fields: {
			$mint: true,
			$account: true,
			$owner: true,
			$delegate: true,
			$closeAuthority: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account')))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • solana token account • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
				network: params.network,
				tokenAccountPubkey: params.tokenAccountPubkey,
			})
		}
		selection={pageSelection}
	/>
</Page>
