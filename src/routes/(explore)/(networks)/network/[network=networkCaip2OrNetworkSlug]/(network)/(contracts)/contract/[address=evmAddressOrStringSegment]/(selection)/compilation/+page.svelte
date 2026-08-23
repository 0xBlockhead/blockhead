<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmContractCompilation, {
				$contract: data.selector,
			}, {
				fields: {
					name: true,
					fullyQualifiedName: true,
					compiler: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM contract compilation' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.fullyQualifiedName ?? ''), (pageSelection.entity.compiler ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')} • EVM contract compilation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM contract compilation'} • EVM contract compilation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmContractCompilation, {
				$contract: data.selector,
			}, {
				fields: {
					name: true,
					fullyQualifiedName: true,
					compiler: true,
				},
			})}

	<EvmContractCompilationView
		selection={pageSelection}
	/>
	{/if}
</Page>
