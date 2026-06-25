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
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<Page>
	<TezosBlockView
		selection={select(EntityType.TezosBlock, data.selector)}
	/>
</Page>
