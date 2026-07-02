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
	import CosmosAccount_TimestampsView from '$/views/CosmosAccount_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Cosmos account observations • Blockhead</title>
</svelte:head>


<Page>
	<CosmosAccount_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		title='Cosmos account observations'
		selection={
			select(EntityType.CosmosAccount, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			})[EntityProxyField]<EntityType.CosmosAccount_Timestamp>('$$timestamps')
		}
		id='CosmosAccount_TimestampsView-page'
	/>
</Page>
