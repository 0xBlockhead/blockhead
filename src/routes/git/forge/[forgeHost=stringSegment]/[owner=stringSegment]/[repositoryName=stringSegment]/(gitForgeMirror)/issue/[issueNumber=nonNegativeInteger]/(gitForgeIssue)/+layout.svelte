<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]',
			{
				forgeHost: params.forgeHost,
				owner: params.owner,
				repositoryName: params.repositoryName,
				issueNumber: params.issueNumber,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeIssue, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import GitForgeIssueView from '$/views/GitForgeIssueView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<GitForgeIssueView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
