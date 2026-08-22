<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SolanaTokenAccount_Timestamp, {
		$tokenAccount: data.selector,
		slot: BigInt(params.slot),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenAccount_TimestampView from '$/views/SolanaTokenAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana token account timestamp')} • solana token account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
