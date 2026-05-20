<script lang="ts">
	// Types/constants
	import type { EvmTraceTree } from '$/schema/EvmTrace.ts'


	// Props
	let {
		traceRoot,
		chainId,
	}: {
		traceRoot: EvmTraceTree
		chainId: number
	} = $props()


	// Components
	import Tree from '$/components/Tree.svelte'
	import EvmTraceContentView from '$/views/EvmTraceContentView.svelte'
</script>


<Tree
	items={[traceRoot]}
	getKey={(trace) => (
		`${trace.index}-${trace.from ?? ''}-${trace.to ?? ''}-${(trace.input ?? '').slice(0, 24)}`
	)}
	getChildren={(trace) => trace.children}
	getIsOpen={() => true}
	listTag="ul"
	listAttrs={{ 'data-column': '' }}
	detailsAttrs={{ 'data-card': '' }}
	summaryAttrs={{}}
>
	{#snippet Content({ node })}
		<EvmTraceContentView
			trace={node}
			{chainId}
		/>
	{/snippet}
</Tree>
