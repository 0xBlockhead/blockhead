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
	import StellarTransaction_TimestampView from '$/views/StellarTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar transaction timestamp'} • stellar transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarTransaction_TimestampView
		selection={
			select(EntityType.StellarTransaction_Timestamp, {
				$transaction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
