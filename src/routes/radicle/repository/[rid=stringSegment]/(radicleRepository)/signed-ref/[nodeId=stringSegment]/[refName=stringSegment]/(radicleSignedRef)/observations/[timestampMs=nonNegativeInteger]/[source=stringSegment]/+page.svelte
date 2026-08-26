<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleSignedRef_Timestamp, {
		$signedRef: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleSignedRef_TimestampView from '$/views/RadicleSignedRef_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle signed ref timestamp'} • radicle signed ref timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle signed ref timestamp'} • radicle signed ref timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleSignedRef_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
