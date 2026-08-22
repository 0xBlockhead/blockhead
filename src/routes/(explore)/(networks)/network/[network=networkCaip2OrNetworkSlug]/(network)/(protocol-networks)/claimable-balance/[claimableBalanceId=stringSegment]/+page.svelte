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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarClaimableBalanceView from '$/views/StellarClaimableBalanceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar claimable balance'} • stellar claimable balance • Blockhead</title>
</svelte:head>


<Page>
	<StellarClaimableBalanceView
		selection={select(EntityType.StellarClaimableBalance, data.selector)}
	/>
</Page>
