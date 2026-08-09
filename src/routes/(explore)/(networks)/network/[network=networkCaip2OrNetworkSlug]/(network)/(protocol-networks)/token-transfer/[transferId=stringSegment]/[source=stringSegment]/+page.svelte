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


	// Components
	import Page from '$/components/Page.svelte'
	import TezosTokenTransferView from '$/views/TezosTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos token transfer'} • tezos token transfer • Blockhead</title>
</svelte:head>


<Page>
	<TezosTokenTransferView
		selection={
			select(EntityType.TezosTokenTransfer, {
				$network: data.selector,
				transferId: params.transferId,
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
