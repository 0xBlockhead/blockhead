<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AcpFileOperationView from '$/views/AcpFileOperationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpFileOperation, {
					$session: data.selector,
					operationId: params.operationId,
				}, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.operationId || 'ACP file operation')} • ACP file operation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP file operation'} • ACP file operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpFileOperation, {
					$session: data.selector,
					operationId: params.operationId,
				}, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}

		<AcpFileOperationView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
