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
	import Erc4337AccountFactory_TimestampsView from '$/views/Erc4337AccountFactory_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account factory observations • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337AccountFactory_TimestampsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations', {
				network: params.network,
				address: params.address,
			})
		}
		title='Account factory observations'
		selection={select(EntityType.Erc4337AccountFactory, data.selector).$$timestamps}
		countResource={select(EntityType.Erc4337AccountFactory, data.selector).$$timestamps.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
