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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmContractCompilation, {
		$contract: data.selector,
	}, {
		fields: {
			name: true,
			fullyQualifiedName: true,
			compiler: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM contract compilation' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.fullyQualifiedName ?? ''), (pageSelection.entity.compiler ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')} • EVM contract compilation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM contract compilation'} • EVM contract compilation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmContractCompilationView
		selection={pageSelection}
	/>
	{/if}
</Page>
