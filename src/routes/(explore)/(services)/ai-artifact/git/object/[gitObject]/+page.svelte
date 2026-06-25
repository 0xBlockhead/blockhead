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
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<Page>
	<AiArtifactView
		selection={select(EntityType.AiArtifact, data.selector)}
	/>
</Page>
