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


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleDiscussionCommentView from '$/views/RadicleDiscussionCommentView.svelte'
</script>


<Page>
	<RadicleDiscussionCommentView
		selection={select(EntityType.RadicleDiscussionComment, data.selector)}
	/>
</Page>
