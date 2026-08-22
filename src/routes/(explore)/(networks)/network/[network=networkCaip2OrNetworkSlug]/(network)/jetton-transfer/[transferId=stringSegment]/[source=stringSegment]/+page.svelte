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
	import TonJettonTransferView from '$/views/TonJettonTransferView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON jetton transfer'} • TON jetton transfer • Blockhead</title>
</svelte:head>


<Page>
	<TonJettonTransferView
		selection={
			select(EntityType.TonJettonTransfer, {
				$network: data.selector,
				transferId: params.transferId,
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
