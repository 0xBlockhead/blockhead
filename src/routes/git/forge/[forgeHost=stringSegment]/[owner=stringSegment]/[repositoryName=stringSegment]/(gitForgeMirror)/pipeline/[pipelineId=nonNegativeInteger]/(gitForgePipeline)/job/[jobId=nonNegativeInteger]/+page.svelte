<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeJobView from '$/views/GitForgeJobView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeJob, {
					$pipeline: data.selector,
					jobId: Number(params.jobId),
				}, {
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Git forge job' : pageSelection.entity.name || 'Git forge job')} • Git forge job • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git forge job'} • Git forge job • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeJob, {
					$pipeline: data.selector,
					jobId: Number(params.jobId),
				}, {
					fields: {
						name: true,
					},
				}))}

		<GitForgeJobView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
