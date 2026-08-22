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
	import StellarTrustline_TimestampView from '$/views/StellarTrustline_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar trustline timestamp'} • stellar trustline timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarTrustline_TimestampView
		selection={
			select(EntityType.StellarTrustline_Timestamp, {
				$trustline: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
