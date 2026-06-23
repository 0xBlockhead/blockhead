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
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
</script>


<Page>
	<SolanaBlockView
		selection={select(EntityType.SolanaBlock, data.selector)}
	/>
</Page>
