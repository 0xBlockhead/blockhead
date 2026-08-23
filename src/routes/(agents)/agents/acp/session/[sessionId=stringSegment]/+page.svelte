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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpSession, data.selector, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.sessionId || 'ACP session')} • ACP session • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP session'} • ACP session • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpSession, data.selector, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}

		<AcpSessionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
