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
	import KaspaAddress_TimestampView from '$/views/KaspaAddress_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'kaspa address timestamp'} • kaspa address timestamp • Blockhead</title>
</svelte:head>


<Page>
	<KaspaAddress_TimestampView
		selection={
			select(EntityType.KaspaAddress_Timestamp, {
				$address: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
