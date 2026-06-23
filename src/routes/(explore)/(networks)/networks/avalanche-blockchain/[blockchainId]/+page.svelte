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
	import AvalancheBlockchainView from '$/views/AvalancheBlockchainView.svelte'
</script>


<Page>
	<AvalancheBlockchainView
		selection={select(EntityType.AvalancheBlockchain, data.selector)}
	/>
</Page>
