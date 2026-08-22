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

	const pageSelection = $derived(select(EntityType.GitPackfile, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitPackfileView from '$/views/GitPackfileView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.packHash || 'Git packfile')} • Git packfile • Blockhead</title>
</svelte:head>


<Page>
	<GitPackfileView
		selection={pageSelection}
	/>
</Page>
