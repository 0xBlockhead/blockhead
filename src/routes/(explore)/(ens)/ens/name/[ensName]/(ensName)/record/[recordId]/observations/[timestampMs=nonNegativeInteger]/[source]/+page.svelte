<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecord_TimestampView from '$/views/EnsRecord_TimestampView.svelte'
</script>


<svelte:head>
	<title>ENS record observation • Blockhead</title>
</svelte:head>


<Page>
	<EnsRecord_TimestampView
		href={
			resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/record/[recordId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				ensName: params.ensName,
				recordId: params.recordId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EnsRecord_Timestamp, data.selector, {
				fields: {
					value: true,
				},
			})
		}
	/>
</Page>
