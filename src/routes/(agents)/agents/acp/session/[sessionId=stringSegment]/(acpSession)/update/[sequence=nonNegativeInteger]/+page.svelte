<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpSessionUpdate, {
		$session: data.selector,
		sequence: Number(params.sequence),
	}, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpSessionUpdateView from '$/views/AcpSessionUpdateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.sequence ?? '') ? 'Update #' + String(pageSelection.entitySelector.sequence ?? '') : '') || 'ACP session update')} • ACP session update • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP session update'} • ACP session update • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpSessionUpdateView
		selection={pageSelection}
	/>
	{/if}
</Page>
