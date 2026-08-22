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
	import IcpCanisterMetadata_TimestampView from '$/views/IcpCanisterMetadata_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP canister metadata timestamp'} • ICP canister metadata timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpCanisterMetadata_TimestampView
		selection={
			select(EntityType.IcpCanisterMetadata_Timestamp, {
				$metadata: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
