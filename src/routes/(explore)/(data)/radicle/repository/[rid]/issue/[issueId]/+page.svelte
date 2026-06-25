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
	import RadicleIssueView from '$/views/RadicleIssueView.svelte'
</script>


<Page>
	<RadicleIssueView
		selection={select(EntityType.RadicleIssue, data.selector)}
	/>
</Page>
