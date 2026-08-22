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

	const pageSelection = $derived(select(EntityType.GitObject, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.objectId || 'Git object')} • Git object • Blockhead</title>
</svelte:head>


<Page>
	<GitObjectView
		selection={pageSelection}
	/>
</Page>
