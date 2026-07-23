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

	const pageSelection = $derived(select(EntityType.FilecoinMiner, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.minerAddress) ?? '')].filter(Boolean).join(' ') || 'filecoin miner' : [String((({ ...data.selector, ...pageSelection.entity }).minerAddress) ?? '')].filter(Boolean).join(' ') || 'filecoin miner'))} • filecoin miner • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMinerView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
				network: params.network,
				minerAddress: params.minerAddress,
			})
		}
		selection={pageSelection}
	/>
</Page>
