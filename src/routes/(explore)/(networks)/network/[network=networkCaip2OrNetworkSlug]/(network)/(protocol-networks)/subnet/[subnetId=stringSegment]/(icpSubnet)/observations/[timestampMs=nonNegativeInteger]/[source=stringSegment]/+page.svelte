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
	import IcpSubnet_TimestampView from '$/views/IcpSubnet_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ICP subnet timestamp'} • ICP subnet timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpSubnet_TimestampView
		selection={
			select(EntityType.IcpSubnet_Timestamp, {
				$subnet: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
