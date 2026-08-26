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

	const pageSelection = $derived(select(EntityType.GitTag, {
		objectId: params.objectId,
		objectFormat: params.objectFormat,
	}, {
		fields: {
			tagName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitTagView from '$/views/GitTagView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.objectId ?? '') || 'Git tag' : [(pageSelection.entity.tagName ?? ''), pageSelection.entitySelector.objectId].filter(Boolean).join(' ') || 'Git tag'} • Git tag • Blockhead</title>
</svelte:head>


<Page>
	<GitTagView
		selection={pageSelection}
	/>
</Page>
