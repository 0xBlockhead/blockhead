<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<Page>
	<EvmTopicsView
		href={resolve('/evm/topics')}
		selection={select(
			EntityType.EvmProtocol,
			{
				scope: 'EvmProtocol',
			}
		).$$evmTopics}
		id="topics"
	/>
</Page>
