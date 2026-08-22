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
	import TonNftTransferView from '$/views/TonNftTransferView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON NFT transfer'} • TON NFT transfer • Blockhead</title>
</svelte:head>


<Page>
	<TonNftTransferView
		selection={
			select(EntityType.TonNftTransfer, {
				$network: data.selector,
				transferId: params.transferId,
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
