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

	const pageSelection = $derived(select(EntityType.FilecoinMessageReceipt, {
		$message: data.selector,
		tipsetKey: params.tipsetKey,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageReceiptView from '$/views/FilecoinMessageReceiptView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.tipsetKey || 'filecoin message receipt')} • filecoin message receipt • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageReceiptView
		selection={pageSelection}
	/>
</Page>
