<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<Page>
	<UrlView selection={select(EntityType.Url, data.selector)} />
</Page>
