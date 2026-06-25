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
	import GitTagView from '$/views/GitTagView.svelte'
</script>


<Page>
	<GitTagView
		selection={select(EntityType.GitTag, data.selector)}
	/>
</Page>
