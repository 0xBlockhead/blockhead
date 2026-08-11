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

	const pageSelection = $derived(select(EntityType.HederaAllowance, {
		$owner: data.selector,
		$spender: {
			$network: data.selector.$network,
			accountId: params.spenderAccountId,
		},
		allowanceKind: params.allowanceKind,
		tokenId: params.tokenId,
		serialNumber: BigInt(params.serialNumber),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaAllowanceView from '$/views/HederaAllowanceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.allowanceKind || 'hedera allowance')} • hedera allowance • Blockhead</title>
</svelte:head>


<Page>
	<HederaAllowanceView
		selection={pageSelection}
	/>
</Page>
