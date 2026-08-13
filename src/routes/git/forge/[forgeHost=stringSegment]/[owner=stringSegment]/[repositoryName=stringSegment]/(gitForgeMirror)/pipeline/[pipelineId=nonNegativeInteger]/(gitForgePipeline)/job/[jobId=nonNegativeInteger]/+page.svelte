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

	const pageSelection = $derived(select(EntityType.GitForgeJob, {
		$pipeline: data.selector,
		jobId: Number(params.jobId),
	}, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeJobView from '$/views/GitForgeJobView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Git forge job' : pageSelection.entity.name || 'Git forge job')} • Git forge job • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeJobView
		selection={pageSelection}
	/>
</Page>
