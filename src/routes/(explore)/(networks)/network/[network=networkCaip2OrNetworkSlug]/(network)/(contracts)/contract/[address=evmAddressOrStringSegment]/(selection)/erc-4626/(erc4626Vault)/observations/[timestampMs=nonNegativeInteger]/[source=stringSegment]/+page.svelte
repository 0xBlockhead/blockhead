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

	const pageSelection = $derived(select(EntityType.Erc4626Vault_Timestamp, {
		$vault: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4626Vault_TimestampView from '$/views/Erc4626Vault_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'erc4626 vault timestamp')} • erc4626 vault timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4626Vault_TimestampView
		selection={pageSelection}
	/>
</Page>
