<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337Paymaster_TimestampsView from '$/views/Erc4337Paymaster_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Paymaster observations • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337Paymaster_TimestampsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations', {
				network: params.network,
				address: params.address,
			})
		}
		title='Paymaster observations'
		selection={select(EntityType.Erc4337Paymaster, data.selector).$$timestamps}
		countResource={select(EntityType.Erc4337Paymaster, data.selector).$$timestamps.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
