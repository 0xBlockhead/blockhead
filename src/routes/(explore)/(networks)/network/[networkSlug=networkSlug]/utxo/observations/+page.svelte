<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	<title>UTXO network observations • Blockhead</title>
</svelte:head>


<Page>
	<Network_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations', {
				networkSlug: params.networkSlug,
			})
		}
		title='UTXO network observations'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			})[EntityProxyField]<EntityType.Network_Timestamp>('$$timestamps')
		}
		id='timestamps'
	/>
</Page>
