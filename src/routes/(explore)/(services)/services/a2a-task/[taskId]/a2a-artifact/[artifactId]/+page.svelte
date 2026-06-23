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
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
</script>


<Page>
	<A2aArtifactView
		selection={select(EntityType.A2aArtifact, data.selector)}
	/>
</Page>
