<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		data,
	}: PageProps = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<Page>
	<EvmSelectorView
		selection={
			select(
				EntityType.EvmSelector,
				data.selector
			)
		}
	/>
</Page>
