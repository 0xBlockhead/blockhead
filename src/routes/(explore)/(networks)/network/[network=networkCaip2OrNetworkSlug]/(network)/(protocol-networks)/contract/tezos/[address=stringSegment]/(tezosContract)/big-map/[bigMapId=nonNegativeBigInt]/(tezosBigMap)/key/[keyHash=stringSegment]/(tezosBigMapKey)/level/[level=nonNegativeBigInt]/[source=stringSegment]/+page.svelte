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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBigMapKey_Timestamp, {
		$bigMapKey: data.selector,
		level: BigInt(params.level),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBigMapKey_TimestampView from '$/views/TezosBigMapKey_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos big map key timestamp'} • tezos big map key timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos big map key timestamp'} • tezos big map key timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBigMapKey_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
