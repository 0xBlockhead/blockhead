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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AtprotoActor, data.selector, {
					sources: [
						Source.Atproto_Xrpc,
						Source.Atproto_BskySocial_Xrpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.did || 'AT Protocol account')} • AT Protocol account • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AT Protocol account'} • AT Protocol account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AtprotoActor, data.selector, {
					sources: [
						Source.Atproto_Xrpc,
						Source.Atproto_BskySocial_Xrpc,
					],
				}))}

		<AtprotoActorView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
