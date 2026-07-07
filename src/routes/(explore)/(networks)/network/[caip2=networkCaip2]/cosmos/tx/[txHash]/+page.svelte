<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<Page>
	<CosmosTransactionView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
				caip2: params.caip2,
				txHash: params.txHash,
			})
		}
		selection={
			select(EntityType.CosmosTransaction, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				txHash: decodeURIComponent(params.txHash),
			}, {
				fields: {
					code: true,
					gasUsed: true,
					codespace: true,
					gasWanted: true,
					feeAmount: true,
					feeGasLimit: true,
					memo: true,
					timeoutHeight: true,
					signerAddresses: true,
					signatures: true,
					eventTypes: true,
					$block: true,
					rawLog: true,
				},
			})
		}
	/>
</Page>
