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
	import LensAccountManagerView from '$/views/LensAccountManagerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LensAccountManager, {
					$account: data.selector,
					manager: params.manager,
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.manager || 'Lens account manager')} • Lens account manager • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Lens account manager'} • Lens account manager • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LensAccountManager, {
					$account: data.selector,
					manager: params.manager,
				}))}

		<LensAccountManagerView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
