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
	import StellarOffer_TimestampView from '$/views/StellarOffer_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar offer timestamp'} • stellar offer timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarOffer_TimestampView
		selection={
			select(EntityType.StellarOffer_Timestamp, {
				$offer: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
