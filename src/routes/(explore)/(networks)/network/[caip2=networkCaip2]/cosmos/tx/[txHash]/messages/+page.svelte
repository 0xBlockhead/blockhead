<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import CosmosMessagesView from '$/views/CosmosMessagesView.svelte'
</script>


<svelte:head>
	<title>Cosmos transaction messages • Blockhead</title>
</svelte:head>


<Page>
	<CosmosMessagesView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages', {
				caip2: params.caip2,
				txHash: params.txHash,
			})
		}
		title='Cosmos transaction messages'
		selection={
			select(EntityType.CosmosTransaction, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				txHash: decodeURIComponent(params.txHash),
			})[EntityProxyField]<EntityType.CosmosMessage>('$$messages')
		}
		id='CosmosMessagesView-page'
	/>
</Page>
