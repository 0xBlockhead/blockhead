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
	import RadicleSignedRefView from '$/views/RadicleSignedRefView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'radicle signed ref'} • radicle signed ref • Blockhead</title>
</svelte:head>


<Page>
	<RadicleSignedRefView
		selection={select(EntityType.RadicleSignedRef, data.selector)}
	/>
</Page>
