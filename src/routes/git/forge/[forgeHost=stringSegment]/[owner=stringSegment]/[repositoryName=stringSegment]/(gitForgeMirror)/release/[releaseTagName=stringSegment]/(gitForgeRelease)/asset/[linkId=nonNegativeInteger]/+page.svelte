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

	const pageSelection = $derived(select(EntityType.GitForgeReleaseLink, {
		$release: data.selector,
		linkId: Number(params.linkId),
	}, {
		sources: [
			Source.Gitlab_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeReleaseLinkView from '$/views/GitForgeReleaseLinkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Git forge release link' : pageSelection.entity.name || 'Git forge release link')} • Git forge release link • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeReleaseLinkView
		selection={pageSelection}
	/>
</Page>
