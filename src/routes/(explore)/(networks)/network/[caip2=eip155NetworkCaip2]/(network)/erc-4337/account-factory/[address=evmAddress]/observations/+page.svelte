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
	import Erc4337AccountFactory_TimestampsView from '$/views/Erc4337AccountFactory_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account factory observations • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337AccountFactory_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]/observations', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		title='Account factory observations'
		selection={
			select(EntityType.Erc4337AccountFactory, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			})[EntityProxyField]<EntityType.Erc4337AccountFactory_Timestamp>('$$timestamps')
		}
		id='Erc4337AccountFactory_TimestampsView-page'
	/>
</Page>
