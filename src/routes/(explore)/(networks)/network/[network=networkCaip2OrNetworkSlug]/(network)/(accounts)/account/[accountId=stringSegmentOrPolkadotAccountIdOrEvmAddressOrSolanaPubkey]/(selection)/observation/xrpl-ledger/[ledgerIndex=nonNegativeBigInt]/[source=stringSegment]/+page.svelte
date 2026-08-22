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

	const pageSelection = $derived(select(EntityType.XrplAccount_Timestamp, {
		$account: data.selector,
		ledgerIndex: BigInt(params.ledgerIndex),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			balanceDrops: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAccount_TimestampView from '$/views/XrplAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'XRPL account timestamp' : String(pageSelection.entity.balanceDrops ?? '') || 'XRPL account timestamp')} • XRPL account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<XrplAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
