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
	import LitecoinMwebPegInView from '$/views/LitecoinMwebPegInView.svelte'
</script>


<Page>
	<LitecoinMwebPegInView
		selection={select(EntityType.LitecoinMwebPegIn, data.selector)}
	/>
</Page>
