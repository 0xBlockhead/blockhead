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
	import IcpCanister_TimestampView from '$/views/IcpCanister_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ICP canister timestamp'} • ICP canister timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpCanister_TimestampView
		selection={
			select(EntityType.IcpCanister_Timestamp, {
				$canister: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
