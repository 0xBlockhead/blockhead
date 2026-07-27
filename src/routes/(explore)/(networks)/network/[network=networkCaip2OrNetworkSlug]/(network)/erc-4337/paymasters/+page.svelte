<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 paymasters • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337PaymastersView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymasters',
				{
					network: String(params.network),
				}
			)
		}
		title='ERC-4337 paymasters'
		selection={select(EntityType.Network, data.selector).Evm.$$erc4337Paymasters}
		id='erc4337-paymasters'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
