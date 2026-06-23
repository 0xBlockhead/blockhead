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
	import SuiObjectChangeView from '$/views/SuiObjectChangeView.svelte'
</script>


<Page>
	<SuiObjectChangeView
		selection={select(EntityType.SuiObjectChange, data.selector)}
	/>
</Page>
