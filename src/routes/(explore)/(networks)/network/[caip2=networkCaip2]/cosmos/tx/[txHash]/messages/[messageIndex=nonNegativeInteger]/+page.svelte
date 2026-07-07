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
	import CosmosMessageView from '$/views/CosmosMessageView.svelte'
</script>


<Page>
	<CosmosMessageView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages/[messageIndex=nonNegativeInteger]', {
				caip2: params.caip2,
				txHash: params.txHash,
				messageIndex: params.messageIndex,
			})
		}
		selection={
			select(EntityType.CosmosMessage, {
				$transaction: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					txHash: decodeURIComponent(params.txHash),
				},
				indexInTransaction: Number(params.messageIndex),
			}, {
				fields: {
					typeUrl: true,
					moduleName: true,
					messageName: true,
					signerAddress: true,
					senderAddress: true,
					granterAddress: true,
					granteeAddress: true,
					contractAddress: true,
					funds: true,
					eventTypes: true,
					$signer: true,
				},
			})
		}
	/>
</Page>
