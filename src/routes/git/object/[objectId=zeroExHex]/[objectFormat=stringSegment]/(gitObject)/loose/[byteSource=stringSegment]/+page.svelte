<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitLooseObject, {
		objectId: params.objectId,
		objectFormat: params.objectFormat,
		byteSource: params.byteSource,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitLooseObjectView from '$/views/GitLooseObjectView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.objectId || 'Git loose object'} • Git loose object • Blockhead</title>
</svelte:head>


<Page>
	<GitLooseObjectView
		selection={pageSelection}
	/>
</Page>
