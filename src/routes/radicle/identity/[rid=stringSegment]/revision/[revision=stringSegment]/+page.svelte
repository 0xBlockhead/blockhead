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


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleIdentityDocumentView from '$/views/RadicleIdentityDocumentView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'radicle identity document'} • radicle identity document • Blockhead</title>
</svelte:head>


<Page>
	<RadicleIdentityDocumentView
		selection={select(EntityType.RadicleIdentityDocument, data.selector)}
	/>
</Page>
