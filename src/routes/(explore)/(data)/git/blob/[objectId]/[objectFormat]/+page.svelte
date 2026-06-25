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
	import GitBlobView from '$/views/GitBlobView.svelte'
</script>


<Page>
	<GitBlobView
		selection={select(EntityType.GitBlob, data.selector)}
	/>
</Page>
