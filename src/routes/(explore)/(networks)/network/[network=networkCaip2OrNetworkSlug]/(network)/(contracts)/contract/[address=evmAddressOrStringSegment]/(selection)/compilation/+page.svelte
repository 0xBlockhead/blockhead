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

	const pageSelection = $derived(select(EntityType.EvmContractCompilation, {
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
	<title>{data?.title ?? (pageSelection.entity == null ? 'EVM contract compilation' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.fullyQualifiedName ?? ''), (pageSelection.entity.compiler ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')} • EVM contract compilation • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractCompilationView
		selection={pageSelection}
	/>
</Page>
