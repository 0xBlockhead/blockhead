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

	const pageSelection = $derived(select(EntityType.AcpPermissionRequest, {
		$session: data.selector,
		requestId: params.requestId,
	}, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpPermissionRequestView from '$/views/AcpPermissionRequestView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.requestId || 'ACP permission request')} • ACP permission request • Blockhead</title>
</svelte:head>


<Page>
	<AcpPermissionRequestView
		selection={pageSelection}
	/>
</Page>
