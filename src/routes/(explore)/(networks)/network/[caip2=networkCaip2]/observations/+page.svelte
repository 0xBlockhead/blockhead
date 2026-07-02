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
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Network observations • Blockhead</title>
</svelte:head>


<Page>
	<Network_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/observations', {
				caip2: params.caip2,
			})
		}
		title='Network observations'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.Network_Timestamp>('$$timestamps')
		}
		id='Network_TimestampsView-page'
	/>
</Page>
