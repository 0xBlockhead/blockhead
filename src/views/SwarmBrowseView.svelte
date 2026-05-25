<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Props
	let {
		entityId,
	}: {
		entityId?: EntityId<typeof schema, EntityType.SwarmResource>
	} = $props()


	// Components
	import SwarmBrowseEntityChrome from '$/views/SwarmBrowseEntityChrome.svelte'
	import SwarmBrowseForm from '$/views/SwarmBrowseForm.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


{#snippet Form()}
	<SwarmBrowseForm {entityId} />
{/snippet}


{#if entityId !== undefined}
	<SwarmBrowseEntityChrome
		{entityId}
		Form={Form}
	/>
{:else}
	<section
		class="swarm-browser"
		data-column
	>
		{@render Form()}

		<section
			class="swarm-browser-note"
			data-card
			data-column
		>
			<div data-row="wrap align-center gap-2">
				<h2>Browse Swarm</h2>
				<Tooltip
					content="Ethereum Swarm stores content under BZZ root hashes and manifest paths; gateways expose that over HTTPS. That model differs from IPFS CIDs or ordinary single-page URLs."
					contentProps={{ side: 'top' }}
				>
					<abbr
						class="entity-heading-tip"
						aria-label="About Swarm browsing"
					>ⓘ</abbr>
				</Tooltip>
			</div>
		</section>
	</section>
{/if}


<style>
	.swarm-browser {
		gap: 1rem;
	}

	.swarm-browser-note {
		gap: 1rem;
		padding: 1rem;
	}
</style>
