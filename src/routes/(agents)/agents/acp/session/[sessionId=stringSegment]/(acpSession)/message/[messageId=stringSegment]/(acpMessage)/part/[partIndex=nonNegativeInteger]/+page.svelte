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

	const pageSelection = $derived(select(EntityType.AcpMessagePart, {
		$message: data.selector,
		partIndex: Number(params.partIndex),
	}, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			partKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpMessagePartView from '$/views/AcpMessagePartView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'ACP message part' : pageSelection.entity.partKind || 'ACP message part')} • ACP message part • Blockhead</title>
</svelte:head>


<Page>
	<AcpMessagePartView
		selection={pageSelection}
	/>
</Page>
