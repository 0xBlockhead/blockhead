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


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'filecoin actor timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin actor timestamp')} • filecoin actor timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinActor_TimestampView
		selection={pageSelection}
	/>
</Page>
