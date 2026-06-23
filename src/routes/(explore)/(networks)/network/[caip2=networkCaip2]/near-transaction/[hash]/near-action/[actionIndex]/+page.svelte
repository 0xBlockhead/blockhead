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
	import NearActionView from '$/views/NearActionView.svelte'
</script>


<Page>
	<NearActionView
		selection={select(EntityType.NearAction, data.selector)}
	/>
</Page>
