<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LensAccountManager, {
		$account: data.selector,
		manager: params.manager,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountManagerView from '$/views/LensAccountManagerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.manager || 'Lens account manager')} • Lens account manager • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens account manager'} • Lens account manager • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LensAccountManagerView
		selection={pageSelection}
	/>
	{/if}
</Page>
