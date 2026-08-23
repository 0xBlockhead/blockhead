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
	import SuiObjectVersionView from '$/views/SuiObjectVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiObjectVersion, {
					$network: data.selector,
					objectId: params.objectId,
					version: BigInt(params.version),
					digest: params.digest,
				}))}
			<title>{data?.title ?? 'Sui object version'} • Sui object version • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Sui object version'} • Sui object version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiObjectVersion, {
					$network: data.selector,
					objectId: params.objectId,
					version: BigInt(params.version),
					digest: params.digest,
				}))}

		<SuiObjectVersionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
