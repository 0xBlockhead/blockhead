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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Eip7702Authorization, {
		$transaction: data.selector,
		authorizationIndex: Number(params.authorizationIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip7702AuthorizationView from '$/views/Eip7702AuthorizationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.authorizationIndex) || 'eip7702 authorization')} • eip7702 authorization • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eip7702 authorization'} • eip7702 authorization • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Eip7702AuthorizationView
		selection={pageSelection}
	/>
	{/if}
</Page>
