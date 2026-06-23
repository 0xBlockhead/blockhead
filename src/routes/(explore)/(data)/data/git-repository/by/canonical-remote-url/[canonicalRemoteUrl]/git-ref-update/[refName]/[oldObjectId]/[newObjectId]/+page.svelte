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
	import GitRefUpdateView from '$/views/GitRefUpdateView.svelte'
</script>


<Page>
	<GitRefUpdateView
		selection={select(EntityType.GitRefUpdate, data.selector)}
	/>
</Page>
