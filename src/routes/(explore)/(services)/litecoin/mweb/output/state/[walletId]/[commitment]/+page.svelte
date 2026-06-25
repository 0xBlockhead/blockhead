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
	import BlockheadLitecoinMwebOutputStateView from '$/views/BlockheadLitecoinMwebOutputStateView.svelte'
</script>


<Page>
	<BlockheadLitecoinMwebOutputStateView
		selection={select(EntityType.BlockheadLitecoinMwebOutputState, data.selector)}
	/>
</Page>
