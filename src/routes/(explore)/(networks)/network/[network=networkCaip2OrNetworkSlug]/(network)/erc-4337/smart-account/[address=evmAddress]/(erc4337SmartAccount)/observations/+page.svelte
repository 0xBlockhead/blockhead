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
	import Erc4337SmartAccount_TimestampsView from '$/views/Erc4337SmartAccount_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Smart account observations • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337SmartAccount_TimestampsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations', {
				network: params.network,
				address: params.address,
			})
		}
		title='Smart account observations'
		selection={select(EntityType.Erc4337SmartAccount, data.selector).$$timestamps}
		id='timestamps'
	/>
</Page>
