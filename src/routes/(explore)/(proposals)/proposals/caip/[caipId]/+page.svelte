<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		/^\d+$/.test(params.caipId) ?
			{ id: params.caipId }
		:	null,
	)


	// Components
	import CaipsView from '$/views/CaipsView.svelte'
	import CaipView from '$/views/CaipView.svelte'
</script>


{#if entityId != null}
	<CaipView
		{entityId}
		href={resolve(
			'/(explore)/(proposals)/proposals/caip/[caipId]',
			params,
		)}
		open
	>
		{#snippet children()}
			<section>
				<CaipsView
					href={resolve('/proposals/caips')}
					id="caips"
				/>
			</section>
		{/snippet}
	</CaipView>
{:else}
	<p role="alert">
		CAIP id must be a non-empty numeric string.
	</p>
{/if}
