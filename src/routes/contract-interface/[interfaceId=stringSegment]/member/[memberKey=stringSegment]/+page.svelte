<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ContractInterfaceMember, {
		interfaceId: params.interfaceId,
		memberKey: params.memberKey,
	}, {
		fields: {
			name: true,
			canonicalSignature: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ContractInterfaceMemberView from '$/views/ContractInterfaceMemberView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.memberKey ?? '') || 'contract interface member' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.canonicalSignature ?? ''), pageSelection.entitySelector.memberKey].filter(Boolean).join(' ') || 'contract interface member'} • contract interface member • Blockhead</title>
</svelte:head>


<Page>
	<ContractInterfaceMemberView
		selection={pageSelection}
	/>
</Page>
