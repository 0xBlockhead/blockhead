<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionView
		selection={select(EntityType.BlockheadFarcasterAccountConnection, { fid: Number(params.accountId) })}
		title={'Account'}
	/>
</Page>
