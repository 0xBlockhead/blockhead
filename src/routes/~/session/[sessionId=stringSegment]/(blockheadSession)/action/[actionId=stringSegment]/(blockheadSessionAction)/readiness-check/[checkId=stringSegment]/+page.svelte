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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadActionReadinessCheck, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			checkKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action readiness check' : pageSelection.entity.checkKind || 'blockhead action readiness check')} • blockhead action readiness check • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead action readiness check'} • blockhead action readiness check • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadActionReadinessCheckView
		selection={pageSelection}
	/>
	{/if}
</Page>
