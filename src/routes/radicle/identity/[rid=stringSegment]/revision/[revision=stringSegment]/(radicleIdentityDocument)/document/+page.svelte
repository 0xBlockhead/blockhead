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


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleIdentityRevisionView from '$/views/RadicleIdentityRevisionView.svelte'
</script>


<svelte:head>
	<title>radicle identity revision • radicle identity revision • Blockhead</title>
</svelte:head>


<Page>
	<RadicleIdentityRevisionView
		selection={
			select(EntityType.RadicleIdentityRevision, {
				rid: params.rid,
				revision: params.revision,
			})
		}
	/>
</Page>
