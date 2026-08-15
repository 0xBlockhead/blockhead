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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitForgeCompare, data.selector, {
		sources: [
			Source.Gitlab_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeCompareView from '$/views/GitForgeCompareView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ([pageSelection.entitySelector.fromObjectId, pageSelection.entitySelector.toObjectId].filter(Boolean).join(' ') || 'Git forge compare')} • Git forge compare • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeCompareView
		selection={pageSelection}
	/>
</Page>
