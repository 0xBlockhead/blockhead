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
	import StellarAccount_TimestampView from '$/views/StellarAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar account timestamp'} • stellar account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarAccount_TimestampView
		selection={
			select(EntityType.StellarAccount_Timestamp, {
				$account: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
