<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitPackedObject, {
		packHash: params.packHash,
		objectId: params.objectId,
		objectFormat: params.objectFormat,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitPackedObjectView from '$/views/GitPackedObjectView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.objectId || 'Git packed object'} • Git packed object • Blockhead</title>
</svelte:head>


<Page>
	<GitPackedObjectView
		selection={pageSelection}
	/>
</Page>
