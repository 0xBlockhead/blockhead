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

	const pageSelection = $derived(select(EntityType.AptosEvent, {
		$network: data.selector,
		transactionVersion: BigInt(params.transactionVersion),
		eventIndex: Number(params.eventIndex),
	}, {
		fields: {
			eventType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosEventView from '$/views/AptosEventView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'aptos event' : pageSelection.entity.eventType || 'aptos event')} • aptos event • Blockhead</title>
</svelte:head>


<Page>
	<AptosEventView
		selection={pageSelection}
	/>
</Page>
