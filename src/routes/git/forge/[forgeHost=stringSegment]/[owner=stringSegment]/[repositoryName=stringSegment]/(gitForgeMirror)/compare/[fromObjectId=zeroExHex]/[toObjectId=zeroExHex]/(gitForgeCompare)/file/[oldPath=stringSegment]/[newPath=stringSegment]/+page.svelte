<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitForgeCompareFileChange, {
		$compare: data.selector,
		oldPath: decodeURIComponent(params.oldPath),
		newPath: decodeURIComponent(params.newPath),
	}, {
		sources: [
			Source.Gitlab_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeCompareFileChangeView from '$/views/GitForgeCompareFileChangeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.newPath || 'Git forge compare file change')} • Git forge compare file change • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeCompareFileChangeView
		selection={pageSelection}
	/>
</Page>
