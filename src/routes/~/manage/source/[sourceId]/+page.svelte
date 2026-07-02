<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<svelte:head>
	<title>source • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSourceView
		href={
			resolve('/~/manage/source/[sourceId]', {
				sourceId: params.sourceId,
			})
		}
		selection={
			select(EntityType.BlockheadSource, data.selector, {
				fields: {
					label: true,
					source: true,
					provider: true,
					endpointUrl: true,
					transportKind: true,
					authKind: true,
					corsMode: true,
					proxyMode: true,
					environmentScope: true,
				},
			})
		}
	/>
</Page>
