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
	import CronosNetworkProfileView from '$/views/CronosNetworkProfileView.svelte'
</script>


<Page>
	<CronosNetworkProfileView
		selection={select(EntityType.CronosNetworkProfile, data.selector)}
	/>
</Page>
