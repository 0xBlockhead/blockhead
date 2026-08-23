<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSlashing, {
					$block: data.selector,
					kind: params.kind,
					indexInKind: Number(params.indexInKind),
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInKind ?? '') ? 'Slashing #' + String(pageSelection.entitySelector.indexInKind ?? '') : '') || 'beacon slashing')} • beacon slashing • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'beacon slashing'} • beacon slashing • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSlashing, {
					$block: data.selector,
					kind: params.kind,
					indexInKind: Number(params.indexInKind),
				}))}

		<BeaconSlashingView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
