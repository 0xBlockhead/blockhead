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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RadiclePatchView from '$/views/RadiclePatchView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'radicle patch'} • radicle patch • Blockhead</title>
</svelte:head>


<Page>
	<RadiclePatchView
		selection={
			select(EntityType.RadiclePatch, {
				$repository: data.selector,
				patchId: params.patchId,
			})
		}
	/>
</Page>
