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
	import BlockheadAgentProgramInstallView from '$/views/BlockheadAgentProgramInstallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentProgramInstall, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.installId || 'blockhead agent program install')} • blockhead agent program install • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead agent program install'} • blockhead agent program install • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentProgramInstall, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadAgentProgramInstallView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
