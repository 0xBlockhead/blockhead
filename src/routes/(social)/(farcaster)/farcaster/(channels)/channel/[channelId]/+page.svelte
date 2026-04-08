<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
	<FarcasterChannelView
		entityId={{ id: params.channelId }}
		href={resolve(
			'/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]',
			params,
		)}
	>
		{#snippet children()}
			<section>
				<FarcasterCastsView
					id="casts"
					title="Casts"
					href={resolve('/farcaster/feed')}
					limit={50}
					parentEntityType={EntityType.FarcasterChannel}
					parentEntityId={{
						id: params.channelId,
					}}
				/>
			</section>
		{/snippet}
	</FarcasterChannelView>
</Page>
