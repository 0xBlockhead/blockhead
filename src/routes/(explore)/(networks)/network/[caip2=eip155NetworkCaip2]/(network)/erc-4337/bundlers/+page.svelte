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
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 bundlers • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337BundlersView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundlers', {
				caip2: params.caip2,
			})
		}
		title='ERC-4337 bundlers'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.Erc4337Bundler>('$$erc4337Bundlers')
		}
		id='Erc4337BundlersView-page'
	/>
</Page>
