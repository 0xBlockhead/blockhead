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
	import HederaHbarTransferView from '$/views/HederaHbarTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera HBAR transfer'} • hedera HBAR transfer • Blockhead</title>
</svelte:head>


<Page>
	<HederaHbarTransferView
		selection={
			select(EntityType.HederaHbarTransfer, {
				$transaction: data.selector,
				accountId: params.accountId,
				transferIndex: Number(params.transferIndex),
			})
		}
	/>
</Page>
