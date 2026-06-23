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
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<Page>
	<CardanoAddressView
		selection={select(EntityType.CardanoAddress, data.selector)}
	/>
</Page>
