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
	import StellarClaimableBalance_TimestampView from '$/views/StellarClaimableBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar claimable balance timestamp'} • stellar claimable balance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarClaimableBalance_TimestampView
		selection={
			select(EntityType.StellarClaimableBalance_Timestamp, {
				$claimableBalance: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
