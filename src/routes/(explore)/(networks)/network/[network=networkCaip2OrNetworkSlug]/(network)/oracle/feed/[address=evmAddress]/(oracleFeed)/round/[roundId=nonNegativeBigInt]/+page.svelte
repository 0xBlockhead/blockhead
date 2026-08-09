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

	const pageSelection = $derived(select(EntityType.OracleFeed_Round, {
		$oracleFeed: data.selector,
		roundId: BigInt(params.roundId),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.roundId) || 'oracle feed round')} • oracle feed round • Blockhead</title>
</svelte:head>


<Page>
	<OracleFeed_RoundView
		selection={pageSelection}
	/>
</Page>
