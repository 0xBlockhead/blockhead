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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpSubnetCanisterRange_Timestamp, {
		$subnet: data.selector,
		rangeStart: params.rangeStart,
		rangeEnd: params.rangeEnd,
		registryVersion: BigInt(params.registryVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpSubnetCanisterRange_TimestampView from '$/views/IcpSubnetCanisterRange_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP subnet canister range timestamp'} • ICP subnet canister range timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP subnet canister range timestamp'} • ICP subnet canister range timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpSubnetCanisterRange_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
