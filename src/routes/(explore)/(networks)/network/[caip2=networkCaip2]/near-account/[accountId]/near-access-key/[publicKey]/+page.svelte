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
	import NearAccessKeyView from '$/views/NearAccessKeyView.svelte'
</script>


<Page>
	<NearAccessKeyView
		selection={select(EntityType.NearAccessKey, data.selector)}
	/>
</Page>
