<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.McpResourceTemplate, {
		$server: data.selector,
		uriTemplate: params.uriTemplate,
	}, {
		sources: [
			Source.McpDeclared_Protocol,
		],
		fields: {
			title: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpResourceTemplateView from '$/views/McpResourceTemplateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.uriTemplate ?? '') || 'mcp resource template' : (pageSelection.entity.title ?? '') || [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.uriTemplate].filter(Boolean).join(' ') || 'mcp resource template')} • mcp resource template • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'mcp resource template'} • mcp resource template • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<McpResourceTemplateView
		selection={pageSelection}
	/>
	{/if}
</Page>
