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
	import PolkadotValidator_EraView from '$/views/PolkadotValidator_EraView.svelte'
</script>


<Page>
	<PolkadotValidator_EraView
		selection={select(EntityType.PolkadotValidator_Era, data.selector)}
	/>
</Page>
