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

	const pageSelection = $derived(select(EntityType.GitRemote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRemoteView from '$/views/GitRemoteView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.remoteName || 'Git remote')} • Git remote • Blockhead</title>
</svelte:head>


<Page>
	<GitRemoteView
		selection={pageSelection}
	/>
</Page>
