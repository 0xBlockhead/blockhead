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

	const pageSelection = $derived(select(EntityType.GitRefUpdate, {
		$repository: data.selector,
		refName: params.refName,
		oldObjectId: params.oldObjectId,
		newObjectId: params.newObjectId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefUpdateView from '$/views/GitRefUpdateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.refName || 'Git ref update')} • Git ref update • Blockhead</title>
</svelte:head>


<Page>
	<GitRefUpdateView
		selection={pageSelection}
	/>
</Page>
