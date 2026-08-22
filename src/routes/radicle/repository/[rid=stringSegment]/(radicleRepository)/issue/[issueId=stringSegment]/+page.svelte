<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleIssueView from '$/views/RadicleIssueView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'radicle issue'} • radicle issue • Blockhead</title>
</svelte:head>


<Page>
	<RadicleIssueView
		selection={
			select(EntityType.RadicleIssue, {
				$repository: data.selector,
				issueId: params.issueId,
			})
		}
	/>
</Page>
