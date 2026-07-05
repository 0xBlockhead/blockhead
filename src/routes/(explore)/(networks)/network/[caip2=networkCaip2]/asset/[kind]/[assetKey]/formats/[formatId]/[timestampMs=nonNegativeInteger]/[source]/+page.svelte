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
	import AssetFormatSupport_TimestampView from '$/views/AssetFormatSupport_TimestampView.svelte'
</script>


<svelte:head>
	<title>asset format support timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AssetFormatSupport_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/formats/[formatId]/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				kind: params.kind,
				assetKey: params.assetKey,
				formatId: params.formatId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.AssetFormatSupport_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					confidence: true,
					evidenceKind: true,
					ledgerCoordinateKind: true,
					ledgerCoordinateValue: true,
					interfaceId: true,
					programId: true,
					moduleId: true,
					contractAddress: true,
					tokenProgram: true,
					notes: true,
				},
			})
		}
	/>
</Page>
