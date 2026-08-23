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
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadStateChannelDeposit, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? 'blockhead state channel deposit'} • blockhead state channel deposit • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead state channel deposit'} • blockhead state channel deposit • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadStateChannelDeposit, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadStateChannelDepositView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
