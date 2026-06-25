<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


<Page>
	<BlockheadZcashViewingKeyView
		selection={select(EntityType.BlockheadZcashViewingKey, data.selector)}
	/>
</Page>
