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
	import Eip7702AuthorizationView from '$/views/Eip7702AuthorizationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip7702Authorization, {
					$transaction: data.selector,
					authorizationIndex: Number(params.authorizationIndex),
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.authorizationIndex) || 'eip7702 authorization')} • eip7702 authorization • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'eip7702 authorization'} • eip7702 authorization • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip7702Authorization, {
					$transaction: data.selector,
					authorizationIndex: Number(params.authorizationIndex),
				}))}

		<Eip7702AuthorizationView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
