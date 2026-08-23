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
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadActionReadinessCheck, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						checkKind: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action readiness check' : pageSelection.entity.checkKind || 'blockhead action readiness check')} • blockhead action readiness check • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead action readiness check'} • blockhead action readiness check • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadActionReadinessCheck, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						checkKind: true,
					},
				}))}

		<BlockheadActionReadinessCheckView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
