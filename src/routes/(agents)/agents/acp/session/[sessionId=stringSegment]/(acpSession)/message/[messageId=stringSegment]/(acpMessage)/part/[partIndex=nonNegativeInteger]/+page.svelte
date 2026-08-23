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
	import AcpMessagePartView from '$/views/AcpMessagePartView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpMessagePart, {
					$message: data.selector,
					partIndex: Number(params.partIndex),
				}, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
					fields: {
						partKind: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'ACP message part' : pageSelection.entity.partKind || 'ACP message part')} • ACP message part • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP message part'} • ACP message part • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpMessagePart, {
					$message: data.selector,
					partIndex: Number(params.partIndex),
				}, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
					fields: {
						partKind: true,
					},
				}))}

		<AcpMessagePartView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
