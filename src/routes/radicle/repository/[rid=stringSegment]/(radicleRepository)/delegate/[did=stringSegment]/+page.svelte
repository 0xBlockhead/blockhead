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
	import RadicleDelegateView from '$/views/RadicleDelegateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'radicle delegate'} • radicle delegate • Blockhead</title>
</svelte:head>


<Page>
	<RadicleDelegateView
		selection={
			select(EntityType.RadicleDelegate, {
				$repository: data.selector,
				did: params.did,
			})
		}
	/>
</Page>
