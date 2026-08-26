<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterVerifiedAddress, {
		fid: Number(params.userId),
		protocol: params.protocol,
		address: params.address,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterVerifiedAddressView from '$/views/FarcasterVerifiedAddressView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.address || 'Farcaster verified address'} • Farcaster verified address • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterVerifiedAddressView
		selection={pageSelection}
	/>
</Page>
