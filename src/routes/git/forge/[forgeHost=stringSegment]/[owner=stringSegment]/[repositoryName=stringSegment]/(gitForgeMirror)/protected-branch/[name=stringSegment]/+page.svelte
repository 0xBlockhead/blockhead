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

	const pageSelection = $derived(select(EntityType.GitForgeProtectedBranch, {
		$forgeMirror: data.selector,
		name: params.name,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeProtectedBranchView from '$/views/GitForgeProtectedBranchView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.name || 'Git forge protected branch')} • Git forge protected branch • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeProtectedBranchView
		selection={pageSelection}
	/>
</Page>
