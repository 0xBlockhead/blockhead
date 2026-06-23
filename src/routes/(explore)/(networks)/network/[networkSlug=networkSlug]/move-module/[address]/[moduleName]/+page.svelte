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
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<Page>
	<MoveModuleView
		selection={select(EntityType.MoveModule, data.selector)}
	/>
</Page>
