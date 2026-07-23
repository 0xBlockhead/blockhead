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

	const pageSelection = $derived(select(EntityType.SolanaTokenMint, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint' : [String((({ ...data.selector, ...pageSelection.entity }).mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint'))} • solana token mint • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenMintView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
				network: params.network,
				mintAddress: params.mintAddress,
			})
		}
		selection={pageSelection}
	/>
</Page>
