<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadTransferRequest, {
		id: params.id,
		$network: data.selector,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadTransferRequestView from '$/views/BlockheadTransferRequestView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.id || 'blockhead transfer request')} • blockhead transfer request • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadTransferRequestView
		selection={pageSelection}
	/>
</Page>
