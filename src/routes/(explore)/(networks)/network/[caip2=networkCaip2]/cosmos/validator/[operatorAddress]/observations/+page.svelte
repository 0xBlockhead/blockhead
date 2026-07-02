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
	import CosmosValidator_TimestampsView from '$/views/CosmosValidator_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Cosmos validator observations • Blockhead</title>
</svelte:head>


<Page>
	<CosmosValidator_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations', {
				caip2: params.caip2,
				operatorAddress: params.operatorAddress,
			})
		}
		title='Cosmos validator observations'
		selection={
			select(EntityType.CosmosValidator, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				operatorAddress: decodeURIComponent(params.operatorAddress),
			})[EntityProxyField]<EntityType.CosmosValidator_Timestamp>('$$timestamps')
		}
		id='CosmosValidator_TimestampsView-page'
	/>
</Page>
