<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'EVM'}
		href={resolve('/evm')}
	>
		{#snippet children()}
			<section>
				<EvmTopicsView
					href={resolve('/evm/topics')}
					id="evm-topics"
					open={false}
				/>
			</section>

			<section>
				<EvmSelectorsView
					href={resolve('/evm/selectors')}
					id="evm-selectors"
					open={false}
				/>
			</section>

			<section>
				<EvmErrorsView
					href={resolve('/evm/errors')}
					id="evm-errors"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
