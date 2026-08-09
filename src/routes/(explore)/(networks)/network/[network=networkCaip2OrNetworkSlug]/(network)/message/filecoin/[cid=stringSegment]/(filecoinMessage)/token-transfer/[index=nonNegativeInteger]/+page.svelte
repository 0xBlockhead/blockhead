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

	const pageSelection = $derived(select(EntityType.FilecoinMessageTokenTransfer, {
		$message: data.selector,
		index: Number(params.index),
	}, {
		sources: [
			Source.Filfox_Rest,
		],
		fields: {
			tokenSymbol: true,
			token: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageTokenTransferView from '$/views/FilecoinMessageTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'filecoin message token transfer' : [(pageSelection.entity.tokenSymbol ?? ''), (pageSelection.entity.token ?? '')].filter(Boolean).join(' ') || 'filecoin message token transfer')} • filecoin message token transfer • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageTokenTransferView
		selection={pageSelection}
	/>
</Page>
