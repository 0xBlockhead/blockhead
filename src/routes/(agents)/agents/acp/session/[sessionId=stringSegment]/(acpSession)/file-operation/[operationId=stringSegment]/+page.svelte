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

	const pageSelection = $derived(select(EntityType.AcpFileOperation, {
		$session: data.selector,
		operationId: params.operationId,
	}, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpFileOperationView from '$/views/AcpFileOperationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.operationId || 'ACP file operation')} • ACP file operation • Blockhead</title>
</svelte:head>


<Page>
	<AcpFileOperationView
		selection={pageSelection}
	/>
</Page>
