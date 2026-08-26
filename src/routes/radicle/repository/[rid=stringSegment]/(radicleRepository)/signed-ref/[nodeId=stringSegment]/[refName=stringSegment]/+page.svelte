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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleSignedRef, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleSignedRefView from '$/views/RadicleSignedRefView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle signed ref'} • radicle signed ref • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle signed ref'} • radicle signed ref • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleSignedRefView
		selection={pageSelection}
	/>
	{/if}
</Page>
