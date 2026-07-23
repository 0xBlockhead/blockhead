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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterVerifiedAddress, {
		fid: Number(params.userId),
		protocol: params.protocol,
		address: params.address,
	}, {
		fields: {
			$user: true,
			$evmAccount: true,
			$solanaAccount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterVerifiedAddressView from '$/views/FarcasterVerifiedAddressView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		fid: Number(params.userId),
		protocol: params.protocol,
		address: params.address,
	}.address) ?? '')].filter(Boolean).join(' ') || 'Farcaster verified address' : [String((({ ...{
		fid: Number(params.userId),
		protocol: params.protocol,
		address: params.address,
	}, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'Farcaster verified address')} • Farcaster verified address • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterVerifiedAddressView
		href={
			resolve('/farcaster/user/[userId=farcasterFid]/verified-address/[protocol=stringSegment]/[address=stringSegment]', {
				userId: params.userId,
				protocol: params.protocol,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
