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
	import IssuerPowerView from '$/views/IssuerPowerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IssuerPower, {
					$profile: data.selector,
					powerKind: params.powerKind,
					actorKey: params.actorKey,
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'issuer power'} • issuer power • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'issuer power'} • issuer power • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IssuerPower, {
					$profile: data.selector,
					powerKind: params.powerKind,
					actorKey: params.actorKey,
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<IssuerPowerView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
