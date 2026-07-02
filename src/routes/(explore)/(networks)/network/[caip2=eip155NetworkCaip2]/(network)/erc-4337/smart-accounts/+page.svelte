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
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 smart accounts • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337SmartAccountsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/smart-accounts', {
				caip2: params.caip2,
			})
		}
		title='ERC-4337 smart accounts'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.Erc4337SmartAccount>('$$erc4337SmartAccounts')
		}
		id='Erc4337SmartAccountsView-page'
	/>
</Page>
