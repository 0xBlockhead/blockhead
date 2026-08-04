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

	const pageSelection = $derived(select(EntityType.Erc4337SmartAccount_Timestamp, {
		$account: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337SmartAccount_TimestampView from '$/views/Erc4337SmartAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ERC-4337 smart account timestamp')} • ERC-4337 smart account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337SmartAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
