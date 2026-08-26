<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpPermissionRequest, {
		$session: data.selector,
		requestId: params.requestId,
	}, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpPermissionRequestView from '$/views/AcpPermissionRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.requestId || 'ACP permission request')} • ACP permission request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP permission request'} • ACP permission request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpPermissionRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
