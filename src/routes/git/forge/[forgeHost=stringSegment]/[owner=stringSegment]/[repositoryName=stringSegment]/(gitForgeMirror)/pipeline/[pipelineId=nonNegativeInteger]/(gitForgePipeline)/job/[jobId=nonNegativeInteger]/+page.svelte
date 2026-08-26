<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeJob, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Git forge job' : pageSelection.entity.name || 'Git forge job')} • Git forge job • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge job'} • Git forge job • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeJobView
		selection={pageSelection}
	/>
	{/if}
</Page>
