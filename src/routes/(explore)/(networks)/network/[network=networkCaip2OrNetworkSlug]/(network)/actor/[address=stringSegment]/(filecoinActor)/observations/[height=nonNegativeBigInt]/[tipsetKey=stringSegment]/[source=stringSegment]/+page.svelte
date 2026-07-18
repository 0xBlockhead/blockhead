<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FilecoinActor_Timestamp, {
		$actor: data.selector,
		height: BigInt(params.height),
		tipsetKey: params.tipsetKey,
		source: params.source,
	}, {
		sources: [({
			$actor: data.selector,
			height: BigInt(params.height),
			tipsetKey: params.tipsetKey,
			source: params.source,
		}).source],
		fields: {
			timestampMs: true,
			balanceAttoFil: true,
			$tipset: true,
			idAddress: true,
			actorCodeCid: true,
			nonce: true,
			stateRootCid: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin actor timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin actor timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • filecoin actor timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinActor_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
				network: params.network,
				address: params.address,
				height: params.height,
				tipsetKey: params.tipsetKey,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
