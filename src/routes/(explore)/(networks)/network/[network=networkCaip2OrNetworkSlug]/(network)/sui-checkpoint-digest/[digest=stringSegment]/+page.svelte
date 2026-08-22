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
	import SuiCheckpointView from '$/views/SuiCheckpointView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui checkpoint'} • Sui checkpoint • Blockhead</title>
</svelte:head>


<Page>
	<SuiCheckpointView
		selection={
			select(EntityType.SuiCheckpoint, {
				$network: {
					$network: data.selector,
				},
				digest: params.digest,
			})
		}
	/>
</Page>
