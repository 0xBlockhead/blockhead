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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitForgeMirror, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ([pageSelection.entitySelector.owner, pageSelection.entitySelector.repositoryName].filter(Boolean).join(' ') || 'Git forge mirror')} • Git forge mirror • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeMirrorView
		selection={pageSelection}
	/>
</Page>
