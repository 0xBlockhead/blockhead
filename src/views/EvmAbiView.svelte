<script lang="ts">
	// Types/constants
	import type { EvmAbiEntry } from '$/schema/EvmAbi.ts'


	// State
	let {
		abi,
		emptyText = 'No ABI entries.',
	}: {
		abi: EvmAbiEntry[] | undefined
		emptyText?: string
	} = $props()


	// Functions
	import { evmAbiEntrySignature } from '$/lib/evmAbi.ts'
</script>


{#if abi?.length}
	<div data-column="gap-2">
		<p data-text="muted">{String(abi.length)} ABI entries</p>

		<ul>
			{#each abi as entry, index (String(index))}
				<li>
					<span data-text="annotation">{entry.type}</span>
					<code>{evmAbiEntrySignature(entry)}</code>
					{#if entry.stateMutability != null}
						<span data-text="muted">{entry.stateMutability}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<p data-text="muted">{emptyText}</p>
{/if}
