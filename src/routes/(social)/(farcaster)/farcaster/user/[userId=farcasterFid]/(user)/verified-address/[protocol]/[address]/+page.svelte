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
	import FarcasterVerifiedAddressView from '$/views/FarcasterVerifiedAddressView.svelte'
</script>


<svelte:head>
	<title>Verified address • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterVerifiedAddressView
		href={
			resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/verified-address/[protocol]/[address]', {
				userId: params.userId,
				protocol: params.protocol,
				address: params.address,
			})
		}
		selection={
			select(EntityType.FarcasterVerifiedAddress, data.selector, {
				fields: {
					$user: true,
					$evmAccount: true,
					$solanaAccount: true,
				},
			})
		}
	/>
</Page>
