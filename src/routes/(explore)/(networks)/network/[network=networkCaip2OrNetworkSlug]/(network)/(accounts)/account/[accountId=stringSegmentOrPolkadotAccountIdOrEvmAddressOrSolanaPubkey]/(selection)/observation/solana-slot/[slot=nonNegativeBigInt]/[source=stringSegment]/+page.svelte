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

	const pageSelection = $derived(select(EntityType.SolanaAccount_Timestamp, {
		$account: data.selector,
		slot: BigInt(params.slot),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaAccount_TimestampView from '$/views/SolanaAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.slot) || 'solana account timestamp')} • solana account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SolanaAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
