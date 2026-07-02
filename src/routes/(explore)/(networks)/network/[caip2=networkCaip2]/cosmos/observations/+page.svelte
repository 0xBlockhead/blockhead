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
	import CosmosNetwork_TimestampsView from '$/views/CosmosNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Cosmos network observations • Blockhead</title>
</svelte:head>


<Page>
	<CosmosNetwork_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/observations', {
				caip2: params.caip2,
			})
		}
		title='Cosmos network observations'
		selection={
			select(EntityType.CosmosNetwork, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
			})[EntityProxyField]<EntityType.CosmosNetwork_Timestamp>('$$timestamps')
		}
		id='CosmosNetwork_TimestampsView-page'
	/>
</Page>
