<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
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
	import IcpSubnetCanisterRange_TimestampView from '$/views/IcpSubnetCanisterRange_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP subnet canister range timestamp'} • ICP subnet canister range timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpSubnetCanisterRange_TimestampView
		selection={
			select(EntityType.IcpSubnetCanisterRange_Timestamp, {
				$subnet: data.selector,
				rangeStart: params.rangeStart,
				rangeEnd: params.rangeEnd,
				registryVersion: BigInt(params.registryVersion),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
