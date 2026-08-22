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

	const pageSelection = $derived(select(EntityType.AptosBlock, {
		$network: data.selector,
		version: BigInt(params.version),
	}, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosBlockView from '$/views/AptosBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'aptos block' : String(pageSelection.entity.height) || 'aptos block')} • aptos block • Blockhead</title>
</svelte:head>


<Page>
	<AptosBlockView
		selection={pageSelection}
	/>
</Page>
