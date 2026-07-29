<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadFarcasterAccountConnection, {
		connectionId: params.connectionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$user: true,
			authMethod: true,
			signerAddress: true,
			verifiedAt: true,
			expiresAt: true,
			associationFingerprint: true,
			selected: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<svelte:head>
	<title>{'Blockhead Farcaster account connection'} • Blockhead Farcaster account connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFarcasterAccountConnectionView
		selection={pageSelection}
	/>
</Page>
