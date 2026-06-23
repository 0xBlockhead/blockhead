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
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<Page>
	<SorobanWasmView
		selection={select(EntityType.SorobanWasm, data.selector)}
	/>
</Page>
