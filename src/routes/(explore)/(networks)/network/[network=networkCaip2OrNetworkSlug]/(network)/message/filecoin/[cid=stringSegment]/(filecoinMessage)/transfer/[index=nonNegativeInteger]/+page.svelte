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

	const pageSelection = $derived(select(EntityType.FilecoinMessageTransfer, {
		$message: data.selector,
		index: Number(params.index),
	}, {
		sources: [
			Source.Filfox_Rest,
		],
		fields: {
			transferType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageTransferView from '$/views/FilecoinMessageTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'filecoin message transfer' : pageSelection.entity.transferType || 'filecoin message transfer')} • filecoin message transfer • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageTransferView
		selection={pageSelection}
	/>
</Page>
