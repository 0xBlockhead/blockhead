<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<Page>
	<EvmSelectorView
		selection={select(EntityType.EvmSelector, data.selector)}
	/>
</Page>
