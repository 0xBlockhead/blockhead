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

	const pageSelection = $derived(select(EntityType.GitForgeRelease, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeReleaseView from '$/views/GitForgeReleaseView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.releaseTagName ?? '') || 'Git forge release' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.releaseTagName || 'Git forge release')} • Git forge release • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeReleaseView
		selection={pageSelection}
	/>
</Page>
