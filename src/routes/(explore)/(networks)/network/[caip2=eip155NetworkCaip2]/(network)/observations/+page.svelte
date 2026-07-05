<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_TimestampsView from '$/views/EvmNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Observations • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/observations', {
				caip2: params.caip2,
			})
		}
		title='Observations'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.EvmNetwork_Timestamp>('$$timestamps', {
				sources: [
					Source.Voltaire_JsonRpc,
				],
			})
		}
		id='timestamps'
	/>
</Page>
