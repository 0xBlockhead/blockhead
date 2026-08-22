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
	import IcpCanisterLog_TimestampView from '$/views/IcpCanisterLog_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP canister log timestamp'} • ICP canister log timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpCanisterLog_TimestampView
		selection={
			select(EntityType.IcpCanisterLog_Timestamp, {
				$canister: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
